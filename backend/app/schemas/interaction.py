from pydantic import BaseModel
from datetime import datetime


class InteractionCreate(BaseModel):
    user_id: int
    food_id: int
    interaction_type: str  # "view", "cart", "order"


class InteractionResponse(BaseModel):
    id: int
    user_id: int
    food_id: int
    interaction_type: str
    timestamp: datetime

    class Config:
        from_attributes = True