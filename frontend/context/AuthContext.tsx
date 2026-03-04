"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/types/user";
import { getCurrentUser } from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function refreshUser() {
    setLoading(true);
    const current = await getCurrentUser();
    setUser(current);
    setLoading(false);
  }

  useEffect(() => {
  if (document.cookie.includes("access_token")) {
    refreshUser();
  } else {
    setLoading(false);
  }
}, []);

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}