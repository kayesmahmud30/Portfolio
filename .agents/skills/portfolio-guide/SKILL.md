---
name: portfolio-guide
description: Architecture guide, TypeScript types, layout standards, Better Auth authentication, MongoDB schemas, Cloudinary upload workflows, and modification procedures for the Kayes Mahmud Portfolio codebase.
---

# Portfolio Architecture & Development Guide

This guide provides a comprehensive analysis of the Portfolio project structure, design patterns, type definitions, and step-by-step instructions for completing future maintenance, feature additions, and UI refactoring tasks.

---

## 1. Stack & Tech Overview

- **Framework**: Next.js (App Router, React 19)
- **Language**: TypeScript (`strict: true`, fully typed components, pages, routes, data, and hooks)
- **Database**: MongoDB & Mongoose (`src/lib/db.ts` & `src/models/*`)
- **Authentication**: Better Auth (`src/lib/auth.ts`, `src/lib/auth-client.ts`, `/api/auth/[...all]`)
- **Image Hosting**: Cloudinary (`src/lib/cloudinary.ts` & `/api/upload`)
- **Admin Dashboard**: Hidden portal at `/admin-portal` with login at `/admin-portal/login`
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
├── .env.example                         # Demo environment variable template
├── public/                              # Static fallback images (profile.jpg, project-*.jpg, resume.pdf)
├── src/
│   ├── app/                             # Next.js App Router routes
│   │   ├── admin-portal/                # Hidden Admin Dashboard
│   │   │   ├── login/page.tsx           # Hidden Sign-in route
│   │   │   └── page.tsx                 # Protected Admin Management Dashboard
│   │   ├── api/
│   │   │   ├── admin/                   # Admin CRUD APIs (site, projects, skills, ed/exp)
│   │   │   ├── auth/[...all]/route.ts   # Better Auth API route handler
│   │   │   ├── contact/route.ts         # Contact form POST endpoint
│   │   │   └── upload/route.ts          # Cloudinary image upload endpoint
│   │   ├── projects/[slug]/page.tsx     # Dynamic project details page
│   │   ├── layout.tsx                   # Root HTML/Font/Provider layout
│   │   ├── page.tsx                     # Main single-page portfolio view
│   │   └── template.tsx                 # Route transition wrapper
│   ├── components/                      # UI components
│   │   ├── admin/
│   │   │   ├── ImageUploader.tsx        # Cloudinary drag-and-drop uploader with live preview
│   │   │   └── ProjectModal.tsx         # Add/Edit project modal dialog
│   │   ├── hooks/                       # Custom hooks
│   │   └── ...                          # Reusable public components
│   ├── lib/                             # Utility & service integrations
│   │   ├── auth.ts                      # Better Auth server configuration
│   │   ├── auth-client.ts               # Better Auth React client hooks
│   │   ├── db.ts                        # Mongoose MongoDB connection helper with static fallback
│   │   └── cloudinary.ts                # Cloudinary image upload helper
│   ├── models/                          # Mongoose database models
│   │   ├── Education.ts
│   │   ├── Experience.ts
│   │   ├── Project.ts
│   │   ├── SiteConfig.ts
│   │   └── SkillGroup.ts
│   ├── data/                            # Static fallback content modules
│   └── types/                           # Centralized TypeScript interfaces
```

---

## 3. Environment Variables (`.env.local`)

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/portfolio?retryWrites=true&w=majority
BETTER_AUTH_SECRET=32_character_secret_key_here
BETTER_AUTH_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 4. Admin Dashboard Features

- **Hidden Sign-in**: Admin manually navigates to `/admin-portal/login` (not listed in header or footer links).
- **Projects Manager**: Create, Edit, List, and Delete portfolio projects.
- **Profile & Banner Editor**: Edit personal bio, designation loop, contact details, and upload Profile & Banner background images via Cloudinary.
- **Skill Sets Manager**: Adjust skill categories, skill names, and proficiency percentages.
- **Static Fallback**: If MongoDB credentials are unconfigured or offline, public site automatically falls back to static data files (`src/data/*`).

---

## 5. Verification Standard for Future Tasks

Before declaring any future coding task complete on this repository, run:
1. `npx tsc --noEmit` (Must pass with 0 type errors)
2. `npm run lint` (Must pass with 0 ESLint warnings/errors)
3. `npm run build` (Must complete production build cleanly)
