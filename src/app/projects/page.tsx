"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ProjectCard from "@/components/ProjectCard";
import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";
import type { Project } from "@/types";
import { FiArrowLeft, FiSearch } from "react-icons/fi";

const ITEMS_PER_PAGE = 9;

export default function AllProjectsPage() {
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch("/api/admin/projects")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && Array.isArray(data.data)) {
          setAllProjects(data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const allTags = Array.from(
    new Set(allProjects.flatMap((p) => p.tags ?? []))
  ).sort();

  const filtered = allProjects.filter((p) => {
    const matchesSearch =
      search.trim() === "" ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.summary.toLowerCase().includes(search.toLowerCase()) ||
      p.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    const matchesTag = !activeTag || p.tags?.includes(activeTag);

    return matchesSearch && matchesTag;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  function handleSearch(val: string) {
    setSearch(val);
    setPage(1);
  }

  function handleTag(tag: string) {
    setActiveTag((prev) => (prev === tag ? null : tag));
    setPage(1);
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
      <Navbar />

      <main>
        {/* Hero Header */}
        <div className="relative overflow-hidden border-b border-black/5 dark:border-white/10 bg-white/60 dark:bg-zinc-950/60 backdrop-blur">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-32 left-1/2 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
          </div>
          <Container className="relative py-14 sm:py-18">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link
                href="/#projects"
                className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                <FiArrowLeft className="text-sm" /> Back to Portfolio
              </Link>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
                ALL PROJECTS
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-4xl">
                Complete Portfolio
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                Every project I&apos;ve built — from side experiments to production applications.
              </p>
            </motion.div>
          </Container>
        </div>

        <Container className="py-10">
          {/* Search + Filter */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-sm flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search projects..."
                className="w-full rounded-2xl border border-black/10 bg-white/40 pl-11 pr-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 dark:border-white/10 dark:bg-zinc-900/30"
              />
            </div>

            {allTags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTag(tag)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                      activeTag === tag
                        ? "bg-indigo-600 text-white"
                        : "border border-black/10 bg-white/50 text-zinc-700 hover:bg-white/80 dark:border-white/10 dark:bg-zinc-900/30 dark:text-zinc-300 dark:hover:bg-zinc-900/60"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
                {activeTag ? (
                  <button
                    type="button"
                    onClick={() => { setActiveTag(null); setPage(1); }}
                    className="rounded-full border border-black/10 bg-white/50 px-3.5 py-1.5 text-xs font-semibold text-zinc-500 transition hover:bg-white/80 dark:border-white/10 dark:bg-zinc-900/30 dark:hover:bg-zinc-900/60"
                  >
                    Clear Filter
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>

          {/* Results Count */}
          <p className="mt-5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {filtered.length} project{filtered.length !== 1 ? "s" : ""}
            {activeTag ? ` tagged "${activeTag}"` : ""}
            {search.trim() ? ` matching "${search}"` : ""}
          </p>

          {/* Grid */}
          {loading ? (
            <div className="mt-12 text-center text-sm text-zinc-500">Loading projects...</div>
          ) : paginated.length > 0 ? (
            <motion.div
              key={`${page}-${search}-${activeTag}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {paginated.map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </motion.div>
          ) : (
            <div className="mt-12 rounded-3xl border border-black/10 bg-[var(--card)] p-12 text-center dark:border-white/10">
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                No projects match your search.
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 ? (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-2xl border border-black/10 bg-white/40 px-4 py-2 text-xs font-semibold transition hover:bg-white/80 disabled:opacity-40 dark:border-white/10 dark:bg-zinc-900/30 dark:hover:bg-zinc-900/60"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  className={`h-9 w-9 rounded-2xl text-xs font-bold transition ${
                    page === n
                      ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
                      : "border border-black/10 bg-white/40 hover:bg-white/80 dark:border-white/10 dark:bg-zinc-900/30 dark:hover:bg-zinc-900/60"
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-2xl border border-black/10 bg-white/40 px-4 py-2 text-xs font-semibold transition hover:bg-white/80 disabled:opacity-40 dark:border-white/10 dark:bg-zinc-900/30 dark:hover:bg-zinc-900/60"
              >
                Next
              </button>
            </div>
          ) : null}
        </Container>
      </main>

      <Footer />
    </div>
  );
}
