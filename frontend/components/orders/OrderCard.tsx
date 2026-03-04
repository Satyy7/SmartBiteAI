"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface Props {
  order: any;
}

export default function OrderCard({ order }: Props) {
  const [loading, setLoading] = useState(false);

  async function cancelOrder() {
    setLoading(true);
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/orders/cancel/${order.id}`,
      {
        method: "POST",
        credentials: "include",
      }
    );
    window.location.reload();
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 250 }}
      className="bg-(--card) rounded-2xl p-6 card-shadow"
    >
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="font-semibold">
            Order #{order.id}
          </p>
          <p className="text-sm text-neutral-500">
            {new Date(order.created_at).toLocaleString()}
          </p>
        </div>

        <StatusBadge status={order.status} />
      </div>

      <div className="text-sm text-neutral-600 mb-4">
        Total: ₹{order.total_price}
      </div>

      {order.status === "PLACED" && (
        <button
          onClick={cancelOrder}
          disabled={loading}
          className="text-sm px-4 py-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition"
        >
          {loading ? "Cancelling..." : "Cancel Order"}
        </button>
      )}
    </motion.div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles =
    status === "PLACED"
      ? "bg-yellow-100 text-yellow-700"
      : status === "CANCELLED"
      ? "bg-red-100 text-red-600"
      : "bg-green-100 text-green-700";

  return (
    <span className={`text-xs px-3 py-1 rounded-full ${styles}`}>
      {status}
    </span>
  );
}