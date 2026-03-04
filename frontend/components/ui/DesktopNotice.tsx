"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Monitor } from "lucide-react";
import { usePathname } from "next/navigation";

const DesktopNotice = () => {
  const [show, setShow] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Only show on homepage
    if (pathname !== "/") return;

    // Only show on small screens
    if (window.innerWidth >= 640) return;

    setShow(true);

    const timer = setTimeout(() => {
      setShow(false);
    }, 5500);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.97 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="
            fixed top-6 left-1/2 -translate-x-1/2
            z-9999
            w-[92%] max-w-md
          "
        >
          <div
            className="
              flex items-center gap-3
              rounded-2xl
              border border-white/50
              bg-white/80
              backdrop-blur-xl
              px-5 py-4
              shadow-[0_20px_60px_rgba(0,0,0,0.12)]
            "
          >
            <div
              className="
                w-9 h-9
                rounded-xl
                bg-linear-to-br
                from-orange-400
                to-pink-500
                flex items-center justify-center
                text-white
                shadow-md
              "
            >
              <Monitor size={16} />
            </div>

            <p className="text-xs font-medium text-neutral-700 leading-relaxed">
              For the most premium SmartBite experience, try using a desktop or
              large-screen device.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DesktopNotice;
