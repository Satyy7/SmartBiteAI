from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import text

from app.database import get_db
from app.models.food import Food
from app.schemas.food import FoodCreate, FoodResponse
from app.services.embedding_service import EmbeddingService
from app.services.intent_service import extract_intent
from app.services.trending_service import TrendingService
from sqlalchemy import select, distinct

router = APIRouter(prefix="/foods", tags=["Foods"])




@router.get("/cuisines", response_model=list[str])
async def get_cuisines(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(distinct(Food.cuisine)).where(Food.cuisine.isnot(None))
    )
    cuisines = [row[0] for row in result.all()]
    return sorted(cuisines)


# ----------------------------
# GET ALL FOODS
# ----------------------------
@router.get("/", response_model=list[FoodResponse])
async def get_all_foods(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Food).order_by(Food.created_at.desc())
    )
    return result.scalars().all()


@router.get("/trending", response_model=list[FoodResponse])
async def get_trending_foods(
    db: AsyncSession = Depends(get_db)
):
    service = TrendingService()
    return await service.get_trending_foods(db)
# ----------------------------
# SEMANTIC + HYBRID SEARCH
# ----------------------------
@router.get("/semantic-search", response_model=list[FoodResponse])
async def semantic_search(
    q: str = Query(..., min_length=2, max_length=200),
    db: AsyncSession = Depends(get_db),
):
    """
    Hybrid Search:
    - Semantic similarity (pgvector)
    - Dynamic hard filtering
    - Structured ranking boosts
    """

    service = EmbeddingService()

    # 1️⃣ Embed query
    query_vector = await service.embed_query(q)

    # 2️⃣ Extract intent
    intent = extract_intent(q)

    # 3️⃣ Compute structured weight sum (excluding popularity)
    structured_weight = (
        intent["protein_weight"]
        + intent["calorie_weight"]
        + intent["carb_weight"]
        + intent["fiber_weight"]
        + intent["spice_weight"]
    )

    # Dynamic semantic balancing
    semantic_weight = max(0.5, 1.0 - structured_weight)

    # 4️⃣ Build filters
    conditions = []
    params = {
        "query_vector": str(query_vector),
    }

    # Hard diet filters
    if intent["vegan_required"]:
        conditions.append("is_vegan = true")
    elif intent["veg_required"]:
        conditions.append("is_veg = true")
    elif intent.get("non_veg_required"):
        conditions.append("is_veg = false")

    # Price filter
    if intent["price_cap"] is not None:
        conditions.append("price <= :price_cap")
        params["price_cap"] = intent["price_cap"]

    # Cuisine filter
    if intent["cuisine"]:
        conditions.append("cuisine ILIKE :cuisine")
        params["cuisine"] = f"%{intent['cuisine']}%"

    # Assemble WHERE clause
    where_clause = ""
    if conditions:
        where_clause = "WHERE " + " AND ".join(conditions)

    # Add ranking weights
    params.update({
        "semantic_weight": semantic_weight,
        "protein_weight": intent["protein_weight"],
        "calorie_weight": intent["calorie_weight"],
        "carb_weight": intent["carb_weight"],
        "fiber_weight": intent["fiber_weight"],
        "spice_weight": intent["spice_weight"],
        "spice_target": intent["spice_target"],
        "popularity_weight": intent["popularity_weight"],
    })

    # 5️⃣ Hybrid Ranking Query
    query = f"""
        SELECT *,
        (
            (:semantic_weight * (1 - (embedding <=> CAST(:query_vector AS vector))))

            + (:protein_weight * (protein_grams / 50.0))

            + (:calorie_weight * (1 - (calories / 1000.0)))

            + (:carb_weight * (1 - (carbs_grams / 100.0)))

            + (:fiber_weight * (fiber_grams / 20.0))

            + (
                :spice_weight *
                (1 - ABS(spice_level - COALESCE(:spice_target, spice_level)) / 5.0)
              )

            + (:popularity_weight * (popularity_score / 10.0))
        ) AS final_score
        FROM food_items
        {where_clause}
        ORDER BY final_score DESC
        LIMIT 10;
    """

    result = await db.execute(text(query), params)
    return result.mappings().all()


# ----------------------------
# GET SINGLE FOOD
# ----------------------------
@router.get("/{food_id}", response_model=FoodResponse)
async def get_food(food_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Food).where(Food.id == food_id))
    food = result.scalar_one_or_none()

    if not food:
        raise HTTPException(status_code=404, detail="Food not found")

    return food