"use client";

import { motion } from "framer-motion";
import FoodCard from "@/components/food/FoodCard";

interface Props {
  foods: any[];
}

export default function ReorderSection({ foods }: Props) {
  if (!foods || foods.length === 0) return null;

  return (
    <section className="px-6 md:px-16 mt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-semibold">
              Reorder Your Favorites
            </h2>
            <p className="text-sm text-neutral-500">
              You loved these before 🔁
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {foods.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}