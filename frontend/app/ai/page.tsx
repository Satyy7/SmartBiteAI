"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Food } from "@/types/food";
import FoodCard from "@/components/food/FoodCard";
import TypingMessage from "@/components/ai/TypingMessage";

export default function AIPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [foods, setFoods] = useState<Food[]>([]);
  const [typingKey, setTypingKey] = useState(0);

  const fetchAI = async (newQuery: string) => {
    setLoading(true);
    setMessage("");
    setFoods([]);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assistant/query`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: newQuery }),
      });

      const data = await res.json();

      setMessage(data.assistant_message);
      setFoods(data.foods);

      // reset typing animation
      setTypingKey((prev) => prev + 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      fetchAI(initialQuery);
    }
  }, [initialQuery]);

  const bestMatch = foods[0];
  const otherMatches = foods.slice(1);

  return (
    <div className="min-h-screen px-6 md:px-16 py-24 bg-linear-to-br from-white to-neutral-100">

      <Link href="/" className="text-sm text-(--primary) hover:underline">
        ← Back to Home
      </Link>

      {/* AI Header */}
      <div className="mt-8 mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-linear-to-r from-(--secondary) to-(--primary) flex items-center justify-center text-white shadow-md">
            <Sparkles size={18} />
          </div>
          <h1 className="text-3xl font-bold gradient-text">
            SmartBite AI
          </h1>
        </div>

        <div className="inline-block px-4 py-2 rounded-full bg-neutral-100 text-sm text-neutral-600">
          "{query}"
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="text-neutral-500 animate-pulse">
          SmartBite AI is analyzing your craving...
        </div>
      )}

      {/* AI Explanation */}
      <AnimatePresence mode="wait">
        {!loading && message && (
          <motion.div
            key={typingKey}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative rounded-3xl p-8 mb-14 bg-white/70 backdrop-blur-xl border border-white/50 shadow-xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-neutral-500 uppercase tracking-wide">
                SmartBite AI is responding
              </span>
            </div>

            <TypingMessage key={typingKey} text={message} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Best Match */}
      {bestMatch && (
        <div className="mb-16">
          <h2 className="text-xl font-semibold mb-6">
            ⭐ Top Worthy Pick
          </h2>
          <FoodCard food={bestMatch} />
        </div>
      )}

      {/* Other Matches */}
      {otherMatches.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-6">
            Other Smart Picks
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {otherMatches.map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        </div>
      )}

      {/* 🔥 Premium Smart Suggestions */}
      {!loading && (
        <div className="mt-20 text-center">
          <p className="text-neutral-500 mb-6">
            Refine your craving instantly
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {["More Protein", "Lower Calories", "Spicier","Budget Friendly"].map(
              (suggestion) => (
                <motion.button
                  key={suggestion}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setQuery(suggestion);
                    fetchAI(suggestion);
                  }}
                  className="px-4 py-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition text-sm"
                >
                  {suggestion}
                </motion.button>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}