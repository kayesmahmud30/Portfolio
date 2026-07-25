"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";

interface ToastPortalProps {
  toast: { type: "success" | "error"; msg: string } | null;
}

export default function ToastPortal({ toast }: ToastPortalProps) {
  const portalRoot = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Ensure we mount into body directly — no ancestor transforms affect fixed positioning
    portalRoot.current = document.body;
  }, []);

  if (typeof window === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {toast ? (
        <motion.div
          key={toast.msg + toast.type}
          initial={{ opacity: 0, y: 30, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.94 }}
          transition={{ type: "spring", stiffness: 420, damping: 30 }}
          style={{
            position: "fixed",
            bottom: "max(1.5rem, env(safe-area-inset-bottom, 1.5rem))",
            right: "1rem",
            left: "1rem",
            zIndex: 99999,
          }}
          className={`
            flex flex-col overflow-hidden rounded-2xl shadow-2xl text-xs font-semibold
            sm:left-auto sm:right-6 sm:w-auto sm:max-w-xs
            ${toast.type === "success"
              ? "bg-emerald-500 text-white"
              : "bg-rose-500 text-white"
            }
          `}
        >
          <div className="flex items-center gap-2.5 px-5 py-3.5">
            {toast.type === "success"
              ? <FiCheckCircle className="text-base shrink-0" />
              : <FiAlertCircle className="text-base shrink-0" />}
            <span className="leading-snug">{toast.msg}</span>
          </div>
          {/* Progress bar */}
          <motion.div
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 4, ease: "linear" }}
            style={{ transformOrigin: "left" }}
            className="h-0.5 w-full bg-white/40"
          />
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
