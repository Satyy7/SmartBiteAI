from pydantic import BaseModel
from typing import List, Optional
from app.schemas.food import FoodResponse


class HomepageResponse(BaseModel):
    recommended: Optional[List[FoodResponse]] = None
    reorder: Optional[List[FoodResponse]] = None

    trending: List[FoodResponse]
    cuisines: List[str]
    explore: List[FoodResponse]

    class Config:
        from_attributes = True