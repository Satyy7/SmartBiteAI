from sqlalchemy import Column, Integer, ForeignKey, DateTime, Float, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class Cart(Base):
    __tablename__ = "carts"

    __table_args__ = (
        Index("idx_cart_user", "user_id"),
    )

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    items = relationship("CartItem", back_populates="cart", cascade="all, delete")


from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, Float, ForeignKey, Index
from app.database import Base


class CartItem(Base):
    __tablename__ = "cart_items"

    __table_args__ = (
        Index("idx_cart_item_cart", "cart_id"),
        Index("idx_cart_item_food", "food_id"),
    )

    id = Column(Integer, primary_key=True, index=True)

    cart_id = Column(Integer, ForeignKey("carts.id", ondelete="CASCADE"))
    food_id = Column(Integer, ForeignKey("food_items.id"))

    quantity = Column(Integer, nullable=False, default=1)

    # Snapshot price at time of adding to cart
    price_snapshot = Column(Float, nullable=False)

    # 🔥 ADD THIS
    cart = relationship("Cart", back_populates="items")
    food = relationship("Food")  # <-- THIS LINE IS MISSING