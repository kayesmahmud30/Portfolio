"use client";

import { useEffect, useState } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import SkillBar from "@/components/SkillBar";
import { skillGroups as staticSkillGroups } from "@/data/skills";
import type { SkillGroup } from "@/types";
import { getSkillIcon } from "@/lib/skillIcons";

export default function Skills() {
  const [groups, setGroups] = useState<SkillGroup[]>(staticSkillGroups);

  useEffect(() => {
    fetch("/api/admin/skills")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && Array.isArray(data.data)) {
          setGroups(data.data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <AnimatedSection id="skills" className="py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="SKILLS"
          title="Tools I use to build"
          subtitle="A practical mix of frontend, backend fundamentals, and daily tools—always improving through projects."
        />

        {groups.length > 0 ? (
          <div className="grid gap-8 lg:grid-cols-3">
            {groups.map((group) => (
              <div key={group.title}>
                <div className="mb-3 text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                  {group.title}
                </div>
                <div className="grid gap-3">
                  {group.skills.map((s) => {
                    const IconComponent = s.icon || getSkillIcon(s.name);
                    return (
                      <SkillBar
                        key={s.name}
                        icon={IconComponent}
                        name={s.name}
                        level={s.level}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-black/10 bg-[var(--card)] p-8 text-center backdrop-blur dark:border-white/10">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              No skills added yet. Manage skills from the Admin Dashboard.
            </p>
          </div>
        )}
      </Container>
    </AnimatedSection>
  );
}
