from pydantic import BaseModel
from typing import Optional


# 🔹 Shared Base Schema
class FoodBase(BaseModel):
    name: str
    description: Optional[str] = None
    cuisine: Optional[str] = None

    price: float
    spice_level: int

    calories: float
    protein_grams: float
    fat_grams: float
    carbs_grams: float
    fiber_grams: float

    is_veg: bool
    is_vegan: Optional[bool] = False

    popularity_score: float
    image_url: Optional[str] = None


# 🔹 Create Schema (Admin Only)
class FoodCreate(FoodBase):
    pass


# 🔹 Update Schema (Partial Update)
class FoodUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    cuisine: Optional[str] = None

    price: Optional[float] = None
    spice_level: Optional[int] = None

    calories: Optional[float] = None
    protein_grams: Optional[float] = None
    fat_grams: Optional[float] = None
    carbs_grams: Optional[float] = None
    fiber_grams: Optional[float] = None

    is_veg: Optional[bool] = None
    is_vegan: Optional[bool] = None

    popularity_score: Optional[float] = None


# 🔹 Response Schema
class FoodResponse(FoodBase):
    id: int

    class Config:
        from_attributes = True