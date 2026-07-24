import type { Project } from "@/types";

export const projects: Project[] = [];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
