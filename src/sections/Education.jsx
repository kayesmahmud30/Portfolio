"use client";

import AnimatedSection from "@/components/AnimatedSection";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { education } from "@/data/education";

export default function Education() {
  return (
    <AnimatedSection id="education" className="py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="EDUCATION"
          title="Educational background"
          subtitle="A quick snapshot of where I learned fundamentals and how I kept building beyond the classroom."
        />

        <div className="relative grid gap-4">
          <div className="absolute left-4 top-0 hidden h-full w-px bg-black/10 dark:bg-white/10 sm:block" />

          {education.map((item, idx) => (
            <div
              key={`${item.institution}-${idx}`}
              className="relative rounded-2xl border border-black/10 bg-[var(--card)] p-6 backdrop-blur transition hover:-translate-y-0.5 hover:border-black/15 dark:border-white/10 dark:hover:border-white/15 sm:pl-12"
            >
              <div className="absolute left-0 top-7 hidden h-3 w-3 -translate-x-[6px] rounded-full bg-gradient-to-r from-indigo-500 to-sky-500 ring-4 ring-white dark:ring-black sm:block" />
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                <div>
                  <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                    {item.institution}
                  </div>
                  <div className="mt-1 text-sm text-zinc-700 dark:text-zinc-200">
                    {item.degree}
                  </div>
                </div>
                <div className="text-xs font-semibold tracking-wide text-zinc-500 dark:text-zinc-400">
                  {item.year}
                </div>
              </div>
              <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </AnimatedSection>
  );
}
