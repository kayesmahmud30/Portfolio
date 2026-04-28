"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ProjectCard({ project }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className="group rounded-3xl border border-black/10 bg-[var(--card)] shadow-sm backdrop-blur transition hover:border-black/15 dark:border-white/10 dark:hover:border-white/15"
    >
      <div className="relative overflow-hidden rounded-3xl">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/10 dark:to-black/40" />
        <Image
          src={project.image}
          alt={`${project.title} preview`}
          width={1200}
          height={700}
          className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] sm:h-52"
        />
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            {project.title}
          </h3>
        </div>
        <p className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-300">{project.summary}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags?.map((t) => (
            <span
              key={t}
              className="rounded-full border border-black/10 bg-white/50 px-3 py-1 text-xs font-medium text-zinc-700 backdrop-blur dark:border-white/10 dark:bg-zinc-900/30 dark:text-zinc-200"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-5">
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center justify-center rounded-full bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-900 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

