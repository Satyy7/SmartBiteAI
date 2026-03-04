from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.models.cart import Cart, CartItem
from app.models.food import Food


class CartService:

    async def get_or_create_cart(self, user_id: int, db: AsyncSession):
        result = await db.execute(
            select(Cart).where(Cart.user_id == user_id)
        )
        cart = result.scalar_one_or_none()

        if not cart:
            cart = Cart(user_id=user_id)
            db.add(cart)
            await db.commit()
            await db.refresh(cart)

        return cart

    # =========================
    # Add To Cart
    # =========================
    async def add_to_cart(
        self,
        user_id: int,
        food_id: int,
        quantity: int,
        db: AsyncSession
    ):
        cart = await self.get_or_create_cart(user_id, db)

        result = await db.execute(
            select(CartItem).where(
                CartItem.cart_id == cart.id,
                CartItem.food_id == food_id
            )
        )
        existing_item = result.scalar_one_or_none()

        food_result = await db.execute(
            select(Food).where(Food.id == food_id)
        )
        food = food_result.scalar_one_or_none()

        if not food:
            raise ValueError("Food not found")

        if existing_item:
            existing_item.quantity += quantity
        else:
            new_item = CartItem(
                cart_id=cart.id,
                food_id=food_id,
                quantity=quantity,
                price_snapshot=food.price
            )
            db.add(new_item)

        await db.commit()

        return await self.get_cart(user_id, db)

    # =========================
    # Update Quantity
    # =========================
    async def update_quantity(
        self,
        user_id: int,
        food_id: int,
        quantity: int,
        db: AsyncSession
    ):
        if quantity < 0:
            raise ValueError("Quantity cannot be negative")

        result = await db.execute(
            select(Cart).where(Cart.user_id == user_id)
        )
        cart = result.scalar_one_or_none()

        if not cart:
            raise ValueError("Cart not found")

        result = await db.execute(
            select(CartItem).where(
                CartItem.cart_id == cart.id,
                CartItem.food_id == food_id
            )
        )
        item = result.scalar_one_or_none()

        if not item:
            raise ValueError("Item not found in cart")

        # If quantity becomes 0 → remove item
        if quantity == 0:
            await db.delete(item)
        else:
            item.quantity = quantity

        await db.commit()

        return await self.get_cart(user_id, db)

    # =========================
    # Remove Item
    # =========================
    async def remove_from_cart(
        self,
        user_id: int,
        food_id: int,
        db: AsyncSession
    ):
        result = await db.execute(
            select(Cart).where(Cart.user_id == user_id)
        )
        cart = result.scalar_one_or_none()

        if not cart:
            raise ValueError("Cart not found")

        result = await db.execute(
            select(CartItem).where(
                CartItem.cart_id == cart.id,
                CartItem.food_id == food_id
            )
        )
        item = result.scalar_one_or_none()

        if not item:
            raise ValueError("Item not found in cart")

        await db.delete(item)
        await db.commit()

        return await self.get_cart(user_id, db)

    # =========================
    # Get Cart
    # =========================
    async def get_cart(self, user_id: int, db: AsyncSession):

        result = await db.execute(
            select(Cart).where(Cart.user_id == user_id)
        )
        cart = result.scalar_one_or_none()

        if not cart:
            return {
                "user_id": user_id,
                "items": [],
                "total_amount": 0.0
            }

        result = await db.execute(
            select(CartItem)
            .options(selectinload(CartItem.food))
            .where(CartItem.cart_id == cart.id)
        )

        cart_items = result.scalars().all()

        items = []
        total = 0.0

        for item in cart_items:
            items.append({
                "food": item.food,
                "quantity": item.quantity,
                "price_snapshot": item.price_snapshot
            })

            total += item.quantity * item.price_snapshot

        return {
            "user_id": user_id,
            "items": items,
            "total_amount": total
        }