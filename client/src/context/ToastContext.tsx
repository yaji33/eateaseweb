//import React from "react";
import { Toaster, toast } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="top-left"
      toastOptions={{
        duration: 1000,
        style: {
          background: "#fff",
          color: "#333",
          borderRadius: "0.375rem",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          padding: "0.75rem 1rem",
        },
        success: {
          iconTheme: {
            primary: "#22c55e",
            secondary: "#fff",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#fff",
          },
        },
      }}
    />
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export { toast };
