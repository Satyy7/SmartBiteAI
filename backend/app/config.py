import os
from dotenv import load_dotenv

# Only load .env locally
if os.getenv("ENVIRONMENT") != "production":
    load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

EMBEDDING_MODEL = "gemini-embedding-001"
EMBEDDING_DIM = 768
EMBEDDING_BATCH_SIZE = 32

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL not set")

if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY not set")