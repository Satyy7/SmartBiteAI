"use client";

import { motion } from "framer-motion";
import { Search, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Hero() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState("");

  const router = useRouter();
  const { user } = useAuth();

  // Auto clear warning after 3 seconds
  useEffect(() => {
    if (!warning) return;

    const timer = setTimeout(() => {
      setWarning("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [warning]);

  const handleSubmit = () => {
    // Empty input check
    if (!query.trim()) {
      setWarning("Please enter your craving first.");
      return;
    }

    // Login check
    if (!user) {
      setWarning("Login required to use SmartBite AI.");
      setTimeout(() => {
        router.push("/login");
      }, 1200);
      return;
    }

    setLoading(true);

    setTimeout(() => {
      router.push(`/ai?q=${encodeURIComponent(query)}`);
    }, 400);
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center px-6 pt-32 pb-20 overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute w-72 h-72 bg-(--secondary)/30 rounded-full blur-3xl top-20 left-10 animate-pulse" />
        <div className="absolute w-96 h-96 bg-(--primary)/20 rounded-full blur-3xl bottom-10 right-10 animate-pulse" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl text-center"
      >
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
          Ask SmartBite AI for{" "}
          <span className="gradient-text">Perfect Food</span>
        </h1>

        <p className="text-neutral-600 max-w-2xl mx-auto mb-10">
          High protein under ₹300? Spicy Indian dinner? Low calorie vegan?
          Tell us your craving in natural language.
        </p>

        <div className="relative max-w-2xl mx-auto">

          <div className="glass card-shadow rounded-full flex items-center px-6 py-4 gap-4 transition-all duration-300 focus-within:shadow-xl focus-within:scale-[1.02]">

            <Search className="text-neutral-500" size={20} />

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Find me high protein spicy chicken under ₹300..."
              className="bg-transparent outline-none w-full text-sm md:text-base placeholder:text-neutral-400"
            />

            <motion.button
              onClick={handleSubmit}
              whileTap={{ scale: 0.95 }}
              whileHover={query.trim() ? { scale: 1.05 } : {}}
              disabled={!query.trim() || loading}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md transition
                ${
                  query.trim()
                    ? "bg-linear-to-r from-(--secondary) to-(--primary)"
                    : "bg-neutral-300 cursor-not-allowed"
                }
              `}
            >
              <ArrowRight size={18} />
            </motion.button>
          </div>

          {/* Premium Inline Warning */}
          {warning && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 text-sm text-red-500"
            >
              {warning}
            </motion.p>
          )}
        </div>
      </motion.div>
    </section>
  );
}