from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text, select
from typing import Optional

from app.services.embedding_service import EmbeddingService
from app.services.intent_service import extract_intent
from app.services.preference_service import extract_user_preferences
from app.models.food import Food

from google import genai
from app.config import GEMINI_API_KEY


client = genai.Client(api_key=GEMINI_API_KEY)


class AssistantService:

    async def handle_query(
        self,
        query: str,
        db: AsyncSession,
        user_id: Optional[int] = None
    ):

        embedding_service = EmbeddingService()

        # 1️⃣ Embed query
        query_vector = await embedding_service.embed_query(query)

        # 2️⃣ Extract intent
        intent = extract_intent(query)

        # 3️⃣ Base semantic retrieval (top 5)
        result = await db.execute(
            text("""
                SELECT id
                FROM food_items
                ORDER BY embedding <=> CAST(:query_vector AS vector)
                LIMIT 5;
            """),
            {"query_vector": str(query_vector)}
        )

        ids = [row[0] for row in result.all()]

        if not ids:
            return {
                "assistant_message": "Sorry, I couldn't find suitable options.",
                "foods": []
            }

        foods_result = await db.execute(
            select(Food).where(Food.id.in_(ids))
        )
        foods = foods_result.scalars().all()

        # Preserve ranking order
        food_map = {food.id: food for food in foods}
        ranked_foods = [food_map[fid] for fid in ids if fid in food_map]

        # 4️⃣ Fetch user behavioral profile (if exists)
        user_profile_text = "No prior history available."
        if user_id:
            user_profile = await extract_user_preferences(user_id, db)
            if user_profile and user_profile.get("preferences") is None:
                user_profile_text = "No meaningful past interactions."
            elif user_profile:
                user_profile_text = str(user_profile)

        # 5️⃣ Build structured food context
        context_block = ""

        for food in ranked_foods:
            context_block += f"""
Name: {food.name}
Cuisine: {food.cuisine}
Price: ₹{food.price}
Protein: {food.protein_grams}g
Calories: {food.calories}
Carbs: {food.carbs_grams}g
Fiber: {food.fiber_grams}g
Spice Level: {food.spice_level}/5
Popularity: {food.popularity_score}/10
---
"""

        # 6️⃣ Build intelligent prompt
        prompt = f"""
You are SmartBite AI Food Assistant.

User Query:
"{query}"

Detected Intent Signals:
- Protein Weight: {intent['protein_weight']}
- Calorie Weight: {intent['calorie_weight']}
- Carb Weight: {intent['carb_weight']}
- Fiber Weight: {intent['fiber_weight']}
- Spice Preference: {intent['spice_target']}
- Cuisine Filter: {intent['cuisine']}
- Price Cap: {intent['price_cap']}

User Behavioral Profile:
{user_profile_text}

Top Retrieved Food Options:
{context_block}

Instructions:
1. First explain how the recommendations match the query intent.
2. If user history exists, explain how results align with past preferences.
3. Keep explanation concise and natural.
4. Do not invent food items.
5. Only refer to provided foods.
"""

        # 7️⃣ Generate explanation
        try:
            response = await client.aio.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
            )

            assistant_message = response.text

        except Exception as e:
            # Gemini quota or API error fallback
            assistant_message = (
                "SmartBite AI is currently experiencing high demand to generate summary for you. "
                "Here are the best matching dishes based on your query."
            )

        return {
            "assistant_message": assistant_message,
            "foods": ranked_foods
        }