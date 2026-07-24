"use client";

import { useEffect, useState, createElement } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiX, FiPlus } from "react-icons/fi";
import { getSkillIcon } from "@/lib/skillIcons";

interface PromptModalProps {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  placeholder?: string;
  initialValue?: string;
  confirmText?: string;
  onClose: () => void;
  onSubmit: (value: string) => void;
}

export default function PromptModal({
  isOpen,
  title,
  subtitle,
  placeholder = "Enter name...",
  initialValue = "",
  confirmText = "Add Skill",
  onClose,
  onSubmit,
}: PromptModalProps) {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    onSubmit(inputValue.trim());
    setInputValue("");
    onClose();
  };

  const detectedIcon = getSkillIcon(inputValue);

  return (
    <AnimatePresence>
      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
            className="relative w-full max-w-md rounded-3xl border border-black/10 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-zinc-950"
          >
            <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/10">
              <h2 className="text-base font-bold text-zinc-950 dark:text-zinc-50">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-1 text-zinc-400 hover:bg-black/5 dark:hover:bg-white/10"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            {subtitle ? (
              <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">{subtitle}</p>
            ) : null}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                  Skill Name
                </label>
                <div className="mt-1.5 flex items-center gap-3 rounded-2xl border border-black/10 bg-zinc-50 px-4 py-3 dark:border-white/10 dark:bg-zinc-900/50">
                  {createElement(detectedIcon, {
                    className: "text-xl text-indigo-600 dark:text-indigo-400 shrink-0",
                  })}
                  <input
                    type="text"
                    autoFocus
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={placeholder}
                    className="w-full bg-transparent text-sm outline-none text-zinc-950 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-600 font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-2xl border border-black/10 bg-black/5 px-4 py-2.5 text-xs font-semibold transition hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="inline-flex items-center gap-1.5 rounded-2xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md transition hover:bg-indigo-700 disabled:opacity-40"
                >
                  <FiPlus className="text-sm" />
                  <span>{confirmText}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
