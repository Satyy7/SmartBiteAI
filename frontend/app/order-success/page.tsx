"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function OrderSuccessPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 md:px-16 py-20 overflow-hidden bg-linear-to-br from-white to-neutral-100">

      {/* Background Soft Glow */}
      <div className="absolute w-96 h-96 bg-(--secondary)/20 rounded-full blur-3xl top-20 left-10 animate-pulse" />
      <div className="absolute w-96 h-96 bg-(--primary)/20 rounded-full blur-3xl bottom-10 right-10 animate-pulse" />

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-3xl md:text-4xl font-bold mb-4 gradient-text z-10 text-center"
      >
        Your Order is Being Prepared 🍽️
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-neutral-600 mb-12 text-center max-w-xl z-10"
      >
        Our kitchen has started preparing your delicious meal.
        Sit back and relax — it will be delivered shortly.
      </motion.p>

      {/* Delivery Animation */}
      <div className="relative w-full max-w-3xl mb-16 z-10">

        <div className="flex justify-between items-center text-center">

          {/* Restaurant */}
          <div>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-5xl mb-2"
            >
              🏬
            </motion.div>
            <p className="text-sm font-medium">SmartBite Kitchen</p>
          </div>

          {/* Animated Track */}
          <div className="flex-1 mx-6 relative h-2 bg-neutral-200 rounded-full overflow-hidden">

            {/* Progress Fill */}
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute h-full bg-linear-to-r from-(--secondary) to-(--primary)"
            />

            {/* Moving Truck */}
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: "100%" }}
              transition={{
                repeat: Infinity,
                duration: 4,
                ease: "linear"
              }}
              className="absolute -top-6 text-2xl"
            >
              🚚
            </motion.div>
          </div>

          {/* Home */}
          <div>
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-5xl mb-2"
            >
              🏠
            </motion.div>
            <p className="text-sm font-medium">Your Location</p>
          </div>
        </div>
      </div>

      {/* Cooking Animation */}
      <motion.div
        animate={{ rotate: [0, 6, -6, 0] }}
        transition={{ repeat: Infinity, duration: 1.8 }}
        className="text-6xl mb-8 z-10"
      >
        🍳🔥
      </motion.div>

      {/* Disclaimer Card */}
      <div className="z-10 mt-6 p-6 bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg max-w-2xl text-center text-sm text-neutral-600">
        This website is created purely for project demonstration and skill showcase purposes.
        No real restaurant or delivery system is connected.
        Addresses are not collected, and no real orders are processed.
      </div>

      {/* Return Home Button */}
      <Link
        href="/"
        className="mt-8 px-6 py-3 rounded-full bg-linear-to-r from-(--secondary) to-(--primary) text-white shadow-md hover:scale-105 transition z-10"
      >
        Back to Home
      </Link>

    </div>
  );
}