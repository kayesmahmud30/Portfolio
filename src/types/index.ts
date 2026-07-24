import type { ComponentType } from "react";

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  youtube?: string;
  instagram?: string;
  leetcode?: string;
  [key: string]: string | undefined;
}

export interface SiteConfig {
  name: string;
  designationLoop: string[];
  intro: string;
  location: string;
  socials: SocialLinks;
}

export interface ContactConfig {
  email: string;
  phone?: string;
  whatsapp?: string;
}

export interface NavLink {
  id: string;
  label: string;
}

export interface Project {
  slug: string;
  title: string;
  image: string;
  summary: string;
  tags: string[];
  description: string;
  liveUrl: string;
  githubClientUrl: string;
  githubServerUrl?: string;
  challenges: string[];
  improvements: string[];
}

export interface Skill {
  name: string;
  icon?: ComponentType<{ className?: string }>;
  level: number;
}

export interface SkillGroup {
  title: string;
  skills: Skill[];
}

export interface EducationItem {
  institution: string;
  degree: string;
  year: string;
  description: string;
}

export interface ExperienceItem {
  company: string;
  role: string;
  duration: string;
  responsibilities?: string[];
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface ContactFormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export interface ContactFormStatus {
  state: "idle" | "sending" | "success" | "error";
  message: string;
}
