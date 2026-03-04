from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from collections import Counter

from app.models.interaction import Interaction
from app.models.food import Food




async def extract_user_preferences(user_id: int, db: AsyncSession):

    # Get last 10 interactions
    result = await db.execute(
        select(Interaction)
        .where(Interaction.user_id == user_id)
        .order_by(desc(Interaction.timestamp))
        .limit(10)
    )

    interactions = result.scalars().all()

    if not interactions:
        return {
            "message": "No interactions found",
            "preferences": None
        }

    food_ids = [i.food_id for i in interactions]

    food_result = await db.execute(
        select(Food).where(Food.id.in_(food_ids))
    )

    foods = food_result.scalars().all()

    total = len(foods)

    # Cuisine preference
    cuisines = Counter([f.cuisine for f in foods if f.cuisine])

    # Nutrition averages
    avg_spice = sum(f.spice_level for f in foods) / total
    avg_protein = sum(f.protein_grams for f in foods) / total
    avg_fat = sum(f.fat_grams for f in foods) / total
    avg_fiber = sum(f.fiber_grams for f in foods) / total
    avg_carbs = sum(f.carbs_grams for f in foods) / total
    avg_calories = sum(f.calories for f in foods) / total

    # Dietary ratios
    veg_ratio = sum(1 for f in foods if f.is_veg) / total
    vegan_ratio = sum(1 for f in foods if f.is_vegan) / total

    return {
        "top_cuisine": cuisines.most_common(1)[0][0] if cuisines else None,
        "behavioral_profile": {
            "avg_spice_level": round(avg_spice, 2),
            "avg_protein": round(avg_protein, 2),
            "avg_fat": round(avg_fat, 2),
            "avg_fiber": round(avg_fiber, 2),
            "avg_carbs": round(avg_carbs, 2),
            "avg_calories": round(avg_calories, 2),
            "veg_ratio": round(veg_ratio, 2),
            "vegan_ratio": round(vegan_ratio, 2)
        }
    }