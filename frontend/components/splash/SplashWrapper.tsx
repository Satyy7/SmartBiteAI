"use client";

import { useEffect, useState } from "react";
import SmartBiteSplash from "./SmartBiteSplash";

export default function SplashWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [phase, setPhase] = useState<
    "intro" | "ignite" | "fly" | "done"
  >("intro");

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("smartbite_seen");
    if (seen) setPhase("done");
    setMounted(true);
  }, []);

  const startIgnite = () => {
    setPhase("ignite");

    setTimeout(() => {
      setPhase("fly");
    }, 900);

    setTimeout(() => {
      localStorage.setItem("smartbite_seen", "true");
      setPhase("done");
    }, 1900);
  };

  if (!mounted) return null;

  return (
    <>
      {/* Home always rendered underneath */}
      {children}

      {phase !== "done" && (
        <SmartBiteSplash
          phase={phase}
          onIgnite={startIgnite}
        />
      )}
    </>
  );
}