from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime, Index
from sqlalchemy.sql import func
from pgvector.sqlalchemy import Vector
from app.database import Base


class Food(Base):
    __tablename__ = "food_items"

    __table_args__ = (
        Index(
            "idx_food_embedding",
            "embedding",
            postgresql_using="ivfflat",
            postgresql_with={"lists": 100},
        ),
        Index("idx_food_cuisine", "cuisine"),
        Index("idx_food_popularity", "popularity_score"),
    )

    id = Column(Integer, primary_key=True, index=True)

    # Basic Info
    name = Column(String, nullable=False)
    description = Column(String)
    cuisine = Column(String)

    # Pricing
    price = Column(Integer)

    # Taste
    spice_level = Column(Integer)  # 1-5 scale

    # Nutrition (per serving)
    calories = Column(Float)
    protein_grams = Column(Float)
    fat_grams = Column(Float)
    carbs_grams = Column(Float)
    fiber_grams = Column(Float)

    # Dietary
    is_veg = Column(Boolean)
    is_vegan = Column(Boolean, default=False)

    # Popularity
    popularity_score = Column(Float, default=0.0)

    # AI Embedding
    embedding = Column(Vector(768), nullable=True)

    # Timestamps (important for trending)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    image_url = Column(String, nullable=True)