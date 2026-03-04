from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
import numpy as np

from app.models.interaction import Interaction
from app.models.food import Food


INTERACTION_WEIGHTS = {
    "view": 1,
    "cart": 2,
    "order": 3,
}


class RecommendationService:

    async def get_user_embedding(self, user_id: int, db: AsyncSession):
        """
        Compute weighted average embedding for a user
        """

        result = await db.execute(
            select(Interaction, Food.embedding)
            .join(Food, Food.id == Interaction.food_id)
            .where(Interaction.user_id == user_id)
        )

        rows = result.all()

        if not rows:
            return None

        weighted_vectors = []
        total_weight = 0

        for interaction, embedding in rows:

            if embedding is None:
                continue

            weight = INTERACTION_WEIGHTS.get(
                interaction.interaction_type, 1
            )

            weighted_vectors.append(
                np.array(embedding) * weight
            )

            total_weight += weight

        if total_weight == 0:
            return None

        user_vector = sum(weighted_vectors) / total_weight

        return user_vector.tolist()