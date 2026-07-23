---
name: portfolio-guide
description: Architecture guide, TypeScript types, layout standards, and modification procedures for the Kayes Mahmud Portfolio codebase.
---

# Portfolio Architecture & Development Guide

This guide provides a comprehensive analysis of the Portfolio project structure, design patterns, type definitions, and step-by-step instructions for completing future maintenance, feature additions, and UI refactoring tasks.

---

## 1. Stack & Tech Overview

- **Framework**: Next.js (App Router, React 19)
- **Language**: TypeScript (`strict: true`, fully typed components, pages, routes, data, and hooks)
- **Styling**: Tailwind CSS v4 + Vanilla CSS (`src/styles/utilities.css`, `src/app/globals.css`)
- **Animation**: Framer Motion (`AnimatePresence`, `motion`, `useScroll`, `useSpring`, `useInView`)
- **Icons**: React Icons (`react-icons/si`, `react-icons/fi`, `react-icons/fa`)
- **Theme**: `next-themes` (Dark/Light mode with class attribute strategy)

---

## 2. Directory & Architecture Structure

```
Portfolio/
├── .agents/
│   └── skills/
│       └── portfolio-guide/
│           └── SKILL.md                 # Agent Skill & Architecture Guide
├── public/                              # Static images (profile.jpg, project-*.jpg, resume.pdf)
├── src/
│   ├── app/                             # Next.js App Router routes
│   │   ├── api/contact/route.ts        # POST contact endpoint
│   │   ├── projects/[slug]/page.tsx     # Dynamic project details page
│   │   ├── globals.css                  # Global Tailwind styles & font variables
│   │   ├── layout.tsx                   # Root HTML/Font/Provider layout
│   │   ├── not-found.tsx                # Custom 404 page
│   │   ├── page.tsx                     # Main single-page portfolio view
│   │   └── template.tsx                 # Route transition wrapper (framer-motion)
│   ├── components/                      # Reusable UI components
│   │   ├── hooks/
│   │   │   ├── useActiveSection.ts      # Active navbar section tracker hook
│   │   │   └── useTypewriter.ts         # Typing text animation hook
│   │   ├── AnimatedSection.tsx          # Scroll-triggered section animation container
│   │   ├── Container.tsx                # Standard max-width layout wrapper
│   │   ├── Footer.tsx                   # Site footer with social links & copyright
│   │   ├── Navbar.tsx                   # Fixed top navigation bar with mobile drawer
│   │   ├── ProjectCard.tsx              # Card component for individual projects
│   │   ├── Providers.tsx                # ThemeProvider & MotionConfig wrapper
│   │   ├── ScrollProgress.tsx           # Top-aligned scroll indicator bar
│   │   ├── SectionHeading.tsx           # Standardized section header (Eyebrow, Title, Subtitle)
│   │   ├── SkillBar.tsx                 # Individual skill item with animated percentage bar
│   │   ├── SocialLinks.tsx              # Icon row for GitHub, LinkedIn, Twitter, Facebook
│   │   └── ThemeToggle.tsx              # Hydration-safe dark/light mode toggle button
│   ├── data/                            # Type-safe content data modules
│   │   ├── education.ts                 # Educational background data
│   │   ├── experience.ts                # Work & internship experience data
│   │   ├── projects.ts                  # Project showcase array & slug lookup helper
│   │   ├── site.ts                      # Personal metadata, intro & nav links
│   │   └── skills.ts                    # Grouped technical skills & icon mappings
│   ├── styles/
│   │   └── utilities.css                # CSS keyframes & custom layout classes
│   └── types/
│       └── index.ts                     # Centralized TypeScript definitions
├── next.config.mjs
├── package.json
└── tsconfig.json
```

---

## 3. Data & Type Models (`src/types/index.ts`)

When adding or modifying content, use the central types:

- **`SiteConfig`**: Controls portfolio header text, bio, contact email, phone, and social URLs (`src/data/site.ts`).
- **`Project`**: Defines project slug, title, image path, tags, description, live URL, GitHub URL, challenges, and improvements (`src/data/projects.ts`).
- **`SkillGroup` / `Skill`**: Group title and skills array with React Icon component and proficiency percentage (`src/data/skills.ts`).
- **`EducationItem`**: Institution name, degree, year range, and detailed description (`src/data/education.ts`).
- **`ExperienceItem`**: Company name, role title, duration string, and optional responsibility bullets (`src/data/experience.ts`).

---

## 4. Workflows for Common Tasks

### Task A: Adding a New Project
1. Open `src/data/projects.ts`.
2. Add a new object conforming to the `Project` interface.
3. Place project preview images in `public/` (e.g. `/project-4.jpg`).
4. Run `npx tsc --noEmit` and `npm run build` to verify slug generation.

### Task B: Adding a New Section to the Homepage
1. Create `src/sections/YourSection.tsx` wrapping content inside `<AnimatedSection id="your-section">` and `<Container>`.
2. Add navigation link `{ id: "your-section", label: "Your Section" }` to `navLinks` in `src/data/site.ts`.
3. Import and place `<YourSection />` inside `<main>` in `src/app/page.tsx`.

### Task C: Modifying Contact API / Integrations
1. Edit `src/app/api/contact/route.ts`.
2. Handle request payload using typed `NextRequest`.
3. Return response using `NextResponse.json()`.

---

## 5. Verification Standard for Future Tasks

Before declaring any future coding task complete on this repository, run:
1. `npx tsc --noEmit` (Must pass with 0 type errors)
2. `npm run lint` (Must pass with 0 ESLint warnings/errors)
3. `npm run build` (Must complete production build cleanly)
