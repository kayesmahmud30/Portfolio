import type { ComponentType } from "react";
import {
  SiHtml5,
  SiCss,
  SiTailwindcss,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiPostgresql,
  SiMysql,
  SiFirebase,
  SiPrisma,
  SiGit,
  SiGithub,
  SiPython,
  SiCplusplus,
  SiDocker,
  SiFigma,
  SiRedux,
  SiGraphql,
  SiBootstrap,
  SiSass,
  SiVite,
  SiWebpack,
  SiVercel,
  SiSupabase,
  SiRust,
  SiGo,
  SiPhp,
  SiLaravel,
  SiDjango,
  SiLinux,
  SiUbuntu,
  SiNginx,
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc";
import { FiCode } from "react-icons/fi";

const iconDictionary: Record<string, ComponentType<{ className?: string }>> = {
  // Frontend
  html: SiHtml5,
  html5: SiHtml5,
  css: SiCss,
  css3: SiCss,
  tailwind: SiTailwindcss,
  tailwindcss: SiTailwindcss,
  javascript: SiJavascript,
  js: SiJavascript,
  typescript: SiTypescript,
  ts: SiTypescript,
  react: SiReact,
  reactjs: SiReact,
  next: SiNextdotjs,
  nextjs: SiNextdotjs,
  "next.js": SiNextdotjs,
  vite: SiVite,
  webpack: SiWebpack,
  redux: SiRedux,
  bootstrap: SiBootstrap,
  sass: SiSass,
  scss: SiSass,

  // Backend & Database
  node: SiNodedotjs,
  nodejs: SiNodedotjs,
  "node.js": SiNodedotjs,
  express: SiExpress,
  expressjs: SiExpress,
  "express.js": SiExpress,
  mongo: SiMongodb,
  mongodb: SiMongodb,
  postgres: SiPostgresql,
  postgresql: SiPostgresql,
  mysql: SiMysql,
  firebase: SiFirebase,
  supabase: SiSupabase,
  prisma: SiPrisma,
  graphql: SiGraphql,
  python: SiPython,
  cpp: SiCplusplus,
  "c++": SiCplusplus,
  rust: SiRust,
  go: SiGo,
  golang: SiGo,
  php: SiPhp,
  laravel: SiLaravel,
  django: SiDjango,

  // Tools & Platforms
  git: SiGit,
  github: SiGithub,
  vscode: VscVscode,
  "vs code": VscVscode,
  visualstudiocode: VscVscode,
  docker: SiDocker,
  figma: SiFigma,
  vercel: SiVercel,
  linux: SiLinux,
  ubuntu: SiUbuntu,
  nginx: SiNginx,
};

/**
 * Automatically resolves a skill name to its matching icon component.
 * Normalizes input (lowercase, removes special chars) and matches aliases.
 * Falls back to FiCode for custom/unknown skills.
 */
export function getSkillIcon(skillName: string): ComponentType<{ className?: string }> {
  if (!skillName) return FiCode;

  // 1. Direct match
  const lower = skillName.toLowerCase().trim();
  if (iconDictionary[lower]) return iconDictionary[lower];

  // 2. Normalized match (remove spaces, dots, dashes)
  const normalized = lower.replace(/[\s.\-_]/g, "");
  if (iconDictionary[normalized]) return iconDictionary[normalized];

  // 3. Partial keyword matching
  for (const key of Object.keys(iconDictionary)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return iconDictionary[key];
    }
  }

  // 4. Default fallback for custom skills
  return FiCode;
}
