"use client";

import AnimatedSection from "@/components/AnimatedSection";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";

export default function About() {
  return (
    <AnimatedSection id="about" className="py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="ABOUT"
          title="A little about me"
          subtitle="I like building interfaces that feel effortless—clean visuals, solid structure, and small details that make people smile."
        />

        <div className="grid gap-6 text-zinc-700 dark:text-zinc-200 md:grid-cols-2">
          <div className="rounded-2xl border border-black/10 bg-[var(--card)] p-6 backdrop-blur dark:border-white/10">
            <h3 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">My journey</h3>
            <p className="mt-3 leading-7 text-zinc-600 dark:text-zinc-300">
              I started programming out of curiosity—wanting to understand how websites work behind the scenes.
              Over time, that curiosity became a habit: building small projects, breaking things, fixing them,
              and learning the “why” behind good code and good design.
            </p>
            <p className="mt-3 leading-7 text-zinc-600 dark:text-zinc-300">
              Today I enjoy crafting modern web apps where performance and accessibility are non-negotiable,
              and where UI polish comes from careful spacing, typography, and interaction design—not visual noise.
            </p>
          </div>

          <div className="rounded-2xl border border-black/10 bg-[var(--card)] p-6 backdrop-blur dark:border-white/10">
            <h3 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">What I love working on</h3>
            <p className="mt-3 leading-7 text-zinc-600 dark:text-zinc-300">
              I’m happiest when I’m building reusable components, designing clean layouts, and turning complex
              requirements into simple user flows. I especially like React + Next.js, Tailwind for fast iteration,
              and motion that feels natural and purposeful.
            </p>
            <p className="mt-3 leading-7 text-zinc-600 dark:text-zinc-300">
              My goal is to grow into a developer who can own features end-to-end—from UX thinking and system design
              down to clean implementation and testing. Outside programming, I enjoy learning new tools, exploring
              design inspiration, and taking breaks with music, reading, or a good walk.
            </p>
          </div>
        </div>
      </Container>
    </AnimatedSection>
  );
}

