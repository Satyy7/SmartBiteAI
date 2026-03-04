from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.assistant import AssistantQueryRequest, AssistantResponse
from app.services.assistant_service import AssistantService

router = APIRouter(prefix="/assistant", tags=["Assistant"])


@router.post("/query", response_model=AssistantResponse)
async def assistant_query(
    request: AssistantQueryRequest,
    db: AsyncSession = Depends(get_db)
):
    service = AssistantService()
    return await service.handle_query(
        request.query,
        db,
        request.user_id
    )