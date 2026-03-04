from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from sqlalchemy.orm import selectinload
from datetime import datetime, timedelta

from app.models.cart import Cart, CartItem
from app.models.order import Order, OrderItem


class OrderService:

    # =========================================================
    # PLACE ORDER
    # =========================================================
    async def place_order(self, user_id: int, db: AsyncSession):

        # 1️⃣ Get cart
        result = await db.execute(
            select(Cart).where(Cart.user_id == user_id)
        )
        cart = result.scalar_one_or_none()

        if not cart:
            raise ValueError("Cart is empty")

        result = await db.execute(
            select(CartItem).where(CartItem.cart_id == cart.id)
        )
        cart_items = result.scalars().all()

        if not cart_items:
            raise ValueError("Cart is empty")

        # 2️⃣ Calculate total
        total_amount = sum(
            item.quantity * item.price_snapshot
            for item in cart_items
        )

        # 3️⃣ Create order
        order = Order(
            user_id=user_id,
            total_amount=total_amount,
            status="PLACED"
        )

        db.add(order)
        await db.commit()
        await db.refresh(order)

        # 4️⃣ Create order items
        for item in cart_items:
            db.add(
                OrderItem(
                    order_id=order.id,
                    food_id=item.food_id,
                    quantity=item.quantity,
                    price_snapshot=item.price_snapshot
                )
            )

        # 5️⃣ Clear cart
        await db.execute(
            delete(CartItem).where(CartItem.cart_id == cart.id)
        )

        await db.commit()

        # 6️⃣ Return structured response
        return await self.get_order(order.id, db)

    # =========================================================
    # GET SINGLE ORDER (Structured Properly)
    # =========================================================
    async def get_order(self, order_id: int, db: AsyncSession):

            result = await db.execute(
                select(Order)
                .options(selectinload(Order.items).selectinload(OrderItem.food))
                .where(Order.id == order_id)
            )

            order = result.scalar_one_or_none()

            if not order:
                raise ValueError("Order not found")

            return {
                "id": order.id,
                "status": order.status,
                "total_amount": order.total_amount,
                "created_at": order.created_at,
                "items": [
                    {
                        "food": item.food,
                        "quantity": item.quantity,
                        "price_snapshot": item.price_snapshot
                    }
                    for item in order.items
                ]
            }
    # =========================================================
    # GET USER ORDER HISTORY
    # =========================================================
    async def get_user_orders(self, user_id: int, db: AsyncSession):

        result = await db.execute(
            select(Order)
            .options(selectinload(Order.items).selectinload(OrderItem.food))
            .where(Order.user_id == user_id)
            .order_by(Order.created_at.desc())
        )

        orders = result.scalars().all()

        response = []

        for order in orders:
            response.append({
                "id": order.id,
                "status": order.status,
                "total_amount": order.total_amount,
                "created_at": order.created_at,
                "items": [
                    {
                        "food": item.food,
                        "quantity": item.quantity,
                        "price_snapshot": item.price_snapshot
                    }
                    for item in order.items
                ]
            })

        return response

    # =========================================================
    # CANCEL ORDER (Optional - Safe)
    # =========================================================
    async def cancel_order(self, order_id: int, user_id: int, db: AsyncSession):

        result = await db.execute(
            select(Order).where(Order.id == order_id)
        )
        order = result.scalar_one_or_none()

        if not order:
            raise ValueError("Order not found")

        if order.user_id != user_id:
            raise ValueError("Unauthorized to cancel this order")

        # 10-second cancellation window
        time_diff = datetime.utcnow() - order.created_at.replace(tzinfo=None)

        if time_diff > timedelta(seconds=10):
            raise ValueError("Cancellation window expired")

        if order.status != "PLACED":
            raise ValueError("Order cannot be cancelled")

        order.status = "CANCELLED"
        await db.commit()

        return await self.get_order(order_id, db)