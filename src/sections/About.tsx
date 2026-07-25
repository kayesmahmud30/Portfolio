"use client";

import { useEffect, useState } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import type { AboutConfig } from "@/types";

const DEFAULT_ABOUT: AboutConfig = {
  title: "A little about me",
  subtitle:
    "I like building interfaces that feel effortless—clean visuals, solid structure, and small details that make people smile.",
  cards: [
    {
      heading: "My journey",
      paragraphs: [
        "I started programming out of curiosity—wanting to understand how websites work behind the scenes. Over time, that curiosity became a habit: building small projects, breaking things, fixing them, and learning the \"why\" behind good code and good design.",
        "Today I enjoy crafting modern web apps where performance and accessibility are non-negotiable, and where UI polish comes from careful spacing, typography, and interaction design—not visual noise.",
      ],
    },
    {
      heading: "What I love working on",
      paragraphs: [
        "I'm happiest when I'm building reusable components, designing clean layouts, and turning complex requirements into simple user flows. I especially like React + Next.js, Tailwind for fast iteration, and motion that feels natural and purposeful.",
        "My goal is to grow into a developer who can own features end-to-end—from UX thinking and system design down to clean implementation and testing. Outside programming, I enjoy learning new tools, exploring design inspiration, and taking breaks with music, reading, or a good walk.",
      ],
    },
  ],
};

export default function About() {
  const [about, setAbout] = useState<AboutConfig>(DEFAULT_ABOUT);

  useEffect(() => {
    fetch("/api/admin/about")
      .then((r) => r.json())
      .then((d) => {
        if (d.ok && d.data) setAbout(d.data);
      })
      .catch(() => {});
  }, []);

  return (
    <AnimatedSection id="about" className="py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="ABOUT"
          title={about.title}
          subtitle={about.subtitle}
        />

        {about.cards.length > 0 ? (
          <div className="grid gap-6 text-zinc-700 dark:text-zinc-200 md:grid-cols-2">
            {about.cards.map((card, i) => (
              <div
                key={i}
                className="rounded-2xl border border-black/10 bg-[var(--card)] p-6 backdrop-blur dark:border-white/10"
              >
                <h3 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
                  {card.heading}
                </h3>
                {card.paragraphs.map((para, j) => (
                  <p key={j} className="mt-3 leading-7 text-zinc-600 dark:text-zinc-300">
                    {para}
                  </p>
                ))}
              </div>
            ))}
          </div>
        ) : null}
      </Container>
    </AnimatedSection>
  );
}
