"use client";

import {
  motion,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { logout } from "@/lib/auth";
import {
  LogOut,
  ShoppingCart,
  UtensilsCrossed,
  ClipboardList,
  LogIn,
} from "lucide-react";
import CartDrawer from "@/components/cart/CartDrawer";

export default function Navbar() {
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const router = useRouter();

  const [hidden, setHidden] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);

  const { user, refreshUser } = useAuth();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [cartOpen, setCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Hide navbar on scroll down (desktop only feeling preserved)
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > lastScroll && latest > 100) setHidden(true);
    else setHidden(false);
    setLastScroll(latest);
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch cart count when user logs in
  useEffect(() => {
    if (!user) return;

    async function fetchCart() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/cart/`,
          { credentials: "include" }
        );
        if (res.ok) {
          const data = await res.json();
          setCartCount(data.items?.length || 0);
        }
      } catch (err) {
        console.error(err);
      }
    }

    fetchCart();
  }, [user, cartOpen]);

  return (
    <>
      <motion.nav
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden: { y: -140, opacity: 0 },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.4 }}
        className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="
            relative flex items-center
            gap-4 md:gap-10
            px-6 md:px-14
            py-2.5 md:py-4
            rounded-full
            backdrop-blur-2xl
            bg-linear-to-br from-white/60 via-white/40 to-white/30
            border border-white/30
            shadow-[0_10px_50px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.4)]
          "
        >
          {/* Logo */}
          <motion.div layoutId="smartbite-logo" whileHover={{ scale: 1.05 }}>
            <Link
              href="/"
              className="text-base md:text-lg font-semibold gradient-text tracking-wide relative"
            >
              SmartBite
              <span className="absolute -bottom-1 left-0 w-full h-2px bg-linear-to-r from-(--secondary) to-(--primary) opacity-40 blur-sm" />
            </Link>
          </motion.div>

          {/* Nav Items */}
          <div className="flex items-center gap-4 md:gap-7 text-xs md:text-sm font-medium text-neutral-700">

            <PremiumNavItem
              label="Menu"
              href="/menu"
              icon={UtensilsCrossed}
              active={pathname === "/menu"}
            />

            <PremiumNavItem
              label="Orders"
              href="/orders"
              icon={ClipboardList}
              active={pathname === "/orders"}
            />

            <PremiumCart
              cartCount={cartCount}
              onClick={() => setCartOpen(true)}
            />

            {/* Profile / Login */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setOpen((prev) => !prev)}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full
                  bg-linear-to-br from-(--secondary) to-(--primary)
                  text-white flex items-center justify-center
                  font-semibold shadow-lg text-xs md:text-sm"
                >
                  {user.username.charAt(0).toUpperCase()}
                </motion.button>

                <AnimatePresence>
                  {open && (
                    <motion.div
                      initial={{ opacity: 0, y: -15, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -15, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-4 w-64 rounded-2xl p-5
                      backdrop-blur-xl bg-white/90
                      border border-white/30
                      shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
                    >
                      <div className="mb-4 border-b border-neutral-200 pb-3">
                        <p className="font-medium">{user.username}</p>
                        <p className="text-xs text-neutral-500">
                          {user.email}
                        </p>
                      </div>

                      <button
                        onClick={async () => {
                          await logout();
                          await refreshUser();
                          setOpen(false);
                        }}
                        className="w-full flex items-center gap-2 text-sm px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition"
                      >
                        <LogOut size={14} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => router.push("/login")}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-white/30 transition"
              >
                <LogIn size={14} /> Login
              </button>
            )}
          </div>
        </motion.div>
      </motion.nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

function PremiumNavItem({ label, href, icon: Icon, active }: any) {
  return (
    <motion.div whileHover={{ y: -2 }}>
      <Link
        href={href}
        className={`flex items-center gap-1 px-2.5 md:px-3 py-1.5 rounded-lg transition
        ${
          active
            ? "text-(--primary) bg-white/40 shadow-sm"
            : "text-neutral-700 hover:bg-white/30"
        }`}
      >
        <Icon size={14} />
        <span className="hidden sm:inline">{label}</span>
      </Link>
    </motion.div>
  );
}

function PremiumCart({ cartCount, onClick }: any) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="relative flex items-center gap-1 px-2.5 md:px-3 py-1.5 rounded-lg hover:bg-white/30"
    >
      <ShoppingCart size={14} />
      <span className="hidden sm:inline">Cart</span>

      {cartCount > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 text-[9px] md:text-[10px]
          px-1.5 py-0.5 rounded-full
          bg-linear-to-r from-red-500 to-pink-500
          text-white shadow-md"
        >
          {cartCount}
        </motion.span>
      )}
    </motion.button>
  );
}