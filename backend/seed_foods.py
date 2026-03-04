import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import insert
from app.database import engine
from app.models.food import Food

foods = [

# =======================
# 1️⃣ INDIAN SIGNATURE
# =======================

{
"name": "Hyderabadi Chicken Biryani",
"description": "Slow-cooked basmati rice layered with spiced chicken and saffron.",
"cuisine": "Indian",
"price": 329,
"spice_level": 4,
"calories": 580,
"protein_grams": 30,
"fat_grams": 20,
"carbs_grams": 65,
"fiber_grams": 4,
"is_veg": False,
"is_vegan": False,
"popularity_score": 9.2
},

{
"name": "Paneer Tikka Masala",
"description": "Chargrilled paneer cubes in creamy tomato gravy.",
"cuisine": "Indian",
"price": 289,
"spice_level": 3,
"calories": 480,
"protein_grams": 20,
"fat_grams": 28,
"carbs_grams": 32,
"fiber_grams": 3,
"is_veg": True,
"is_vegan": False,
"popularity_score": 8.7
},

{
"name": "Butter Chicken",
"description": "Tender chicken in rich buttery tomato sauce.",
"cuisine": "Indian",
"price": 349,
"spice_level": 3,
"calories": 620,
"protein_grams": 32,
"fat_grams": 38,
"carbs_grams": 25,
"fiber_grams": 2,
"is_veg": False,
"is_vegan": False,
"popularity_score": 9.0
},

{
"name": "Dal Tadka with Jeera Rice",
"description": "Tempered lentils served with cumin rice.",
"cuisine": "Indian",
"price": 249,
"spice_level": 2,
"calories": 520,
"protein_grams": 18,
"fat_grams": 16,
"carbs_grams": 75,
"fiber_grams": 9,
"is_veg": True,
"is_vegan": True,
"popularity_score": 8.0
},

{
"name": "Tandoori Chicken Platter",
"description": "Clay-oven roasted chicken with mint chutney.",
"cuisine": "Indian",
"price": 399,
"spice_level": 4,
"calories": 450,
"protein_grams": 42,
"fat_grams": 18,
"carbs_grams": 8,
"fiber_grams": 1,
"is_veg": False,
"is_vegan": False,
"popularity_score": 8.8
},

{
"name": "Malai Kofta",
"description": "Paneer dumplings in mild creamy gravy.",
"cuisine": "Indian",
"price": 299,
"spice_level": 2,
"calories": 540,
"protein_grams": 16,
"fat_grams": 35,
"carbs_grams": 38,
"fiber_grams": 4,
"is_veg": True,
"is_vegan": False,
"popularity_score": 8.3
},

{
"name": "Masala Dosa with Sambar",
"description": "Crispy rice crepe stuffed with spiced potatoes.",
"cuisine": "Indian",
"price": 199,
"spice_level": 3,
"calories": 390,
"protein_grams": 10,
"fat_grams": 12,
"carbs_grams": 58,
"fiber_grams": 6,
"is_veg": True,
"is_vegan": True,
"popularity_score": 8.5
},

# =======================
# 2️⃣ ASIAN FUSION
# =======================

{
"name": "Thai Green Curry Chicken",
"description": "Coconut green curry with tender chicken.",
"cuisine": "Asian",
"price": 369,
"spice_level": 4,
"calories": 520,
"protein_grams": 28,
"fat_grams": 30,
"carbs_grams": 22,
"fiber_grams": 3,
"is_veg": False,
"is_vegan": False,
"popularity_score": 8.6
},

{
"name": "Thai Green Curry Veg",
"description": "Coconut curry with seasonal vegetables.",
"cuisine": "Asian",
"price": 329,
"spice_level": 3,
"calories": 420,
"protein_grams": 12,
"fat_grams": 22,
"carbs_grams": 40,
"fiber_grams": 8,
"is_veg": True,
"is_vegan": True,
"popularity_score": 8.1
},

{
"name": "Spicy Chicken Ramen",
"description": "Japanese ramen in spicy miso broth.",
"cuisine": "Asian",
"price": 349,
"spice_level": 5,
"calories": 600,
"protein_grams": 26,
"fat_grams": 25,
"carbs_grams": 70,
"fiber_grams": 5,
"is_veg": False,
"is_vegan": False,
"popularity_score": 8.9
},

{
"name": "Teriyaki Chicken Bowl",
"description": "Grilled chicken glazed in teriyaki sauce.",
"cuisine": "Asian",
"price": 339,
"spice_level": 2,
"calories": 480,
"protein_grams": 35,
"fat_grams": 12,
"carbs_grams": 55,
"fiber_grams": 4,
"is_veg": False,
"is_vegan": False,
"popularity_score": 8.4
},

{
"name": "Veg Hakka Noodles",
"description": "Stir-fried noodles with crunchy vegetables.",
"cuisine": "Asian",
"price": 279,
"spice_level": 3,
"calories": 510,
"protein_grams": 12,
"fat_grams": 18,
"carbs_grams": 72,
"fiber_grams": 7,
"is_veg": True,
"is_vegan": True,
"popularity_score": 8.2
},

{
"name": "Sushi Platter",
"description": "Assorted salmon and avocado sushi rolls.",
"cuisine": "Asian",
"price": 499,
"spice_level": 1,
"calories": 420,
"protein_grams": 24,
"fat_grams": 14,
"carbs_grams": 45,
"fiber_grams": 3,
"is_veg": False,
"is_vegan": False,
"popularity_score": 9.1
},

# =======================
# 3️⃣ CONTINENTAL GRILL
# =======================

{
"name": "Grilled Chicken Steak",
"description": "Herb-marinated grilled chicken breast.",
"cuisine": "Continental",
"price": 429,
"spice_level": 2,
"calories": 460,
"protein_grams": 45,
"fat_grams": 15,
"carbs_grams": 12,
"fiber_grams": 2,
"is_veg": False,
"is_vegan": False,
"popularity_score": 8.8
},

{
"name": "Garlic Butter Fish",
"description": "Pan-seared fish in garlic butter sauce.",
"cuisine": "Continental",
"price": 449,
"spice_level": 2,
"calories": 500,
"protein_grams": 40,
"fat_grams": 28,
"carbs_grams": 10,
"fiber_grams": 1,
"is_veg": False,
"is_vegan": False,
"popularity_score": 8.7
},

{
"name": "Creamy Alfredo Pasta",
"description": "Penne pasta in rich Alfredo sauce.",
"cuisine": "Continental",
"price": 359,
"spice_level": 1,
"calories": 680,
"protein_grams": 20,
"fat_grams": 38,
"carbs_grams": 75,
"fiber_grams": 4,
"is_veg": True,
"is_vegan": False,
"popularity_score": 8.6
},

{
"name": "Peri Peri Chicken Wrap",
"description": "Spicy grilled chicken wrapped in tortilla.",
"cuisine": "Continental",
"price": 299,
"spice_level": 4,
"calories": 540,
"protein_grams": 30,
"fat_grams": 20,
"carbs_grams": 50,
"fiber_grams": 5,
"is_veg": False,
"is_vegan": False,
"popularity_score": 8.3
},

{
"name": "Classic Margherita Pizza",
"description": "Thin crust pizza with fresh mozzarella.",
"cuisine": "Continental",
"price": 349,
"spice_level": 1,
"calories": 720,
"protein_grams": 22,
"fat_grams": 32,
"carbs_grams": 85,
"fiber_grams": 4,
"is_veg": True,
"is_vegan": False,
"popularity_score": 8.9
},

{
"name": "Loaded Veggie Burger",
"description": "Grilled vegetable patty with cheese.",
"cuisine": "Continental",
"price": 289,
"spice_level": 2,
"calories": 610,
"protein_grams": 18,
"fat_grams": 30,
"carbs_grams": 70,
"fiber_grams": 6,
"is_veg": True,
"is_vegan": False,
"popularity_score": 8.1
},

# =======================
# 4️⃣ HEALTHY & FITNESS
# =======================

{
"name": "High-Protein Chicken Salad",
"description": "Grilled chicken with mixed greens.",
"cuisine": "Healthy",
"price": 379,
"spice_level": 1,
"calories": 350,
"protein_grams": 40,
"fat_grams": 12,
"carbs_grams": 15,
"fiber_grams": 6,
"is_veg": False,
"is_vegan": False,
"popularity_score": 8.5
},

{
"name": "Vegan Buddha Bowl",
"description": "Quinoa, roasted veggies, tahini dressing.",
"cuisine": "Healthy",
"price": 339,
"spice_level": 1,
"calories": 420,
"protein_grams": 16,
"fat_grams": 14,
"carbs_grams": 55,
"fiber_grams": 10,
"is_veg": True,
"is_vegan": True,
"popularity_score": 8.4
},

{
"name": "Quinoa & Chickpea Power Bowl",
"description": "High-fiber quinoa with roasted chickpeas.",
"cuisine": "Healthy",
"price": 329,
"spice_level": 1,
"calories": 390,
"protein_grams": 18,
"fat_grams": 10,
"carbs_grams": 60,
"fiber_grams": 11,
"is_veg": True,
"is_vegan": True,
"popularity_score": 8.2
},

{
"name": "Avocado Toast with Eggs",
"description": "Sourdough toast topped with smashed avocado and poached eggs.",
"cuisine": "Healthy",
"price": 299,
"spice_level": 1,
"calories": 450,
"protein_grams": 20,
"fat_grams": 25,
"carbs_grams": 35,
"fiber_grams": 7,
"is_veg": True,
"is_vegan": False,
"popularity_score": 8.6
},

{
"name": "Berry Protein Smoothie",
"description": "Mixed berry smoothie with whey protein.",
"cuisine": "Healthy",
"price": 249,
"spice_level": 1,
"calories": 280,
"protein_grams": 30,
"fat_grams": 5,
"carbs_grams": 35,
"fiber_grams": 5,
"is_veg": True,
"is_vegan": False,
"popularity_score": 8.3
},

{
"name": "Low-Carb Paneer Bowl",
"description": "Grilled paneer with sautéed vegetables.",
"cuisine": "Healthy",
"price": 319,
"spice_level": 2,
"calories": 380,
"protein_grams": 28,
"fat_grams": 20,
"carbs_grams": 18,
"fiber_grams": 6,
"is_veg": True,
"is_vegan": False,
"popularity_score": 8.5
},

]





async def seed():
    async with engine.begin() as conn:
        await conn.execute(insert(Food), foods)

    print("Seeded 25 food items successfully!")


if __name__ == "__main__":
    asyncio.run(seed())