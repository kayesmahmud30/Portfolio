"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

/**
 * ModalPortal — renders children directly into document.body via React portal.
 *
 * Guarantees that `fixed` positioning on modal overlays is always relative to
 * the true viewport, never broken by ancestor transforms or Framer Motion.
 * Also locks body scroll while the modal is open.
 */
export default function ModalPortal({
  isOpen,
  children,
}: {
  isOpen: boolean;
  children: React.ReactNode;
}) {
  const originalOverflow = useRef<string>("");

  // Lock body scroll while open — no setState, no cascading renders
  useEffect(() => {
    if (isOpen) {
      originalOverflow.current = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = originalOverflow.current;
    }
    return () => {
      document.body.style.overflow = originalOverflow.current;
    };
  }, [isOpen]);

  // SSR guard: document is only available in the browser
  if (typeof document === "undefined") return null;

  return createPortal(children, document.body);
}
