from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models.food import Food
from app.schemas.food import FoodCreate, FoodUpdate, FoodResponse
from app.core.dependencies import require_admin


router = APIRouter(
    prefix="/admin/foods",
    tags=["Admin - Foods"],
    dependencies=[Depends(require_admin)]  # 🔐 Protect entire router
)


# ✅ CREATE FOOD
@router.post("/", response_model=FoodResponse)
async def create_food(
    food: FoodCreate,
    db: AsyncSession = Depends(get_db)
):
    new_food = Food(**food.model_dump())

    db.add(new_food)
    await db.commit()
    await db.refresh(new_food)

    return new_food


# ✅ UPDATE FOOD (Partial Update)
@router.put("/{food_id}", response_model=FoodResponse)
async def update_food(
    food_id: int,
    food_data: FoodUpdate,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Food).where(Food.id == food_id)
    )
    food = result.scalar_one_or_none()

    if not food:
        raise HTTPException(status_code=404, detail="Food not found")

    update_data = food_data.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(food, key, value)

    await db.commit()
    await db.refresh(food)

    return food


# ✅ DELETE FOOD
@router.delete("/{food_id}")
async def delete_food(
    food_id: int,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Food).where(Food.id == food_id)
    )
    food = result.scalar_one_or_none()

    if not food:
        raise HTTPException(status_code=404, detail="Food not found")

    await db.delete(food)
    await db.commit()

    return {"message": "Food deleted successfully"}