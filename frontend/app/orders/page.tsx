"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getOrders } from "@/lib/orders";
import Link from "next/link";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [unauthorized, setUnauthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await getOrders();

        if (data?.unauthorized) {
          setUnauthorized(true);
          setOrders([]);
        } else if (Array.isArray(data)) {
          setOrders(data);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error(err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen px-6 md:px-16 py-24 bg-linear-to-br from-white to-neutral-100">

      <Link
        href="/"
        className="mb-8 inline-block text-sm text-(--primary) hover:underline"
      >
        ← Back to Home
      </Link>

      <h1 className="text-3xl font-bold mb-10 gradient-text">
        Your Order History
      </h1>

      {/* Loading */}
      {loading && (
        <p className="text-neutral-500">Loading orders...</p>
      )}

      {/* Not Logged In */}
      {!loading && unauthorized && (
        <div className="flex flex-col items-center justify-center mt-20 text-center">
          <p className="text-neutral-600 mb-4 text-sm">
            Please login to view your orders.
          </p>

          <Link
            href="/login"
            className="px-6 py-2 rounded-full bg-linear-to-r from-(--secondary) to-(--primary) text-white text-sm hover:scale-105 transition"
          >
            Login Now
          </Link>
        </div>
      )}

      {/* Logged in but no orders */}
      {!loading && !unauthorized && orders.length === 0 && (
        <p className="text-neutral-500">
          No past orders yet.
        </p>
      )}

      {/* Orders List */}
      {!loading && !unauthorized && orders.length > 0 && (
        <div className="space-y-8">
          {orders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-(--card) rounded-2xl p-6 card-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-semibold text-lg">
                    Order #{order.id}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>

                <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-600 font-medium">
                  {order.status}
                </span>
              </div>

              <div className="space-y-4">
                {order.items.map((item: any) => (
                  <div
                    key={item.food.id}
                    className="flex gap-4 items-center border-b pb-3 last:border-none"
                  >
                    <div className="w-16 h-16 rounded-lg bg-neutral-200 overflow-hidden">
                      {item.food.image_url && (
                        <img
                          src={item.food.image_url}
                          alt={item.food.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {item.food.name}
                      </p>
                      <p className="text-xs text-neutral-500">
                        ₹{item.price_snapshot} × {item.quantity}
                      </p>
                    </div>

                    <p className="font-semibold text-sm">
                      ₹{item.price_snapshot * item.quantity}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mt-6 pt-4 border-t">
                <span className="font-medium">
                  Total Paid
                </span>
                <span className="text-lg font-bold">
                  ₹{order.total_amount}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}