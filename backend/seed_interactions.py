import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import insert
from app.database import engine
from app.models.interaction import Interaction

interactions = [

# ------------------------
# User 1 – Spicy Non-Veg
# ------------------------

{"user_id": 1, "food_id": 1, "interaction_type": "view"},
{"user_id": 1, "food_id": 3, "interaction_type": "view"},
{"user_id": 1, "food_id": 5, "interaction_type": "cart"},
{"user_id": 1, "food_id": 10, "interaction_type": "view"},
{"user_id": 1, "food_id": 18, "interaction_type": "order"},
{"user_id": 1, "food_id": 1, "interaction_type": "order"},
{"user_id": 1, "food_id": 5, "interaction_type": "view"},
{"user_id": 1, "food_id": 3, "interaction_type": "cart"},

# ------------------------
# User 2 – Vegan / Healthy
# ------------------------

{"user_id": 2, "food_id": 22, "interaction_type": "view"},
{"user_id": 2, "food_id": 23, "interaction_type": "view"},
{"user_id": 2, "food_id": 4, "interaction_type": "order"},
{"user_id": 2, "food_id": 7, "interaction_type": "view"},
{"user_id": 2, "food_id": 9, "interaction_type": "cart"},
{"user_id": 2, "food_id": 24, "interaction_type": "order"},
{"user_id": 2, "food_id": 22, "interaction_type": "cart"},
{"user_id": 2, "food_id": 23, "interaction_type": "order"},

# ------------------------
# User 3 – Comfort Food
# ------------------------

{"user_id": 3, "food_id": 19, "interaction_type": "view"},
{"user_id": 3, "food_id": 17, "interaction_type": "view"},
{"user_id": 3, "food_id": 20, "interaction_type": "cart"},
{"user_id": 3, "food_id": 16, "interaction_type": "order"},
{"user_id": 3, "food_id": 15, "interaction_type": "view"},
{"user_id": 3, "food_id": 19, "interaction_type": "order"},
{"user_id": 3, "food_id": 17, "interaction_type": "cart"},
{"user_id": 3, "food_id": 16, "interaction_type": "view"},

]


async def seed():
    async with engine.begin() as conn:
        await conn.execute(insert(Interaction), interactions)

    print("Seeded interactions successfully!")


if __name__ == "__main__":
    asyncio.run(seed())