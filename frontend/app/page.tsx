"use client";

import { useEffect, useState } from "react";
import { HomepageResponse } from "@/types/homepage";
import Hero from "@/components/layout/Hero";
import TrendingSection from "@/components/sections/TrendingSection";
import RecommendedSection from "@/components/sections/RecommendedSection";
import ReorderSection from "@/components/sections/ReorderSection";
import DesktopNotice from "@/components/ui/DesktopNotice";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function Home() {
  const [data, setData] = useState<HomepageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  useEffect(() => {
    async function fetchHomepage() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/homepage/`, {
          credentials: "include", // 👈 NOW THIS WORKS
        });

        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Homepage fetch failed", err);
      } finally {
        setLoading(false);
      }
    }

    fetchHomepage();
  }, []);

  if (loading) {
    return <div className="pt-40 text-center">Loading...</div>;
  }

  if (!data) {
    return <div className="pt-40 text-center">Failed to load.</div>;
  }

  return (
    <>
     <DesktopNotice />
      <Hero />

  {/* Login CTA for logged-out users */}
  {!user && (
    <div className="px-6 md:px-16 mt-10">
      <div className="bg-linear-to-r from-(--secondary)/20 to-(--primary)/20 backdrop-blur-xl rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-neutral-200 shadow-sm">
        
        <div>
          <h2 className="text-xl font-semibold mb-2">
            Unlock Personalized Recommendations
          </h2>
          <p className="text-sm text-neutral-600">
            Login to discover dishes tailored to your cravings, past orders, and preferences.
          </p>
        </div>

        <Link
          href="/login"
          className="px-6 py-2 rounded-full bg-linear-to-r from-(--secondary) to-(--primary) text-white text-sm font-medium hover:scale-105 transition"
        >
          Login Now
        </Link>

      </div>
    </div>
  )}

      {user && data.recommended && data.recommended.length > 0 && (
  <RecommendedSection foods={data.recommended} />
)}
      {/* Reorder */}
    {user && data.reorder && data.reorder.length > 0 && (
  <ReorderSection foods={data.reorder} />
)}


      <TrendingSection foods={data.trending} />
    </>
  );
}