from pydantic import BaseModel
from typing import Optional, List
from app.schemas.food import FoodResponse


class AssistantQueryRequest(BaseModel):
    query: str
    user_id: Optional[int] = None


class AssistantResponse(BaseModel):
    assistant_message: str
    foods: List[FoodResponse]