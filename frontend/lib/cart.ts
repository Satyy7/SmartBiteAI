const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

export async function addToCart(food_id: number, quantity = 1) {
  const res = await fetch(`${BASE_URL}/cart/add`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ food_id, quantity }),
  });

  if (res.status === 401) {
    throw new Error("UNAUTHORIZED");
  }

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Failed to add to cart");
  }

  return res.json();
}

export async function getCart() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/`, {
    credentials: "include",
    cache: "no-store",
  });

  if (res.status === 401) {
    return { unauthorized: true };
  }

  if (!res.ok) {
    throw new Error("Failed to fetch cart");
  }

  return res.json();
}

export async function updateQuantity(food_id: number, quantity: number) {
  const res = await fetch(`${BASE_URL}/cart/update/${food_id}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ food_id, quantity }),
  });

  if (!res.ok) throw new Error("Failed to update quantity");
  return res.json();
}

export async function removeFromCart(food_id: number) {
  const res = await fetch(`${BASE_URL}/cart/remove/${food_id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to remove item");
  return res.json();
}