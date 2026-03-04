"use client";

import { useState } from "react";
import { login } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";

export default function LoginPage() {
const router = useRouter();
const { refreshUser } = useAuth();

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const [loading, setLoading] = useState(false);
const [shake, setShake] = useState(false);

async function handleLogin(e: React.FormEvent) {
e.preventDefault();
setLoading(true);


try {
  await login(email, password);
  await refreshUser();

  toast.success("Welcome back 👋");

  router.push("/");
} catch (err: any) {
  setShake(true);
  toast.error(err.message || "Invalid email or password");

  setTimeout(() => setShake(false), 400);
} finally {
  setLoading(false);
}


}

return ( 
<div className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">


  <div className="absolute inset-0 -z-10 bg-linear-to-br from-(--secondary)/20 via-(--background) to-(--primary)/20" />

  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{
      opacity: 1,
      y: 0,
      x: shake ? [-10, 10, -8, 8, 0] : 0
    }}
    transition={{ duration: 0.5 }}
    className="glass card-shadow rounded-3xl p-10 w-full max-w-md backdrop-blur-xl"
  >
    <h2 className="text-3xl font-bold mb-2 gradient-text text-center">
      Welcome Back
    </h2>

    <p className="text-neutral-600 text-sm text-center mb-8">
      Login to unlock personalized food recommendations.
    </p>

    <form onSubmit={handleLogin} className="space-y-6">

      <input
        type="email"
        required
        placeholder="Email address"
        className="w-full px-4 py-3 rounded-xl bg-white/70 border border-neutral-200 outline-none focus:ring-2 focus:ring-(--secondary)/50"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        required
        placeholder="Password"
        className="w-full px-4 py-3 rounded-xl bg-white/70 border border-neutral-200 outline-none focus:ring-2 focus:ring-(--secondary)/50"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-full bg-linear-to-r from-(--secondary) to-(--primary) text-white font-medium transition disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {loading && (
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        )}
        {loading ? "Logging in..." : "Login"}
      </button>

    </form>

    <div className="text-center mt-6 text-sm text-neutral-600">
      Don’t have an account?{" "}
      <Link
        href="/register"
        className="text-(--primary) font-medium hover:underline"
      >
        Create one
      </Link>
    </div>
  </motion.div>
</div>


);
}
