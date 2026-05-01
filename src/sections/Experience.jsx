"use client";

import AnimatedSection from "@/components/AnimatedSection";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { experience } from "@/data/experience";

export default function Experience() {
  const hasExp = Array.isArray(experience) && experience.length > 0;

  return (
    <AnimatedSection id="experience" className="py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="EXPERIENCE"
          title="Where I’ve worked"
          subtitle="Freelance work and team projects focused on building reliable UI and great user experiences."
        />

        {hasExp ? (
          <div className="grid gap-4">
            {experience.map((item) => (
              <div
                key={`${item.company}-${item.role}`}
                className="rounded-2xl border border-black/10 bg-[var(--card)] p-6 backdrop-blur transition hover:-translate-y-0.5 hover:border-black/15 dark:border-white/10 dark:hover:border-white/15"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                      {item.company}
                    </div>
                    <div className="mt-1 text-sm text-zinc-700 dark:text-zinc-200">
                      {item.role}
                    </div>
                  </div>
                  <div className="text-xs font-semibold tracking-wide text-zinc-500 dark:text-zinc-400">
                    {item.duration}
                  </div>
                </div>
                {Array.isArray(item.responsibilities) ? (
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                    {item.responsibilities.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-black/10 bg-[var(--card)] p-6 text-sm leading-7 text-zinc-600 backdrop-blur dark:border-white/10 dark:text-zinc-300">
            Currently seeking internship or junior developer opportunities.
          </div>
        )}
      </Container>
    </AnimatedSection>
  );
}
