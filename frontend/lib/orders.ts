const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

// ============================
// Place Order
// ============================
export async function placeOrder() {
  const res = await fetch(`${BASE_URL}/orders/place`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (res.status === 401) {
    throw new Error("UNAUTHORIZED");
  }

  if (!res.ok) {
    let errorMessage = "Failed to place order";

    try {
      const data = await res.json();
      errorMessage = data?.detail || errorMessage;
    } catch {}

    throw new Error(errorMessage);
  }

  return res.json();
}


// ============================
// Get Order History
// ============================
export async function getOrders() {
  const res = await fetch(`${BASE_URL}/orders/`, {
    credentials: "include",
    cache: "no-store",
  });

  if (res.status === 401) {
    return { unauthorized: true };
  }

  if (!res.ok) {
    return [];
  }

  return res.json();
}