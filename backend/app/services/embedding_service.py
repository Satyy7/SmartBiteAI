import asyncio
import logging
from typing import List

from google import genai
from google.genai.types import EmbedContentConfig
from tenacity import retry, stop_after_attempt, wait_exponential

from app.config import (
    GEMINI_API_KEY,
    EMBEDDING_MODEL,
    EMBEDDING_DIM,
    EMBEDDING_BATCH_SIZE,
)

logger = logging.getLogger(__name__)

# Initialize client once
client = genai.Client(api_key=GEMINI_API_KEY)


class EmbeddingService:
    """
    Production-grade embedding service for SmartBite.
    Uses new google-genai SDK.
    """

    def __init__(self):
        self.model = EMBEDDING_MODEL
        self.dimension = EMBEDDING_DIM
        self.batch_size = EMBEDDING_BATCH_SIZE

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=8),
        reraise=True,
    )
    async def _embed_batch(self, texts: List[str]) -> List[List[float]]:
        try:
            response = await client.aio.models.embed_content(
                model=self.model,
                contents=texts,
                config=EmbedContentConfig(
                    task_type="RETRIEVAL_DOCUMENT",
                    output_dimensionality=self.dimension,
                ),
            )

            embeddings = [e.values for e in response.embeddings]

            if not embeddings:
                raise ValueError("Empty embedding response")

            return embeddings

        except Exception as e:
            logger.exception("Embedding batch failed")
            raise e

    async def embed_texts(self, texts: List[str]) -> List[List[float]]:
        all_embeddings = []

        for i in range(0, len(texts), self.batch_size):
            batch = texts[i : i + self.batch_size]

            batch_embeddings = await self._embed_batch(batch)
            all_embeddings.extend(batch_embeddings)

            # Soft rate limiting
            await asyncio.sleep(0.1)

        return all_embeddings

    async def embed_query(self, query: str) -> List[float]:
        result = await self.embed_texts([query])
        return result[0]