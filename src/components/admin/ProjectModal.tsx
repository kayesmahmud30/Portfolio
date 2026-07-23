"use client";

import { useState, useEffect, type FormEvent } from "react";
import ImageUploader from "@/components/admin/ImageUploader";
import type { Project } from "@/types";
import { FiX, FiSave } from "react-icons/fi";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Partial<Project>) => Promise<void>;
  project?: Project | null;
}

export default function ProjectModal({ isOpen, onClose, onSave, project }: ProjectModalProps) {
  const [form, setForm] = useState<Partial<Project>>({
    slug: "",
    title: "",
    image: "",
    summary: "",
    tags: [],
    description: "",
    liveUrl: "",
    githubClientUrl: "",
    challenges: [],
    improvements: [],
  });
  const [tagInput, setTagInput] = useState("");
  const [challengeInput, setChallengeInput] = useState("");
  const [improvementInput, setImprovementInput] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      if (project) {
        setForm(project);
        setTagInput(project.tags?.join(", ") || "");
        setChallengeInput(project.challenges?.join("\n") || "");
        setImprovementInput(project.improvements?.join("\n") || "");
      } else {
        setForm({
          slug: "",
          title: "",
          image: "/project-1.jpg",
          summary: "",
          tags: [],
          description: "",
          liveUrl: "",
          githubClientUrl: "",
          challenges: [],
          improvements: [],
        });
        setTagInput("");
        setChallengeInput("");
        setImprovementInput("");
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [project, isOpen]);

  if (!isOpen) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const tags = tagInput.split(",").map((t) => t.trim()).filter(Boolean);
      const challenges = challengeInput.split("\n").map((c) => c.trim()).filter(Boolean);
      const improvements = improvementInput.split("\n").map((i) => i.trim()).filter(Boolean);

      const generatedSlug =
        form.slug?.trim() || form.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "new-project";

      await onSave({
        ...form,
        slug: generatedSlug,
        tags,
        challenges,
        improvements,
      });

      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-black/10 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-zinc-950">
        <div className="flex items-center justify-between border-b border-black/5 pb-4 dark:border-white/10">
          <h2 className="text-lg font-semibold">{project ? "Edit Project" : "Add New Project"}</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-black/5 dark:hover:bg-white/10"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-300">Project Title</label>
            <input
              type="text"
              required
              value={form.title || ""}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. English Janala Vocabulary"
              className="mt-1.5 w-full rounded-2xl border border-black/10 bg-white/40 px-4 py-3 text-sm outline-none dark:border-white/10 dark:bg-zinc-900/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-300">Slug (URL)</label>
            <input
              type="text"
              value={form.slug || ""}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              placeholder="auto-generated-from-title"
              className="mt-1.5 w-full rounded-2xl border border-black/10 bg-white/40 px-4 py-3 text-sm outline-none dark:border-white/10 dark:bg-zinc-900/30"
            />
          </div>

          <ImageUploader
            label="Project Image (Cloudinary)"
            currentUrl={form.image}
            onUpload={(url) => setForm((f) => ({ ...f, image: url }))}
          />

          <div>
            <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-300">Short Summary</label>
            <input
              type="text"
              required
              value={form.summary || ""}
              onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
              placeholder="Brief 1-2 sentence overview"
              className="mt-1.5 w-full rounded-2xl border border-black/10 bg-white/40 px-4 py-3 text-sm outline-none dark:border-white/10 dark:bg-zinc-900/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-300">Tags (comma-separated)</label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="React, Next.js, Tailwind, TypeScript"
              className="mt-1.5 w-full rounded-2xl border border-black/10 bg-white/40 px-4 py-3 text-sm outline-none dark:border-white/10 dark:bg-zinc-900/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-300">Full Description</label>
            <textarea
              rows={4}
              required
              value={form.description || ""}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Detailed description of the project"
              className="mt-1.5 w-full rounded-2xl border border-black/10 bg-white/40 px-4 py-3 text-sm outline-none dark:border-white/10 dark:bg-zinc-900/30 resize-none"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-300">Live Demo URL</label>
              <input
                type="url"
                value={form.liveUrl || ""}
                onChange={(e) => setForm((f) => ({ ...f, liveUrl: e.target.value }))}
                placeholder="https://example.com"
                className="mt-1.5 w-full rounded-2xl border border-black/10 bg-white/40 px-4 py-3 text-sm outline-none dark:border-white/10 dark:bg-zinc-900/30"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-300">GitHub Repository URL</label>
              <input
                type="url"
                value={form.githubClientUrl || ""}
                onChange={(e) => setForm((f) => ({ ...f, githubClientUrl: e.target.value }))}
                placeholder="https://github.com/username/repo"
                className="mt-1.5 w-full rounded-2xl border border-black/10 bg-white/40 px-4 py-3 text-sm outline-none dark:border-white/10 dark:bg-zinc-900/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-300">Challenges (one per line)</label>
            <textarea
              rows={3}
              value={challengeInput}
              onChange={(e) => setChallengeInput(e.target.value)}
              placeholder="Managing state effectively..."
              className="mt-1.5 w-full rounded-2xl border border-black/10 bg-white/40 px-4 py-3 text-sm outline-none dark:border-white/10 dark:bg-zinc-900/30 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-300">Future Improvements (one per line)</label>
            <textarea
              rows={3}
              value={improvementInput}
              onChange={(e) => setImprovementInput(e.target.value)}
              placeholder="Add user authentication..."
              className="mt-1.5 w-full rounded-2xl border border-black/10 bg-white/40 px-4 py-3 text-sm outline-none dark:border-white/10 dark:bg-zinc-900/30 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-black/5 dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-5 py-2.5 text-sm font-semibold text-zinc-600 hover:bg-black/5 dark:text-zinc-300 dark:hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-900 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
            >
              <FiSave />
              <span>{saving ? "Saving..." : "Save Project"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
