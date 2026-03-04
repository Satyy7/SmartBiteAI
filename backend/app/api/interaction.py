from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.database import get_db
from app.models.interaction import Interaction
from app.schemas.interaction import InteractionCreate, InteractionResponse
from app.models.user import User
from app.models.food import Food
from sqlalchemy import desc

router = APIRouter(prefix="/interactions", tags=["Interactions"])


@router.post("/", response_model=InteractionResponse)
async def log_interaction(
    interaction_data: InteractionCreate,
    db: AsyncSession = Depends(get_db)
):
    # Optional validation: ensure user and food exist
    user_check = await db.execute(select(User).where(User.id == interaction_data.user_id))
    food_check = await db.execute(select(Food).where(Food.id == interaction_data.food_id))

    if not user_check.scalar_one_or_none():
        return {"error": "User not found"}

    if not food_check.scalar_one_or_none():
        return {"error": "Food not found"}

    interaction = Interaction(**interaction_data.dict())

    db.add(interaction)
    await db.commit()
    await db.refresh(interaction)

    return interaction

@router.get("/user/{user_id}", response_model=list[InteractionResponse])
async def get_user_interactions(
    user_id: int,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Interaction)
        .where(Interaction.user_id == user_id)
        .order_by(desc(Interaction.timestamp))
        .limit(10)
    )

    interactions = result.scalars().all()
    return interactions