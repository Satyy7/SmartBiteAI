import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";

import LayoutWrapper from "@/components/layout/LayoutWrapper";
import SplashWrapper from "@/components/splash/SplashWrapper";

import { Toaster } from "sonner";

const geistSans = Geist({
variable: "--font-geist-sans",
subsets: ["latin"],
});

const geistMono = Geist_Mono({
variable: "--font-geist-mono",
subsets: ["latin"],
});

export const metadata: Metadata = {
title: "SmartBite",
description: "AI Powered Food Recommendation Platform",
};

export default function RootLayout({
children,
}: {
children: React.ReactNode;
}) {
return (
<html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
   <body className="antialiased">
    <AuthProvider>
      <ToastProvider>
        <SplashWrapper>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </SplashWrapper>
      </ToastProvider>
    </AuthProvider>
    <Toaster
      position="top-center"
      richColors
      toastOptions={{
        duration: 3000,
      }}
    />

  </body>
</html>


);
}
