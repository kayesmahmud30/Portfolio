"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiAlertTriangle, FiTrash2, FiX } from "react-icons/fi";
import ModalPortal from "@/components/admin/ModalPortal";

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmModal({
  isOpen,
  title = "Confirm Delete",
  message,
  confirmText = "Delete Item",
  cancelText = "Cancel",
  onClose,
  onConfirm,
}: ConfirmModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <ModalPortal isOpen={isOpen}>
      <AnimatePresence>
        {isOpen ? (
          <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md rounded-3xl border border-white/30 bg-white/30 p-6 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-900/30"
            >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-1 text-zinc-400 hover:bg-black/5 dark:hover:bg-white/10"
            >
              <FiX className="text-lg" />
            </button>

            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
                <FiAlertTriangle className="text-lg" />
              </div>
              <div>
                <h2 className="text-base font-bold text-zinc-950 dark:text-zinc-50">{title}</h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Action cannot be undone.</p>
              </div>
            </div>

            <p className="mt-4 text-xs font-medium leading-relaxed text-zinc-700 dark:text-zinc-300">
              {message}
            </p>

            <div className="flex items-center justify-end gap-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-semibold backdrop-blur transition hover:bg-white/20 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="inline-flex items-center gap-1.5 rounded-2xl border border-rose-500/30 bg-rose-500/20 px-5 py-2.5 text-xs font-semibold text-rose-200 backdrop-blur transition hover:bg-rose-500/30"
              >
                <FiTrash2 className="text-sm" />
                <span>{confirmText}</span>
              </button>
            </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </ModalPortal>
  );
}
