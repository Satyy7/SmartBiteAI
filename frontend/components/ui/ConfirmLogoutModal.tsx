"use client";

import { motion, AnimatePresence } from "framer-motion";

interface Props {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmLogoutModal({
  open,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            onClick={onCancel}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 flex items-center justify-center z-50 px-6"
          >
            <div className="bg-(--card) rounded-2xl p-8 w-full max-w-sm card-shadow">
              <h3 className="text-lg font-semibold mb-2">
                Confirm Logout
              </h3>

              <p className="text-sm text-neutral-600 mb-6">
                Are you sure you want to logout?
              </p>

              <div className="flex justify-end gap-4">
                <button
                  onClick={onCancel}
                  className="px-4 py-2 rounded-full text-sm bg-neutral-100 hover:bg-neutral-200 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={onConfirm}
                  className="px-4 py-2 rounded-full text-sm bg-red-500 text-white hover:bg-red-600 transition"
                >
                  Yes, Logout
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}