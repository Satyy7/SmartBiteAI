from fastapi import APIRouter
from sqlalchemy import text
from app.database import engine

router = APIRouter()


@router.get("/")
async def root():
    return {"message": "SmartBite Backend Running"}


@router.get("/test-db")
async def test_db():
    async with engine.connect() as conn:
        result = await conn.execute(text("SELECT 1"))
        return {"db_response": result.scalar()}