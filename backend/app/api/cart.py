from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.cart import AddToCartRequest, CartResponse
from app.services.cart_service import CartService
from app.core.dependencies import get_current_user
from app.models.user import User


router = APIRouter(
    prefix="/cart",
    tags=["Cart"],
    dependencies=[Depends(get_current_user)]  # 🔐 Protect entire router
)


# =========================
# Add To Cart
# =========================
@router.post("/add", response_model=CartResponse)
async def add_to_cart(
    request: AddToCartRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = CartService()

    try:
        return await service.add_to_cart(
            current_user.id,
            request.food_id,
            request.quantity,
            db
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


# =========================
# Get Cart
# =========================
@router.get("/", response_model=CartResponse)
async def get_cart(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = CartService()
    return await service.get_cart(current_user.id, db)


# =========================
# Update Quantity
# =========================
@router.patch("/update/{food_id}", response_model=CartResponse)
async def update_quantity(
    food_id: int,
    request: AddToCartRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = CartService()

    try:
        return await service.update_quantity(
            current_user.id,
            food_id,
            request.quantity,
            db
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# =========================
# Remove Item
# =========================
@router.delete("/remove/{food_id}", response_model=CartResponse)
async def remove_item(
    food_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = CartService()

    try:
        return await service.remove_from_cart(
            current_user.id,
            food_id,
            db
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))