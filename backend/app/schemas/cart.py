from pydantic import BaseModel
from typing import List
from app.schemas.food import FoodResponse


# =========================
# Add To Cart Request
# =========================
class AddToCartRequest(BaseModel):
    food_id: int
    quantity: int = 1


# =========================
# Cart Item Response
# =========================
class CartItemResponse(BaseModel):
    food: FoodResponse
    quantity: int
    price_snapshot: float

    class Config:
        from_attributes = True


# =========================
# Cart Response
# =========================
class CartResponse(BaseModel):
    user_id: int
    items: List[CartItemResponse]
    total_amount: float

    class Config:
        from_attributes = True