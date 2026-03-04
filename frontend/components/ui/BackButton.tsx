"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function BackButton() {
  const router = useRouter();

  return (
    <motion.button
      whileHover={{ x: -3 }}
      transition={{ type: "spring", stiffness: 300 }}
      onClick={() => router.back()}
      className="flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-(--primary) transition mb-6"
    >
      <ArrowLeft size={16} />
      Back
    </motion.button>
  );
}