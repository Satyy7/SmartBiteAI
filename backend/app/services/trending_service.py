from sqlalchemy import text, select
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timedelta
from app.models.food import Food
from sqlalchemy import bindparam


class TrendingService:

    async def get_trending_foods(
        self,
        db: AsyncSession,
        limit: int = 4
    ):
        last_24h = datetime.utcnow() - timedelta(hours=24)

        # -------------------------
        # 1️⃣ Get ranked food IDs
        # -------------------------
        dynamic_query = """
            SELECT f.id,
                   SUM(
                        CASE 
                            WHEN i.interaction_type = 'order' THEN 3
                            WHEN i.interaction_type = 'cart' THEN 2
                            WHEN i.interaction_type = 'view' THEN 1
                            ELSE 0
                        END
                   ) AS trending_score
            FROM food_items f
            JOIN interactions i ON f.id = i.food_id
            WHERE i.timestamp >= :last_24h
            GROUP BY f.id
            ORDER BY trending_score DESC
            LIMIT :limit;
        """

        result = await db.execute(
            text(dynamic_query),
            {
                "last_24h": last_24h,
                "limit": limit
            }
        )

        rows = result.mappings().all()

        dynamic_ids = [row["id"] for row in rows]

        # -------------------------
        # 2️⃣ Fallback if needed
        # -------------------------
        if len(dynamic_ids) < limit:
            remaining = limit - len(dynamic_ids)

            fallback_query = """
                SELECT id
                FROM food_items
                WHERE id NOT IN :selected_ids
                ORDER BY popularity_score DESC
                LIMIT :4;
            """

            fallback_stmt = (
    text("""
        SELECT id
        FROM food_items
        WHERE id NOT IN :selected_ids
        ORDER BY popularity_score DESC
        LIMIT :remaining;
    """)
    .bindparams(bindparam("selected_ids", expanding=True))
)

            fallback_result = await db.execute(
                fallback_stmt,
                {
                    "selected_ids": dynamic_ids if dynamic_ids else [0],
                    "remaining": remaining
                }
            )

            fallback_ids = [row[0] for row in fallback_result.all()]
            dynamic_ids.extend(fallback_ids)

            if not dynamic_ids:
                        return []

        # -------------------------
        # 3️⃣ Fetch ORM objects
        # -------------------------
        foods_result = await db.execute(
            select(Food).where(Food.id.in_(dynamic_ids))
        )

        foods = foods_result.scalars().all()

        # -------------------------
        # 4️⃣ Preserve ranking order
        # -------------------------
        food_map = {food.id: food for food in foods}
        sorted_foods = [food_map[fid] for fid in dynamic_ids if fid in food_map]

        return sorted_foods