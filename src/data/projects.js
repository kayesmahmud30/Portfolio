export const projects = [
  {
    slug: "glass-dashboard",
    title: "Glass Dashboard",
    image: "/project-1.svg",
    summary: "A responsive analytics dashboard with glassmorphism cards and smooth transitions.",
    tags: ["Next.js", "Tailwind", "Framer Motion"],
    description:
      "Glass Dashboard is a UI-focused project built to showcase layout composition, responsive grids, and motion. It includes reusable cards, skeleton loading states, and subtle hover/scroll interactions.",
    liveUrl: "https://example.com",
    githubClientUrl: "https://github.com/",
    challenges: [
      "Balancing glassmorphism readability across light and dark themes.",
      "Designing motion that feels premium but never distracting.",
      "Maintaining consistent spacing across breakpoints.",
    ],
    improvements: [
      "Add real data integration and caching.",
      "Introduce advanced filtering and chart interactions.",
      "Add e2e tests for key flows.",
    ],
  },
  {
    slug: "portfolio-starter",
    title: "Portfolio Starter",
    image: "/project-2.svg",
    summary: "A minimal portfolio starter with sections, scroll spy, and dynamic project pages.",
    tags: ["React", "Next.js", "UI/UX"],
    description:
      "A clean and modular portfolio template with accessible navigation, animated section reveals, and project detail routes. Built for quick customization and great Lighthouse scores.",
    liveUrl: "https://example.com",
    githubClientUrl: "https://github.com/",
    challenges: [
      "Implementing scroll spy accurately with a sticky navbar.",
      "Keeping animations smooth across mobile devices.",
      "Structuring components for easy reuse and editing.",
    ],
    improvements: ["Add CMS integration (MDX/Contentlayer).", "Add blog section.", "Add image optimization pipeline."],
  },
  {
    slug: "form-flow",
    title: "Form Flow",
    image: "/project-3.svg",
    summary: "A polished contact form flow with validation and optimistic UI feedback.",
    tags: ["UX", "Validation", "Accessibility"],
    description:
      "Form Flow focuses on a great messaging experience: clear states, helpful errors, keyboard-friendly navigation, and non-blocking feedback. It’s designed to feel fast and reliable.",
    liveUrl: "https://example.com",
    githubClientUrl: "https://github.com/",
    challenges: [
      "Writing validation that’s strict but not frustrating.",
      "Designing error states that don’t break layout.",
      "Ensuring accessibility across inputs and alerts.",
    ],
    improvements: ["Add spam protection.", "Add email provider integration.", "Persist drafts locally."],
  },
];

export function getProjectBySlug(slug) {
  return projects.find((p) => p.slug === slug);
}

