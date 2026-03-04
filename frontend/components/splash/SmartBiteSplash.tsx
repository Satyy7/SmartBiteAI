"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Flame } from "lucide-react";

interface Props {
  phase: "intro" | "ignite" | "fly";
  onIgnite: () => void;
}

export default function SmartBiteSplash({
  phase,
  onIgnite,
}: Props) {
  const ownerText = "Satya Vardhan’s";
  const tagline = "Food delivered. Smartly.";

  const [ownerCount, setOwnerCount] = useState(0);
  const [visibleSet, setVisibleSet] = useState<Set<number>>(new Set());
  const [buttonReady, setButtonReady] = useState(false);

  /* Owner reveal */
  useEffect(() => {
    const start = setTimeout(() => {
      const interval = setInterval(() => {
        setOwnerCount((c) => {
          if (c >= ownerText.length) {
            clearInterval(interval);
            return c;
          }
          return c + 1;
        });
      }, 75);
    }, 800);

    const enable = setTimeout(() => setButtonReady(true), 2600);

    return () => clearTimeout(start);
  }, []);

  /* Random tagline */
  useEffect(() => {
    const start = setTimeout(() => {
      const indices = tagline
        .split("")
        .map((_, i) => i)
        .filter((i) => tagline[i] !== " ");

      const shuffled = [...indices].sort(() => Math.random() - 0.5);

      let step = 0;
      const interval = setInterval(() => {
        setVisibleSet((prev) => {
          const next = new Set(prev);
          if (step < shuffled.length) next.add(shuffled[step]);
          if (step >= shuffled.length - 1) {
            indices.forEach((i) => next.add(i));
            clearInterval(interval);
          }
          return next;
        });
        step++;
      }, 60);
    }, 1600);

    return () => clearTimeout(start);
  }, []);

  const ownerReveal = useMemo(
    () => ownerText.slice(0, ownerCount),
    [ownerText, ownerCount]
  );

  return (
    <motion.div
      className="fixed inset-0 z-9999 flex items-center justify-center"
      animate={{
        opacity: phase === "fly" ? 0 : 1,
      }}
      transition={{ duration: 0.7 }}
      style={{
        background:
          "radial-gradient(circle at 20% 20%, rgba(255,120,0,0.15), transparent 40%), radial-gradient(circle at 80% 80%, rgba(99,102,241,0.12), transparent 45%), linear-gradient(to bottom right, #ffffff, #f4f4f5)",
      }}
    >
      <div className="text-center relative">

        <p className="text-xs uppercase tracking-[0.4em] text-neutral-500">
          {ownerReveal}
        </p>

        {/* LOGO SPRING FROM TOP */}
        <motion.h1
          initial={{ y: -200, opacity: 0 }}
          animate={
            phase === "fly"
              ? {
                  y: -320,
                  scale: 0.35,
                }
              : {
                  y: 0,
                  scale: 1,
                  opacity: 1,
                }
          }
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 14,
          }}
          className="mt-6 text-7xl font-extrabold gradient-text tracking-tight"
        >
          SmartBite
        </motion.h1>

        {/* TAGLINE */}
        <p className="mt-6 text-base text-neutral-600">
          {tagline.split("").map((ch, idx) => {
            const visible = ch === " " ? true : visibleSet.has(idx);
            return (
              <motion.span
                key={idx}
                animate={{
                  opacity: visible ? 1 : 0.1,
                  filter: visible ? "blur(0px)" : "blur(8px)",
                }}
                transition={{ duration: 0.6 }}
                className="inline-block"
              >
                {ch === " " ? "\u00A0" : ch}
              </motion.span>
            );
          })}
        </p>

        {/* PREMIUM FIRE BUTTON */}
        <div className="mt-20 flex justify-center">
          <motion.button
            onClick={onIgnite}
            disabled={!buttonReady}
            whileTap={{ scale: 0.95 }}
            className="relative overflow-hidden rounded-full px-14 py-6 border border-white/60 bg-white/70 backdrop-blur-xl shadow-[0_25px_70px_rgba(0,0,0,0.12)]"
          >
            {/* Fire Fill */}
            <motion.div
              className="absolute bottom-0 left-0 w-full bg-linear-to-t from-orange-600 via-red-500 to-yellow-400"
              animate={
                phase === "ignite"
                  ? { height: "120%" }
                  : { height: "0%" }
              }
              transition={{ duration: 0.9 }}
            />

            {phase === "ignite" && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.9 }}
              >
                <Flame size={40} className="text-white" />
              </motion.div>
            )}

            <span className="relative z-10 font-semibold text-neutral-800">
              Enter SmartBite
            </span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}