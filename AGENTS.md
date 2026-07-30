<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md - Portfolio Project Developer & AI Agent Guidelines

This repository contains the personal portfolio and management platform of Kayes Mahmud built with Next.js (App Router, React 19), TypeScript, Tailwind CSS v4, Framer Motion, Better Auth, and MongoDB/Cloudinary integrations.

All AI agents and developers working on this codebase MUST follow the standards and instructions outlined in this document.

---

## 1. Stack & Core Technologies

- **Framework**: Next.js 16+ (App Router, React 19, Turbopack dev server)
- **Language**: TypeScript (Strict mode enabled, 0 explicit `any` types allowed)
- **Styling**: Tailwind CSS v4 + Vanilla CSS utilities (`src/styles/utilities.css`, `src/app/globals.css`)
- **Animation**: Framer Motion (`framer-motion`)
- **Database & ODM**: MongoDB with Mongoose (`src/lib/db.ts` & `src/models/*`)
- **Authentication**: Better Auth (`src/lib/auth.ts`, `src/lib/auth-client.ts`, `/api/auth/[...all]`)
- **Media Storage**: Cloudinary (`src/lib/cloudinary.ts`, `/api/upload`)
- **Icons**: React Icons (`react-icons/si`, `react-icons/fi`, `react-icons/fa`)
- **Theme**: `next-themes` (Dark/Light theme provider with `class` strategy)

---

## 2. Code Architecture & Guidelines

### TypeScript & Components
- **Strict Typing**: All components, API routes, data structures, and hooks must be fully typed. Import types from `@/types` (`src/types/index.ts`).
- **Client vs. Server Components**: Explicitly add `'use client'` at the top of files using React hooks (`useState`, `useEffect`, `useContext`), Framer Motion, or browser APIs. Server components remain default.
- **Component Organization**:
  - `src/components/`: Reusable UI components (Navbar, Footer, ProjectCard, ThemeToggle, etc.).
  - `src/components/admin/`: Admin portal components (ImageUploader, ProjectModal, etc.).
  - `src/components/hooks/`: Custom typed React hooks (`useActiveSection`, `useTypewriter`).
  - `src/sections/`: Main portfolio section modules (Hero, About, Skills, Education, Experience, Projects, Contact).

### Static Fallback Strategy
- When MongoDB or network access is unavailable, the application gracefully degrades to static fallback data modules stored in `src/data/` (`site.ts`, `projects.ts`, `skills.ts`, `education.ts`, `experience.ts`).
- Any API route or feature fetching from MongoDB MUST handle connection/query errors gracefully without breaking the public user experience.

### Admin Portal & Auth
- The hidden admin dashboard is located at `/admin-portal`, accessible via `/admin-portal/login`.
- Protected admin API routes (`src/app/api/admin/...`) MUST verify authentication sessions via Better Auth before modifying MongoDB models.

---

## 3. Directory Map

```
Portfolio/
├── .agents/
│   └── skills/
│       └── portfolio-guide/
│           └── SKILL.md                 # Project Architecture & Maintenance Skill
├── .env.example                         # Environment variable blueprint
├── AGENTS.md                            # Agent guidelines & project standards (this file)
├── public/                              # Static fallback images and PDF assets
└── src/
    ├── app/                             # Next.js App Router pages & API handlers
    ├── components/                      # Shared TSX UI components & admin tools
    ├── data/                            # Static fallback content data
    ├── lib/                             # Utility & service integrations (DB, Auth, Cloudinary)
    ├── models/                          # Mongoose Database schemas
    ├── sections/                        # Main landing page sections
    ├── styles/                          # Animation keyframes & CSS utilities
    └── types/                           # Centralized TypeScript definitions
```

---

## 4. Development & Verification Commands

Before declaring any feature complete, code refactor, or bug fix, run the following verification steps:

```bash
# 1. Type Check (Must report 0 errors)
npx tsc --noEmit

# 2. Lint Check (Must report 0 errors/warnings)
npm run lint

# 3. Build Check (Must compile production bundle cleanly)
npm run build
```

During local development:
```bash
npm run dev     # Start Next.js development server
```

---

## 5. Skills & Context Guidelines

- Detailed schema specifications, API route documentation, and step-by-step modification workflows are maintained in `.agents/skills/portfolio-guide/SKILL.md`.
- Read the `portfolio-guide` skill file when implementing new API endpoints, adding database models, or updating admin portal components.

