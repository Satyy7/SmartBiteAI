from pydantic import BaseModel
from typing import List
from datetime import datetime
from app.schemas.food import FoodResponse


class OrderItemResponse(BaseModel):
    food: FoodResponse
    quantity: int
    price_snapshot: float

    class Config:
        from_attributes = True


class OrderResponse(BaseModel):
    id: int
    status: str
    total_amount: float
    created_at: datetime
    items: List[OrderItemResponse]

    class Config:
        from_attributes = True