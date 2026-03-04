"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Food } from "@/types/food";
import FoodCard from "@/components/food/FoodCard";
import Link from "next/link";
import { Search } from "lucide-react";

export default function MenuPage() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [vegFilter, setVegFilter] = useState<"all" | "veg" | "nonveg">("all");
  const [sortBy, setSortBy] = useState<
    "popularity" | "price_low" | "price_high" | "protein"
  >("popularity");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFoods() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/foods/`);
        const data = await res.json();

        setFoods(data);

        const uniqueCuisines = Array.from(
          new Set(data.map((f: Food) => f.cuisine).filter(Boolean))
        ) as string[];

        setCuisines(["All", ...uniqueCuisines]);
      } catch (err) {
        console.error("Menu fetch failed", err);
      } finally {
        setLoading(false);
      }
    }

    fetchFoods();
  }, []);

  const filteredFoods = useMemo(() => {
    let result = [...foods];

    if (selectedCuisine !== "All") {
      result = result.filter((f) => f.cuisine === selectedCuisine);
    }

    if (vegFilter === "veg") {
      result = result.filter((f) => f.is_veg);
    } else if (vegFilter === "nonveg") {
      result = result.filter((f) => !f.is_veg);
    }

    if (searchQuery.trim()) {
      result = result.filter((f) =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (sortBy) {
      case "price_low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "protein":
        result.sort((a, b) => b.protein_grams - a.protein_grams);
        break;
      default:
        result.sort((a, b) => b.popularity_score - a.popularity_score);
    }

    return result;
  }, [foods, selectedCuisine, vegFilter, sortBy, searchQuery]);

  if (loading) {
    return <div className="pt-40 text-center">Loading menu...</div>;
  }

  return (
    <div className="min-h-screen px-6 md:px-16 py-24">

      <Link
        href="/"
        className="text-sm text-neutral-500 hover:text-(--primary) transition mb-8 inline-block"
      >
        ← Back to Home
      </Link>

      <div className="mb-12">
        <h1 className="text-4xl font-bold gradient-text mb-3">
          Our Menu
        </h1>
        <p className="text-neutral-600 text-sm">
          Explore our complete curated collection.
        </p>
      </div>

      {/* Filters Row */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-12">

        {/* Search */}
        <div className="relative w-full lg:w-96">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <input
            type="text"
            placeholder="Search dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-full bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-(--primary)/40 transition text-sm"
          />
        </div>

        {/* Veg Toggle */}
        <div className="flex gap-3">
          {["all", "veg", "nonveg"].map((type) => (
            <button
              key={type}
              onClick={() =>
                setVegFilter(type as "all" | "veg" | "nonveg")
              }
              className={`px-4 py-2 rounded-full text-xs font-medium transition ${
                vegFilter === type
                  ? "bg-linear-to-r from-(--secondary) to-(--primary) text-white"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              {type === "all"
                ? "All"
                : type === "veg"
                ? "Veg"
                : "Non-Veg"}
            </button>
          ))}
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(
              e.target.value as
                | "popularity"
                | "price_low"
                | "price_high"
                | "protein"
            )
          }
          className="px-4 py-2 rounded-full bg-neutral-100 text-sm focus:outline-none"
        >
          <option value="popularity">Sort: Popularity</option>
          <option value="price_low">Price: Low → High</option>
          <option value="price_high">Price: High → Low</option>
          <option value="protein">Protein: High → Low</option>
        </select>
      </div>

      {/* Cuisine Tabs */}
      <div className="relative flex gap-4 overflow-x-auto pb-4 mb-14">
        {cuisines.map((cuisine) => (
          <button
            key={cuisine}
            onClick={() => setSelectedCuisine(cuisine)}
            className={`relative px-6 py-2 rounded-full text-sm font-medium transition ${
              selectedCuisine === cuisine
                ? "text-white"
                : "text-neutral-700 hover:text-(--primary)"
            }`}
          >
            {selectedCuisine === cuisine && (
              <motion.span
                layoutId="activeCuisine"
                className="absolute inset-0 rounded-full bg-linear-to-r from-(--secondary) to-(--primary) -z-10"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            {cuisine}
          </button>
        ))}
      </div>

      {/* Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedCuisine + vegFilter + sortBy + searchQuery}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
        >
          {filteredFoods.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </motion.div>
      </AnimatePresence>

      {filteredFoods.length === 0 && (
        <div className="text-center text-neutral-500 mt-20 text-sm">
          No dishes match your filters.
        </div>
      )}
    </div>
  );
}