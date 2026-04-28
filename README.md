## Developer Portfolio (Next.js + Tailwind + Framer Motion)

Modern, clean, animated developer portfolio built with:

- **Next.js (App Router)**
- **React**
- **Tailwind CSS**
- **Framer Motion**
- **React Icons**

### Project structure

- `src/app/`: routes (home + dynamic project details)
- `src/components/`: reusable UI components (navbar, footer, etc.)
- `src/sections/`: page sections (Hero/About/Skills/…)
- `src/data/`: content/data objects (projects, skills, etc.)
- `src/styles/`: small CSS utilities
- `public/`: images, `resume.pdf`, assets

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Edit your content here:

- `src/data/site.js` (name, intro, social links, contact info)
- `src/data/projects.js` (projects + detail page content)
- `src/data/skills.js`, `src/data/education.js`, `src/data/experience.js`

Replace images in `public/`:

- `public/profile-placeholder.svg` → replace with `profile.jpg` (or keep SVG)
- `public/project-*.svg` → replace with real project screenshots
- `public/resume.pdf` → add your resume file (the button still works as a placeholder if missing)

### Deployment (Vercel) — step by step

1. **Push to GitHub**
   - Create a new repo on GitHub
   - Commit and push this project

2. **Import on Vercel**
   - Go to Vercel → “Add New…” → “Project”
   - Import your GitHub repository

3. **Configure build settings**
   - Framework Preset: **Next.js**
   - Build Command: `npm run build`
   - Output: (leave default)
   - Install Command: `npm install`

4. **Deploy**
   - Click **Deploy**

5. **Optional: custom domain**
   - Project → Settings → Domains → add your domain and follow DNS steps

### Notes

- The contact form posts to a **placeholder API route** at `src/app/api/contact/route.js`. Connect it to an email provider later if you want real delivery.
