from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models.user import User
from app.schemas.auth import UserRegister, UserLogin
from app.core.security import hash_password, verify_password, create_access_token
from app.core.dependencies import get_current_user
from sqlalchemy.exc import IntegrityError

router = APIRouter(prefix="/auth", tags=["Auth"])

COOKIE_NAME = "access_token"
COOKIE_MAX_AGE = 24*60 * 60  # 1 hour


# =========================
# Register
# =========================
@router.post("/register")
async def register(
    data: UserRegister,
    response: Response,
    db: AsyncSession = Depends(get_db)
):
    # Check email
    result = await db.execute(
        select(User).where(User.email == data.email)
    )
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")

    # Check username
    result = await db.execute(
        select(User).where(User.username == data.username)
    )
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Username already taken")

    user = User(
        username=data.username,
        email=data.email,
        hashed_password=hash_password(data.password),
        role="USER"
    )

    db.add(user)

    try:
        await db.commit()
        await db.refresh(user)
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=400, detail="User already exists")

    token = create_access_token({
        "sub": str(user.id),
        "role": user.role
    })

    response.set_cookie(
        key=COOKIE_NAME,
        value=token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=COOKIE_MAX_AGE
    )

    return {"message": "Registered successfully"}


# =========================
# Login
# =========================
@router.post("/login")
async def login(
    data: UserLogin,
    response: Response,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(User).where(User.email == data.email)
    )
    user = result.scalar_one_or_none()

    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({
        "sub": str(user.id),
        "role": user.role
    })

    response.set_cookie(
        key=COOKIE_NAME,
        value=token,
        httponly=True,
        secure=True,  # 🔐 True in production
        samesite="none",
        max_age=COOKIE_MAX_AGE
    )

    return {"message": "Login successful"}


# =========================
# Logout
# =========================
@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie(
        key=COOKIE_NAME,
        httponly=True,
        secure=True,
        samesite="none",
        path="/"
    )
    return {"message": "Logged out successfully"}


# =========================
# Get Current User
# =========================
@router.get("/me")
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "username": current_user.username,
        "role": current_user.role
    }