"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ShoppingCart, BarChart3, ArrowLeft } from "lucide-react";
import { Food } from "@/types/food";
import { addToCart } from "@/lib/cart";
import { useRouter } from "next/navigation";

import { useToast } from "@/context/ToastContext";

interface Props {
  food: Food;
}

export default function FoodCard({ food }: Props) {
  const [viewMode, setViewMode] = useState<"card" | "nutrition">("card");
  const [adding, setAdding] = useState(false);
  const router = useRouter();
  const [toast, setToast] = useState(false);
  const { showToast } = useToast();

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="bg-(--card) rounded-xl overflow-hidden card-shadow transition-shadow duration-300 hover:shadow-xl"
    >
      <AnimatePresence mode="wait">
        {viewMode === "card" ? (
          <motion.div
            key="card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Image */}
            <div className="relative h-36 overflow-hidden">
              {food.image_url ? (
                <img
                  src={food.image_url}
                  alt={food.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-(--secondary)/20 to-(--primary)/20 flex items-center justify-center text-xs text-neutral-500">
                  No Image
                </div>
              )}

              {/* Veg / Non-Veg */}
              <span
                className={`absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  food.is_veg
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {food.is_veg ? "Veg" : "Non-Veg"}
              </span>
            </div>

            <div className="p-4">
              {/* Top Row */}
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-sm font-semibold truncate">
                  {food.name}
                </h3>
                <span className="text-sm font-semibold">
                  ₹{food.price}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-neutral-500 line-clamp-1 mb-3">
                {food.description}
              </p>

              {/* Bottom Row */}
              <div className="flex items-center justify-between">
 <button
  onClick={async () => {
    try {
      setAdding(true);
      await addToCart(food.id, 1);
    } catch (err: any) {
      if (err.message === "UNAUTHORIZED") {
        showToast("Please login to add items to cart");

        setTimeout(() => {
          router.push("/login");
        }, 1500);
      }
    } finally {
      setAdding(false);
    }
  }}
  disabled={adding}
  className="text-xs px-3 py-1.5 rounded-full bg-linear-to-r from-(--secondary) to-(--primary) text-white hover:scale-105 transition disabled:opacity-60"
>
  {adding ? "Adding..." : "Add"}
</button>



                <button
                  onClick={() => setViewMode("nutrition")}
                  className="text-neutral-500 hover:text-(--primary) transition"
                >
                  <BarChart3 size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="nutrition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4"
          >
            <button
              onClick={() => setViewMode("card")}
              className="flex items-center gap-1 text-xs text-neutral-500 hover:text-(--primary) mb-3"
            >
              <ArrowLeft size={14} />
              Back
            </button>

            <h3 className="text-sm font-semibold mb-3">
              {food.name}
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs text-neutral-600">
              <Macro label="Calories" value={food.calories} />
              <Macro label="Protein" value={`${food.protein_grams}g`} />
              <Macro label="Carbs" value={`${food.carbs_grams}g`} />
              <Macro label="Fat" value={`${food.fat_grams}g`} />
              <Macro label="Fiber" value={`${food.fiber_grams}g`} />
              <Macro label="Spice" value={food.spice_level} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Macro({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between bg-neutral-50 px-2 py-1 rounded-md">
      <span>{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}