# Saravanakumar KS — Portfolio

Personal portfolio for Saravanakumar KS, Full-Stack Developer & AI Engineer. Built with React, TypeScript, Tailwind CSS, shadcn/ui, Three.js (`@react-three/fiber`), and GSAP.

## Stack

- Vite + React 18 + TypeScript
- Tailwind CSS v4, class-based dark mode
- shadcn/ui (Radix-based) component primitives
- Three.js via `@react-three/fiber` for the hero constellation scene
- GSAP (`ScrollTrigger`, `SplitText`) for motion
- `react-hook-form` + `zod` for the contact form
- Resend + a Vercel serverless function (`api/contact.ts`) to deliver contact-form messages

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:5173.

## Environment variables

Copy `.env.example` to `.env` and set:

```
RESEND_API_KEY=your_resend_api_key
```

This is only required for the contact form's email delivery (`api/contact.ts`) when running on Vercel (`vercel dev` or deployed). The static site itself works without it.

## Build

```bash
npm run build
npm run preview
```

## Deploy

Deployed on Vercel — it auto-detects the Vite build (`dist` output). Add `RESEND_API_KEY` under the project's Environment Variables before the contact form can send email.
