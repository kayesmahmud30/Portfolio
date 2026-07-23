"use client";

import { useEffect, useState } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import ProjectCard from "@/components/ProjectCard";
import { projects as staticProjects } from "@/data/projects";
import type { Project } from "@/types";

export default function Projects() {
  const [projectList, setProjectList] = useState<Project[]>(staticProjects);

  useEffect(() => {
    fetch("/api/admin/projects")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && Array.isArray(data.data) && data.data.length > 0) {
          setProjectList(data.data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <AnimatedSection id="projects" className="py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="PROJECTS"
          title="Selected work"
          subtitle="A few projects that reflect my approach: clean structure, modern UI, and thoughtful motion."
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projectList.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </Container>
    </AnimatedSection>
  );
}
