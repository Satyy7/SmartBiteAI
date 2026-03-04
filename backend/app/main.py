from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.database import engine, Base
import app.models.food
import app.models.user
import app.models.interaction
import app.models.cart
import app.models.order

from app.api.health import router as health_router
from app.api.food import router as food_router
from app.api.interaction import router as interaction_router
from app.api.user import router as user_router
from app.api.home import router as home_router
from app.api.cart import router as cart_router
from app.api.order import router as order_router
from app.api.assistant import router as assistant_router
from app.api import auth
from app.api import admin_food


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield


app = FastAPI(lifespan=lifespan)


# =========================
# 🔐 CORS CONFIG (IMPORTANT FOR COOKIES)
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://appsmartbiteai.vercel.app",],  # Next.js frontend
    allow_credentials=True,  # 🔥 REQUIRED FOR COOKIE AUTH
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# ROUTERS
# =========================
app.include_router(health_router)
app.include_router(food_router)
app.include_router(interaction_router)
app.include_router(user_router)
app.include_router(home_router)
app.include_router(cart_router)
app.include_router(order_router)
app.include_router(assistant_router)
app.include_router(auth.router)
app.include_router(admin_food.router)