import re


def extract_intent(query: str) -> dict:
    q = query.lower()

    intent = {
        # --- Soft scoring weights (dynamic ranking) ---
        "protein_weight": 0.0,
        "calorie_weight": 0.0,
        "carb_weight": 0.0,
        "fiber_weight": 0.0,
        "spice_weight": 0.0,
        "spice_target": None,
        "popularity_weight": 0.1,  # always small influence

        # --- Hard filters ---
        "veg_required": False,
        "vegan_required": False,
        "non_veg_required": False,
        "cuisine": None,
        "price_cap": None,
    }

    # =============================
    # Protein intent
    # =============================
    if any(word in q for word in ["high protein", "protein", "gym", "bulking"]):
        intent["protein_weight"] = 0.3

    # =============================
    # Calorie intent
    # =============================
    if any(word in q for word in ["low calorie", "weight loss", "diet"]):
        intent["calorie_weight"] = 0.3

    # =============================
    # Carb intent
    # =============================
    if "low carb" in q:
        intent["carb_weight"] = 0.3

    # =============================
    # Fiber intent
    # =============================
    if "fiber" in q:
        intent["fiber_weight"] = 0.2

    # =============================
    # Spice intent
    # =============================
    if "very spicy" in q or "extra spicy" in q:
        intent["spice_target"] = 5
        intent["spice_weight"] = 0.2

    elif "spicy" in q:
        intent["spice_target"] = 4
        intent["spice_weight"] = 0.2

    elif "less spicy" in q or "mild" in q:
        intent["spice_target"] = 1
        intent["spice_weight"] = 0.2

    # =============================
    # Diet filters (important order)
    # =============================
    if "non veg" in q or "non-veg" in q:
        intent["non_veg_required"] = True

    elif "vegan" in q:
        intent["vegan_required"] = True

    elif "veg" in q:
        intent["veg_required"] = True

    # =============================
    # Cuisine detection
    # =============================
    for cuisine in ["indian", "asian", "healthy", "continental"]:
        if cuisine in q:
            intent["cuisine"] = cuisine
            break

    # =============================
    # Price cap detection
    # =============================
    price_match = re.search(r"under (\d+)", q)
    if price_match:
        intent["price_cap"] = int(price_match.group(1))

    return intent