from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.services.preference_service import extract_user_preferences

from sqlalchemy import select, text
from app.models.interaction import Interaction
from app.models.food import Food
from app.services.recommendation_service import RecommendationService
from app.schemas.food import FoodResponse
from app.services.reorder_service import ReorderService
from sqlalchemy import select, text, bindparam

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/{user_id}/preferences")
async def get_user_preferences(
    user_id: int,
    db: AsyncSession = Depends(get_db)
):
    preferences = await extract_user_preferences(user_id, db)
    return preferences

@router.get("/{user_id}/recommendations", response_model=list[FoodResponse])
async def get_recommendations(
    user_id: int,
    db: AsyncSession = Depends(get_db)
):
    service = RecommendationService()

    # 1️⃣ Compute user embedding
    user_vector = await service.get_user_embedding(user_id, db)

    # If no interactions → fallback to popular foods
    if user_vector is None:
        result = await db.execute(
            select(Food)
            .order_by(Food.popularity_score.desc())
            .limit(10)
        )
        return result.scalars().all()

    # 2️⃣ Get already interacted food IDs
    interacted_result = await db.execute(
        select(Interaction.food_id)
        .where(Interaction.user_id == user_id)
    )

    interacted_ids = [row[0] for row in interacted_result.all()]

    # 3️⃣ Recommend similar foods (exclude already interacted)
    stmt = (
        text("""
            SELECT *
            FROM food_items
            WHERE id NOT IN :excluded_ids
            ORDER BY embedding <=> CAST(:user_vector AS vector)
            LIMIT 10;
        """)
        .bindparams(bindparam("excluded_ids", expanding=True))
    )

    result = await db.execute(
        stmt,
        {
            "user_vector": str(user_vector),
            "excluded_ids": interacted_ids if interacted_ids else [0],
        }
    )

    # Convert rows to Food ORM objects
    rows = result.mappings().all()

    # Map manually into Food model objects
    return [Food(**row) for row in rows]

@router.get("/{user_id}/reorder", response_model=list[FoodResponse])
async def get_reorder_items(
    user_id: int,
    db: AsyncSession = Depends(get_db)
):
    service = ReorderService()
    return await service.get_reorder_items(user_id, db)