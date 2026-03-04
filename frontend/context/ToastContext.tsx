"use client";

import { createContext, useContext, useState } from "react";

interface ToastContextType {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);

  function showToast(msg: string) {
    setMessage(msg);
    setVisible(true);

    setTimeout(() => {
      setVisible(false);
    }, 2000);
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {visible && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-9999">
          <div className="px-5 py-2.5 text-sm font-medium rounded-lg 
                          bg-linear-to-r from-(--secondary) to-(--primary)
                          text-white shadow-lg backdrop-blur-md">
            {message}
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}