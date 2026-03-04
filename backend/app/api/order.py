from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.order import OrderResponse
from app.services.order_service import OrderService
from app.core.dependencies import get_current_user
from app.models.user import User


router = APIRouter(
    prefix="/orders",
    tags=["Orders"],
    dependencies=[Depends(get_current_user)]  # 🔐 Protect entire router
)


@router.post("/place", response_model=OrderResponse)
async def place_order(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = OrderService()

    try:
        return await service.place_order(current_user.id, db)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/", response_model=list[OrderResponse])
async def get_my_orders(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = OrderService()
    return await service.get_user_orders(current_user.id, db)


@router.post("/cancel/{order_id}", response_model=OrderResponse)
async def cancel_order(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = OrderService()

    try:
        # 🔐 Ownership + 10s validation handled in service
        return await service.cancel_order(order_id, current_user.id, db)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))