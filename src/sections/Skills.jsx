"use client";

import AnimatedSection from "@/components/AnimatedSection";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import SkillBar from "@/components/SkillBar";
import { skillGroups } from "@/data/skills";

export default function Skills() {
  return (
    <AnimatedSection id="skills" className="py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="SKILLS"
          title="Tools I use to build"
          subtitle="A practical mix of frontend, backend fundamentals, and daily tools—always improving through projects."
        />

        <div className="grid gap-8 lg:grid-cols-3">
          {skillGroups.map((group) => (
            <div key={group.title}>
              <div className="mb-3 text-sm font-semibold text-zinc-950 dark:text-zinc-50">{group.title}</div>
              <div className="grid gap-3">
                {group.skills.map((s) => (
                  <SkillBar key={s.name} icon={s.icon} name={s.name} level={s.level} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </AnimatedSection>
  );
}

