"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { useState } from "react";
import { placeOrder } from "@/lib/orders";

interface Props {
  onSuccess: () => void;
}

export default function SlideToOrder({ onSuccess }: Props) {
  const x = useMotionValue(0);
  const [loading, setLoading] = useState(false);
  const max = 220; // drag distance

  const width = useTransform(x, [0, max], ["0%", "100%"]);

  async function handleDragEnd() {
    if (x.get() > max * 0.9) {
      try {
        setLoading(true);
        await placeOrder();
        onSuccess();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        x.set(0);
      }
    } else {
      x.set(0);
    }
  }

  return (
    <div className="relative h-14 bg-neutral-200 rounded-full overflow-hidden">
      
      {/* Fill */}
      <motion.div
        style={{ width }}
        className="absolute inset-y-0 left-0 bg-linear-to-r from-(--secondary) to-(--primary)"
      />

      {/* Text */}
      <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-neutral-600 pointer-events-none">
        {loading ? "Placing Order..." : "Slide to Place Order"}
      </div>

      {/* Handle */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: max }}
        style={{ x }}
        onDragEnd={handleDragEnd}
        className="absolute top-1 left-1 w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center cursor-grab active:cursor-grabbing"
      >
        👉
      </motion.div>
    </div>
  );
}