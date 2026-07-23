## Developer Portfolio (Next.js + TypeScript + Tailwind + Framer Motion)

Modern, clean, animated developer portfolio built with:

- **Next.js (App Router, React 19)**
- **TypeScript** (Strict mode)
- **Tailwind CSS** (v4)
- **Framer Motion**
- **React Icons**
- **Next-Themes** (Dark/Light mode)

### Project Structure

- `src/app/`: Next.js App Router routes (Home, dynamic `/projects/[slug]`, `/api/contact`)
- `src/components/`: Reusable TSX UI components (Navbar, Footer, ProjectCard, ThemeToggle, etc.)
- `src/components/hooks/`: Typed custom hooks (`useActiveSection`, `useTypewriter`)
- `src/sections/`: Page sections (Hero, About, Skills, Education, Experience, Projects, Contact)
- `src/data/`: Type-safe content data modules (`site.ts`, `projects.ts`, `skills.ts`, `education.ts`, `experience.ts`)
- `src/types/`: Centralized TypeScript interface definitions (`index.ts`)
- `src/styles/`: Small CSS utilities & animation keyframes
- `public/`: Static image assets, profile photos, and resume PDF
- `.agents/skills/portfolio-guide/SKILL.md`: Architecture guide for AI agents working on this project

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Type Checking & Linting

```bash
npx tsc --noEmit   # Run TypeScript compiler check
npm run lint       # Run ESLint check
npm run build      # Build production bundle
```

### Editing Content

Edit content in `src/data/`:

- `src/data/site.ts` (Name, intro, social links, contact info)
- `src/data/projects.ts` (Projects list + detail page content)
- `src/data/skills.ts`, `src/data/education.ts`, `src/data/experience.ts`

Replace images in `public/`:

- `public/profile.jpg` → replace with your profile photo
- `public/project-*.jpg` → replace with real project screenshots
- `public/resume.pdf` → add your resume file

### Deployment (Vercel)

1. Push to GitHub
2. Import project on Vercel
3. Build Command: `npm run build`
4. Deploy!
