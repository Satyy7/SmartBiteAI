"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Routes where navbar should be hidden
  const hiddenRoutes = [
    "/order-success",
    "/login",
    "/register",
  ];

  const hideNavbar = hiddenRoutes.includes(pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
}