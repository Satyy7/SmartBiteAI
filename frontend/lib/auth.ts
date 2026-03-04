import { User } from "@/types/user";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Get current logged in user
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      credentials: "include",
    });

    if (res.status === 401) {
      return null;
    }

    if (!res.ok) {
      console.error("Unexpected auth error:", res.status);
      return null;
    }

    const data = await res.json();
    return data as User;
  } catch (err) {
    console.warn("Auth fetch failed:", err);
    return null;
  }
}

/**
 * Login user
 */
export async function login(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  let data: any = null;

  try {
    data = await res.json();
  } catch {
    // ignore parse errors
  }

  if (!res.ok) {
    throw new Error(data?.detail || "Invalid email or password");
  }

  return data;
}

/**
 * Register user
 */
export async function register(
  username: string,
  email: string,
  password: string
) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  });

  let data: any = null;

  try {
    data = await res.json();
  } catch {}

  if (!res.ok) {
    throw new Error(data?.detail || "Registration failed");
  }

  return data;
}

/**
 * Logout user
 */
export async function logout() {
  try {
    await fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (err) {
    console.error("Logout failed:", err);
  }
}