"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame } from "lucide-react";

interface Props {
  onFinish: () => void;
}

export default function PremiumSplash({ onFinish }: Props) {
  const ownerText = "Satya Vardhan’s";
  const tagline = "Food delivered. Smartly.";

  const [ownerCount, setOwnerCount] = useState(0);
  const [visibleSet, setVisibleSet] = useState<Set<number>>(new Set());
  const [ready, setReady] = useState(false);
  const [clicked, setClicked] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);

  // Owner reveal slow cinematic
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
      }, 70);
    }, 800);

    const enableButton = setTimeout(() => setReady(true), 2500);

    return () => clearTimeout(start);
  }, []);

  // Random letter reveal
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
    }, 1500);

    return () => clearTimeout(start);
  }, []);

  const ownerReveal = useMemo(
    () => ownerText.slice(0, ownerCount),
    [ownerText, ownerCount]
  );

  const handleClick = () => {
    if (!ready || clicked) return;
    setClicked(true);

    setTimeout(() => {
      onFinish();
    }, 1200);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-9999 flex items-center justify-center"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          background:
            "radial-gradient(circle at 20% 20%, rgba(255,165,0,0.15), transparent 45%), radial-gradient(circle at 80% 80%, rgba(99,102,241,0.12), transparent 45%), linear-gradient(to bottom right, #ffffff, #f3f4f6)",
        }}
      >
        <div className="w-full max-w-3xl px-6 text-center">

          {/* Owner */}
          <motion.p
            className="text-xs uppercase tracking-[0.35em] text-neutral-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {ownerReveal}
          </motion.p>

          {/* Logo */}
          <motion.h1
            className="mt-5 text-7xl font-extrabold tracking-tight gradient-text"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            SmartBite
          </motion.h1>

          {/* Tagline */}
          <motion.p
            className="mt-6 text-sm tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {tagline.split("").map((ch, idx) => {
              const visible = ch === " " ? true : visibleSet.has(idx);

              return (
                <motion.span
                  key={idx}
                  animate={{
                    opacity: visible ? 1 : 0.1,
                    filter: visible ? "blur(0px)" : "blur(8px)",
                  }}
                  transition={{ duration: 0.5 }}
                  className="inline-block text-neutral-600"
                >
                  {ch === " " ? "\u00A0" : ch}
                </motion.span>
              );
            })}
          </motion.p>

          {/* Button */}
          <div className="mt-16 flex flex-col items-center">
            <motion.button
              ref={buttonRef}
              onClick={handleClick}
              disabled={!ready}
              whileTap={ready ? { scale: 0.92 } : {}}
              className={`rounded-2xl border border-neutral-200 bg-white/80 backdrop-blur-xl px-12 py-6 shadow-xl ${
                ready ? "cursor-pointer" : "opacity-40"
              }`}
            >
              {!clicked && (
                <motion.span
                  animate={
                    ready
                      ? { scale: [1, 1.08, 1] }
                      : {}
                  }
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                  }}
                  className="text-neutral-800 font-medium"
                >
                  Enter
                </motion.span>
              )}

              {clicked && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, scale: [1, 1.3, 0] }}
                  transition={{ duration: 0.8 }}
                >
                  <Flame size={36} className="text-orange-500" />
                </motion.div>
              )}
            </motion.button>

            <p className="mt-4 text-xs uppercase tracking-[0.25em] text-neutral-400">
              Tap to Enter
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}