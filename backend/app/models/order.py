from sqlalchemy import Column, Integer, Float, ForeignKey, String, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    total_amount = Column(Float, nullable=False)
    status = Column(String, default="PLACED")
    created_at = Column(DateTime, default=datetime.utcnow)

    # 🔥 Add relationship
    items = relationship(
        "OrderItem",
        back_populates="order",
        cascade="all, delete-orphan"
    )


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)

    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"))
    food_id = Column(Integer, ForeignKey("food_items.id"))

    quantity = Column(Integer, nullable=False)
    price_snapshot = Column(Float, nullable=False)

    # 🔥 VERY IMPORTANT
    order = relationship("Order", back_populates="items")

    food = relationship("Food")