from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from app.database import get_db
from app.services.homepage_service import HomepageService
from app.schemas.homepage import HomepageResponse
from app.core.dependencies import get_current_user_optional
from app.models.user import User


router = APIRouter(
    prefix="/homepage",
    tags=["Homepage"]
)


@router.get("/", response_model=HomepageResponse)
async def get_homepage(
    page: int = 1,
    limit: int = 10,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db)
):
    service = HomepageService()

    user_id = current_user.id if current_user else None

    return await service.build_homepage(
        db=db,
        user_id=user_id,
        page=page,
        limit=limit
    )