from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, text
from typing import Optional

from app.models.food import Food
from app.services.recommendation_service import RecommendationService
from app.services.reorder_service import ReorderService
from app.services.trending_service import TrendingService


class HomepageService:

    async def build_homepage(
        self,
        db: AsyncSession,
        user_id: Optional[int] = None,
        page: int = 1,
        limit: int = 4
    ):
        recommendation_service = RecommendationService()
        reorder_service = ReorderService()
        trending_service = TrendingService()

        # ==================================================
        # 1️⃣ Recommended Section (Only for logged-in users)
        # ==================================================
        recommended = None

        if user_id:
            recommended = []

            user_vector = await recommendation_service.get_user_embedding(user_id, db)

            if user_vector:
                result = await db.execute(
                    text("""
                        SELECT id
                        FROM food_items
                        ORDER BY embedding <=> CAST(:user_vector AS vector)
                        LIMIT 4;
                    """),
                    {"user_vector": str(user_vector)}
                )

                ids = [row[0] for row in result.all()]

                if ids:
                    foods_result = await db.execute(
                        select(Food).where(Food.id.in_(ids))
                    )

                    foods = foods_result.scalars().all()

                    # Preserve ranking order
                    food_map = {food.id: food for food in foods}
                    recommended = [
                        food_map[fid] for fid in ids if fid in food_map
                    ]

            # 🔄 Fallback for logged-in user if no vector or results
            if not recommended:
                fallback_result = await db.execute(
                    select(Food)
                    .order_by(Food.popularity_score.desc())
                    .limit(5)
                )
                recommended = fallback_result.scalars().all()

        # ==================================================
        # 2️⃣ Reorder Section (Only for logged-in users)
        # ==================================================
        reorder = None
        if user_id:
            reorder = await reorder_service.get_reorder_items(user_id, db)

        # ==================================================
        # 3️⃣ Trending Section (Public)
        # ==================================================
        trending = await trending_service.get_trending_foods(db)

        # ==================================================
        # 4️⃣ Cuisines Section (Public)
        # ==================================================
        cuisine_result = await db.execute(
            select(Food.cuisine).distinct()
        )
        cuisines = sorted(
            [row[0] for row in cuisine_result.all() if row[0]]
        )

        # ==================================================
        # 5️⃣ Explore Section (Public with pagination)
        # ==================================================
        offset = (page - 1) * limit
        explore_result = await db.execute(
            select(Food)
            .order_by(Food.created_at.desc())
            .offset(offset)
            .limit(limit)
        )
        explore = explore_result.scalars().all()

        return {
            "recommended": recommended,
            "reorder": reorder,
            "trending": trending,
            "cuisines": cuisines,
            "explore": explore,
        }