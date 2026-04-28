import {
  SiCss,
  SiExpress,
  SiGithub,
  SiGit,
  SiHtml5,
  SiJavascript,
  SiNextdotjs,
  SiNodedotjs,
  SiReact,
  SiTailwindcss,
} from "react-icons/si";
import { FiCode } from "react-icons/fi";

export const skillGroups = [
  {
    title: "Frontend",
    skills: [
      { name: "HTML", icon: SiHtml5, level: 92 },
      { name: "CSS", icon: SiCss, level: 88 },
      { name: "Tailwind", icon: SiTailwindcss, level: 90 },
      { name: "JavaScript", icon: SiJavascript, level: 86 },
      { name: "React", icon: SiReact, level: 84 },
      { name: "Next.js", icon: SiNextdotjs, level: 80 },
    ],
  },
  {
    title: "Backend",
    skills: [
      { name: "Node.js", icon: SiNodedotjs, level: 72 },
      { name: "Express", icon: SiExpress, level: 70 },
    ],
  },
  {
    title: "Tools",
    skills: [
      { name: "Git", icon: SiGit, level: 78 },
      { name: "GitHub", icon: SiGithub, level: 82 },
      { name: "VS Code", icon: FiCode, level: 90 },
    ],
  },
];

