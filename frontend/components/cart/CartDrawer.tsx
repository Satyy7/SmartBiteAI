"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getCart,
  updateQuantity,
  removeFromCart,
} from "@/lib/cart";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import SlideToOrder from "./SlideToOrder";
import Link from "next/link";
import Image from "next/image";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: Props) {
  const [cart, setCart] = useState<any>(null);
  const [loadingItem, setLoadingItem] = useState<number | null>(null);

  async function refreshCart() {
  try {
    const data = await getCart();

    if (data?.unauthorized) {
      setCart({ unauthorized: true });
      return;
    }

    setCart(data);
  } catch (err) {
    console.error(err);
  }
}

  useEffect(() => {
    if (open) refreshCart();
  }, [open]);

  async function handleQuantity(food_id: number, quantity: number) {
    try {
      setLoadingItem(food_id);
      const updated = await updateQuantity(food_id, quantity);
      setCart(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingItem(null);
    }
  }

  async function handleRemove(food_id: number) {
    try {
      setLoadingItem(food_id);
      const updated = await removeFromCart(food_id);
      setCart(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingItem(null);
    }
  }
  const router = useRouter();

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            className="fixed right-0 top-0 h-full w-96 bg-(--card) z-50 p-6 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                Your Cart
              </h2>
              <button
                onClick={onClose}
                className="hover:text-(--primary) transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            {cart?.unauthorized ? (
  // 🚫 NOT LOGGED IN
  <div className="flex flex-col items-center justify-center mt-10 text-center">
    <p className="text-neutral-600 mb-4">
      Please login to view your cart
    </p>

    <button
  onClick={() => {
    onClose();          // ✅ close drawer
    router.push("/login");  // ✅ navigate
  }}
  className="px-5 py-2 rounded-full bg-linear-to-r from-(--secondary) to-(--primary) text-white text-sm hover:scale-105 transition"
>
  Login Now
</button>
  </div>
) : !cart || cart.items.length === 0 ? (
  // 🛒 EMPTY CART
  <p className="text-neutral-500 text-sm">
    Your cart feels lonely 🥲
  </p>
) : (
              <>
                <div className="flex-1 overflow-y-auto space-y-6 pr-1">
                  {cart.items.map((item: any) => (
                    <motion.div
                      key={item.food.id}
                      layout
                      className="flex gap-4 items-center bg-white/40 backdrop-blur-md p-3 rounded-xl border border-white/40 shadow-sm"
                    >
                      {/* Image Placeholder */}
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-neutral-200 flex items-center justify-center">
  {item.food.image_url ? (
    <img
      src={item.food.image_url}
      alt={item.food.name}
      className="w-full h-full object-cover"
    />
  ) : (
    <span className="text-xs text-neutral-500">No Image</span>
  )}
</div>

                      {/* Info */}
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {item.food.name}
                        </p>
                        <p className="text-xs text-neutral-500">
                          ₹{item.price_snapshot}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() =>
                              handleQuantity(
                                item.food.id,
                                item.quantity - 1
                              )
                            }
                            disabled={loadingItem === item.food.id}
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 transition"
                          >
                            <Minus size={14} />
                          </button>

                          <span className="text-sm font-medium">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              handleQuantity(
                                item.food.id,
                                item.quantity + 1
                              )
                            }
                            disabled={loadingItem === item.food.id}
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 transition"
                          >
                            <Plus size={14} />
                          </button>

                          {/* Remove */}
                          <button
                            onClick={() =>
                              handleRemove(item.food.id)
                            }
                            disabled={loadingItem === item.food.id}
                            className="ml-3 text-red-500 hover:text-red-600 transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="text-sm font-semibold">
                        ₹
                        {item.quantity *
                          item.price_snapshot}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Footer */}
                <div className="border-t pt-4 mt-6">
                  <div className="flex justify-between font-semibold text-lg mb-4">
                    <span>Total</span>
                    <span>₹{cart.total_amount}</span>
                  </div>

  <SlideToOrder
    onSuccess={() => {
      router.push("/order-success")
    }}
  />
</div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}