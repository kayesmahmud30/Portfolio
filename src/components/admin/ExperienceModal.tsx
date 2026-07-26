"use client";

import { useState, useEffect, type FormEvent } from "react";
import type { ExperienceItem } from "@/types";
import { FiX, FiSave } from "react-icons/fi";
import ModalPortal from "@/components/admin/ModalPortal";

interface ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: ExperienceItem) => void;
  initialItem?: ExperienceItem | null;
}

export default function ExperienceModal({
  isOpen,
  onClose,
  onSave,
  initialItem,
}: ExperienceModalProps) {
  const [form, setForm] = useState<ExperienceItem>({
    company: "",
    role: "",
    duration: "",
    responsibilities: [],
  });
  const [respInput, setRespInput] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      if (initialItem) {
        setForm(initialItem);
        setRespInput(initialItem.responsibilities?.join("\n") || "");
      } else {
        setForm({
          company: "",
          role: "",
          duration: "",
          responsibilities: [],
        });
        setRespInput("");
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [initialItem, isOpen]);

  if (!isOpen) return null;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const responsibilities = respInput
      .split("\n")
      .map((r) => r.trim())
      .filter(Boolean);

    onSave({
      ...form,
      responsibilities,
    });
    onClose();
  }

  return (
    <ModalPortal isOpen={isOpen}>
      <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg rounded-3xl border border-white/30 bg-white/30 p-6 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-900/30">
        <div className="flex items-center justify-between border-b border-black/5 pb-4 dark:border-white/10">
          <h2 className="text-lg font-semibold">
            {initialItem ? "Edit Experience" : "Add Experience"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-black/5 dark:hover:bg-white/10"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-300">
              Company / Organization Name
            </label>
            <input
              type="text"
              required
              value={form.company}
              onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
              placeholder="e.g. Freelance / Tech Company"
              className="mt-1.5 w-full rounded-2xl border border-black/10 bg-white/40 px-4 py-3 text-sm outline-none dark:border-white/10 dark:bg-zinc-900/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-300">
              Job Title / Role
            </label>
            <input
              type="text"
              required
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              placeholder="e.g. Frontend Web Developer"
              className="mt-1.5 w-full rounded-2xl border border-black/10 bg-white/40 px-4 py-3 text-sm outline-none dark:border-white/10 dark:bg-zinc-900/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-300">
              Duration / Dates
            </label>
            <input
              type="text"
              required
              value={form.duration}
              onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
              placeholder="e.g. 2024 - Present"
              className="mt-1.5 w-full rounded-2xl border border-black/10 bg-white/40 px-4 py-3 text-sm outline-none dark:border-white/10 dark:bg-zinc-900/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-300">
              Responsibilities & Achievements (one per line)
            </label>
            <textarea
              rows={4}
              value={respInput}
              onChange={(e) => setRespInput(e.target.value)}
              placeholder="Designed responsive user interfaces using React & Next.js..."
              className="mt-1.5 w-full rounded-2xl border border-black/10 bg-white/40 px-4 py-3 text-sm outline-none dark:border-white/10 dark:bg-zinc-900/30 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-black/5 dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold backdrop-blur transition hover:bg-white/20 dark:border-white/10 dark:text-zinc-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-2.5 text-sm font-semibold backdrop-blur transition hover:bg-white/20 dark:border-white/10 dark:text-zinc-100"
            >
              <FiSave />
              <span>Save Experience</span>
            </button>
          </div>
        </form>
      </div>
    </div>
    </ModalPortal>
  );
}
