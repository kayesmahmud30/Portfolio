"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import ProjectCard from "@/components/ProjectCard";
import type { Project } from "@/types";
import { FiArrowRight } from "react-icons/fi";

export default function Projects() {
  const [allProjects, setAllProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch("/api/admin/projects")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && Array.isArray(data.data)) {
          setAllProjects(data.data);
        }
      })
      .catch(() => {});
  }, []);

  // Show pinned projects; if none pinned, show first 3
  const pinnedProjects = allProjects.filter((p) => p.pinned);
  const displayedProjects = pinnedProjects.length > 0 ? pinnedProjects : allProjects.slice(0, 3);
  const hasMore = allProjects.length > displayedProjects.length;

  return (
    <AnimatedSection id="projects" className="py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="PROJECTS"
          title="Selected work"
          subtitle="A few projects that reflect my approach: clean structure, modern UI, and thoughtful motion."
        />

        {displayedProjects.length > 0 ? (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {displayedProjects.map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </div>

            {hasMore ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="mt-10 flex justify-center"
              >
                <Link
                  href="/projects"
                  className="group inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-6 py-3 text-sm font-semibold text-zinc-900 backdrop-blur transition hover:-translate-y-0.5 hover:border-black/15 hover:bg-white/80 dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-50 dark:hover:bg-zinc-900/60"
                >
                  View All Projects
                  <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            ) : null}
          </>
        ) : (
          <div className="rounded-3xl border border-black/10 bg-[var(--card)] p-8 text-center backdrop-blur dark:border-white/10">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              No projects added yet. Add projects from the Admin Dashboard.
            </p>
          </div>
        )}
      </Container>
    </AnimatedSection>
  );
}
