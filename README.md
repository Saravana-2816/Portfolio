# Saravanakumar KS — Portfolio

Personal portfolio for Saravanakumar KS, Full-Stack Developer & AI Engineer.

The design direction is **Latent Space**: the hero draws the name in thousands of WebGL particles that part around the cursor, then burst into a 3D embedding cloud as you scroll. Everything after the hero stays quiet and fast, with motion tied to what each section is: a timeline that lights as you reach each role, project diagrams that draw themselves, and a skill search that ranks matches to the front.

## Stack

- Vite + React 19 + TypeScript (strict)
- Tailwind CSS v4 with class-based dark mode and named design tokens (`src/index.css`)
- Three.js via `@react-three/fiber` for the particle field (custom shaders, code-split)
- GSAP: ScrollTrigger, SplitText, ScrambleText, DrawSVG, Flip, CustomEase
- Lenis for smooth scrolling, synced to the GSAP ticker
- `react-hook-form` + `zod` for the contact form (lazy-loaded), `sonner` for toasts
- Resend + a Vercel serverless function (`api/contact.ts`) to deliver messages

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:5173.

## Project layout

```
src/
  components/
    layout/     Navbar, Footer, ThemeToggle, ScrollProgress, BackToTop, Section headings
    sections/   Hero, About, Experience, Projects (+ diagrams), Skills, Education, Connect
    three/      LatentField (R3F canvas), shaders, name sampling, shared field state
    ui/         PillButton, Sonner toaster
  data/         site, experience, projects, skills, education (all copy lives here)
  hooks/        useTheme, useActiveSection, useMagnetic, useReducedMotion
  lib/          gsap (plugin registration), smooth-scroll, motion helpers, env checks
api/
  contact.ts    Contact form delivery through Resend, with a honeypot field
```

Project links: each entry in `src/data/projects.ts` has an optional `href`. The link button only appears once it is filled in.

## How the hero works

1. The DOM lays out the name as real text (screen readers and search engines read it).
2. `sampleName` draws each line into an offscreen canvas at the exact on-screen position and samples the glyph pixels.
3. The WebGL field animates those points from a clustered 3D cloud into the name, and scroll progress drives the burst and camera flight.
4. Phones, reduced motion, and devices without WebGL get the crisp text name instead. Phones load the ambient 3D cloud only after the first scroll or touch.

## Performance and accessibility

- Lighthouse (mobile, local production build): Accessibility, Best Practices and SEO 100; Performance in the 90s once warm.
- Sections below the hero mount one per frame; section animations are set up only as you approach them.
- Display and body fonts are preloaded, and the phone hero waits briefly for them so the font swap never shifts the layout.
- `prefers-reduced-motion` removes the canvas, smooth scrolling, and scroll-driven motion, and shows every element in its final state.

## Environment variables

Copy `.env.example` to `.env` and set:

```
RESEND_API_KEY=your_resend_api_key
```

Only the contact form needs it, when running on Vercel (`vercel dev` or deployed). The site itself works without it.

## Build

```bash
npm run build
npm run preview
```

## Deploy

Live at https://saravanakumarks.vercel.app. Vercel deploys every push to `main` (it auto-detects the Vite build and the `api/` function). Add `RESEND_API_KEY` under the project's Environment Variables for the contact form. If the domain changes, update the absolute URLs in `index.html`, `public/sitemap.xml` and `public/robots.txt`.
