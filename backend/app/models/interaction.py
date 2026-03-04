from sqlalchemy import Column, Integer, ForeignKey, String, DateTime, Index
from sqlalchemy.sql import func
from app.database import Base


class Interaction(Base):
    __tablename__ = "interactions"

    __table_args__ = (
        Index("idx_interaction_user", "user_id"),
        Index("idx_interaction_food", "food_id"),
        Index("idx_interaction_type", "interaction_type"),
        Index("idx_interaction_timestamp", "timestamp"),
    )

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    food_id = Column(Integer, ForeignKey("food_items.id"), nullable=False)

    # view | cart | order
    interaction_type = Column(String, nullable=False)

    timestamp = Column(DateTime(timezone=True), server_default=func.now())