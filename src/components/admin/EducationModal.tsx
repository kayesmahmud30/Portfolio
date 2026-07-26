"use client";

import { useState, useEffect, type FormEvent } from "react";
import type { EducationItem } from "@/types";
import { FiX, FiSave } from "react-icons/fi";
import ModalPortal from "@/components/admin/ModalPortal";

interface EducationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: EducationItem) => void;
  initialItem?: EducationItem | null;
}

export default function EducationModal({
  isOpen,
  onClose,
  onSave,
  initialItem,
}: EducationModalProps) {
  const [form, setForm] = useState<EducationItem>({
    institution: "",
    degree: "",
    year: "",
    description: "",
  });

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      if (initialItem) {
        setForm(initialItem);
      } else {
        setForm({
          institution: "",
          degree: "",
          year: "",
          description: "",
        });
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [initialItem, isOpen]);

  if (!isOpen) return null;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSave(form);
    onClose();
  }

  return (
    <ModalPortal isOpen={isOpen}>
      <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg rounded-3xl border border-white/30 bg-white/30 p-6 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-900/30">
        <div className="flex items-center justify-between border-b border-black/5 pb-4 dark:border-white/10">
          <h2 className="text-lg font-semibold">
            {initialItem ? "Edit Education" : "Add Education"}
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
              Institution Name
            </label>
            <input
              type="text"
              required
              value={form.institution}
              onChange={(e) => setForm((f) => ({ ...f, institution: e.target.value }))}
              placeholder="e.g. Govt. Tolaram College"
              className="mt-1.5 w-full rounded-2xl border border-black/10 bg-white/40 px-4 py-3 text-sm outline-none dark:border-white/10 dark:bg-zinc-900/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-300">
              Degree / Course
            </label>
            <input
              type="text"
              required
              value={form.degree}
              onChange={(e) => setForm((f) => ({ ...f, degree: e.target.value }))}
              placeholder="e.g. B.A. (Honours) in Bengali Language & Literature"
              className="mt-1.5 w-full rounded-2xl border border-black/10 bg-white/40 px-4 py-3 text-sm outline-none dark:border-white/10 dark:bg-zinc-900/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-300">
              Year / Duration
            </label>
            <input
              type="text"
              required
              value={form.year}
              onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
              placeholder="e.g. 2025 - Present"
              className="mt-1.5 w-full rounded-2xl border border-black/10 bg-white/40 px-4 py-3 text-sm outline-none dark:border-white/10 dark:bg-zinc-900/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-300">
              Description
            </label>
            <textarea
              rows={3}
              required
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Brief details about studies and achievements"
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
              <span>Save Education</span>
            </button>
          </div>
        </form>
      </div>
    </div>
    </ModalPortal>
  );
}
