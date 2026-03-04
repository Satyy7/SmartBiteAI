import asyncio
from sqlalchemy import select

from app.database import AsyncSessionLocal
from app.models.food import Food
from app.services.embedding_service import EmbeddingService


def build_embedding_text(food: Food) -> str:
    """
    Build rich semantic text for embedding.
    This directly affects search & recommendation quality.
    """
    return (
        f"{food.name}. "
        f"{food.description or ''}. "
        f"Cuisine: {food.cuisine}. "
        f"Spice level: {food.spice_level}/5. "
        f"Calories: {food.calories}. "
        f"Protein: {food.protein_grams}g. "
        f"Fat: {food.fat_grams}g. "
        f"Carbs: {food.carbs_grams}g. "
        f"Fiber: {food.fiber_grams}g. "
        f"Vegetarian: {food.is_veg}. "
        f"Vegan: {food.is_vegan}."
    )


async def seed_embeddings():
    service = EmbeddingService()

    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(Food).where(Food.embedding.is_(None))
        )
        foods = result.scalars().all()

        if not foods:
            print("No foods need embedding.")
            return

        print(f"Found {len(foods)} foods to embed...")

        texts = [build_embedding_text(food) for food in foods]

        embeddings = await service.embed_texts(texts)

        for food, embedding in zip(foods, embeddings):
            food.embedding = embedding

        await session.commit()

        print(f"Successfully embedded {len(foods)} foods.")


if __name__ == "__main__":
    asyncio.run(seed_embeddings())