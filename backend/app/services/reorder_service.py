from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.order import Order, OrderItem
from app.models.food import Food


class ReorderService:

    async def get_reorder_items(
        self,
        user_id: int,
        db: AsyncSession,
        limit: int = 5
    ):
        """
        Returns most frequently ordered foods
        based on real order history.
        """

        result = await db.execute(
            select(
                OrderItem.food_id,
                func.count(OrderItem.id).label("order_count")
            )
            .join(Order, Order.id == OrderItem.order_id)
            .where(Order.user_id == user_id)
            .group_by(OrderItem.food_id)
            .order_by(func.count(OrderItem.id).desc())
            .limit(limit)
        )

        rows = result.all()

        if not rows:
            return []

        food_ids = [row[0] for row in rows]

        foods_result = await db.execute(
            select(Food).where(Food.id.in_(food_ids))
        )

        foods = foods_result.scalars().all()

        food_map = {food.id: food for food in foods}

        return [food_map[fid] for fid in food_ids if fid in food_map]