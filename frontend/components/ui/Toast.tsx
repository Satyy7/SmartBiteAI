"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";

interface Props {
  message: string;
  show: boolean;
}

export default function Toast({ message, show }: Props) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-999"
        >
          <div className="flex items-center gap-3 px-6 py-3 rounded-full 
                          bg-linear-to-r from-rose-500 to-orange-400 
                          text-white shadow-lg shadow-rose-300/40
                          backdrop-blur-md">
            <AlertCircle size={18} />
            <span className="text-sm font-medium">
              {message}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}