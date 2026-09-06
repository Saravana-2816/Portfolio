# Portfolio Website — Build Prompt for Claude Code

**Subject:** Saravanakumar KS — Full-Stack Developer & AI Engineer
**Goal:** A production-quality, single-page personal portfolio, deployed on Vercel.

## How to use this document
Paste this whole file as your first message to Claude Code, or save it as `CLAUDE.md` in a new, empty project folder and run `claude` from inside it — Claude Code reads `CLAUDE.md` automatically as persistent context for the session. Everything under a "Content" heading below is final copy — use it as-is.

---

## 1. Project Brief

Build and deploy a personal portfolio for Saravanakumar KS. He's a Full-Stack Developer whose real pull is toward backend engineering and AI — RAG pipelines, fine-tuned LLMs, agentic workflows, Kubernetes. The site should read that way: closer to a well-built systems dashboard with personality than a generic, colorful "creative portfolio" template. Spend the one big creative swing on the hero (copy + a Three.js scene). Keep everything after it quietly disciplined, fast, and purposeful — restraint is part of the brief, not a lack of effort.

---

## 2. Tech Stack

- **Build tool:** Vite
- **Framework:** React 18 + TypeScript (strict mode, no unexplained `any`)
- **Styling:** Tailwind CSS, class-based dark mode (`darkMode: "class"`)
- **Component primitives:** shadcn/ui as the primary kit (Radix-based, built natively on Tailwind). Bootstrap with `npx shadcn@latest init` and pick the **Vite** template — current versions of the CLI scaffold Vite + Tailwind + shadcn + dark-mode boilerplate together in that one step.
- **Icons:** `lucide-react` as the default set (ships alongside shadcn). Pull in `@mui/icons-material` only for a specific icon lucide doesn't have — don't install the full Material UI component library on top of shadcn; two component systems fighting for the same buttons/cards will just add bundle weight and visual inconsistency.
- **3D:** Three.js via `@react-three/fiber` + `@react-three/drei` — the idiomatic way to use Three.js inside React (avoid wiring raw imperative Three.js into a component).
- **Animation:** GSAP, using `@gsap/react`'s `useGSAP()` hook and the `ScrollTrigger` plugin. Every GSAP plugin (SplitText, DrawSVG, Observer, etc.) has been 100% free, including for commercial use, since Webflow's acquisition of GreenSock — use whichever plugin genuinely helps, no license workarounds needed.
- **Forms/validation:** `react-hook-form` + `zod` (pairs natively with shadcn's `Form` component).
- **Contact form backend:** a Vercel serverless function (`/api/contact.ts`) using Resend (or a similar transactional email API) to deliver messages — a nice, on-brand touch given his backend background. Simpler fallback if you'd rather skip a backend route: EmailJS, fully client-side.
- **Deployment:** Vercel
- **Package manager:** npm (or pnpm)

---

## 3. Design Direction

Don't default to a generic "AI portfolio template" look. Ground every choice in who this actually is: an engineer whose favorite work is backend systems and AI. Think **systems / signal / structure** — not a gradient-blob SaaS landing page.

### Color (named tokens, not raw Tailwind defaults)

| Name | Dark mode | Light mode | Role |
|---|---|---|---|
| Ink | `#0B1220` | — | Page background (dark) — a deep navy, not flat black |
| Paper | — | `#F7F9FC` | Page background (light) |
| Panel | `#121B2E` | `#FFFFFF` | Card / surface background |
| Line | `#1E293B` | `#E2E8F0` | Borders, dividers |
| Signal | `#38BDF8` | `#0284C7` | Primary accent (cyan) — links, primary buttons, active states |
| Pulse | `#8B5CF6` | `#7C3AED` | Secondary accent (violet) — pairs with Signal in gradients, tags AI/ML content |
| Text | `#E5E9F0` | `#0F172A` | Primary text |
| Muted | `#8B95A7` | `#55617A` | Secondary text |

Use the Signal→Pulse gradient in one or two spots only (the hero name is a good one) — not on every heading.

### Type
- Display/headings: **Space Grotesk** — geometric and technical, gives the page a real personality.
- Body: **Inter** — neutral, legible, gets out of the way.
- Keep paragraph line length under ~75 characters (bio, project descriptions) with a max-width wrapper — don't let text stretch full-bleed on large monitors or TVs.
- Don't add a third "mood" typeface. If a monospace accent shows up at all, keep it to one small utility spot (e.g. tech-tag chips), not a competing personality.

### Layout concept
- Single continuous scroll, generous vertical rhythm between sections.
- Left-aligned headings and body copy throughout — skip the centered-text-over-full-bleed-background look.
- **The hero is the one exception and the one signature moment:** two columns on laptop/desktop, copy on the left, the Three.js scene occupying the right ~45–50% of the viewport (rather than a full-bleed background with text floating on top, which is the default every "AI portfolio" reaches for). Stacks to a single column on tablet/mobile, with a simplified scene behind or above the text.
- Content max-width ~1120px; let the canvas/background use the full viewport, but never stretch text that wide.

### Explicitly avoid
These read as generated/templated rather than considered — steer around them:
- The same fade-and-slide-up on every section, and the same hover-tilt-glow on every card. Pick one signature animated moment (the hero) and make the rest of the motion purposeful — see Section 9.
- ALL-CAPS "eyebrow" labels above every heading, meta text joined with middle dots, arrows appended to every button label.
- Numbering things that aren't actually a sequence. Projects and Skills are **not** numbered; Experience and Education genuinely are a timeline, so a connected rail there is appropriate.
- Making every card (experience, project, education) look visually identical — vary treatment so the type of content is legible from its shape, not just its label.
- For any copy you have to invent that isn't specified below (button microcopy, empty states, form errors): plain language, active voice, no filler.

---

## 4. Responsive Requirements

| Breakpoint | Range | Notes |
|---|---|---|
| Mobile | 320–639px | Single column, hamburger nav, lighter 3D scene (fewer nodes) or a static gradient fallback on low-end devices |
| Tablet | 640–1023px | Single column, roomier spacing, full scene at a reduced particle count |
| Laptop/Desktop | 1024–1535px | Two-column hero, full effects |
| Large display / TV | 1536px+ (up to ~3840px) | Scale spacing/type up modestly, but cap content width (~1120–1280px) and center it — don't stretch cards or text edge-to-edge on a 4K display |

Check every section at 375, 768, 1024, 1440, and 2560px widths before calling it done.

---

## 5. Light / Dark Mode

- Tailwind's `class` strategy; toggle lives in the navbar (sun/moon icon swap, small GSAP rotation/fade on toggle).
- Default to the visitor's OS preference (`prefers-color-scheme`) on first visit; persist their explicit choice in `localStorage` after that. Read the stored/OS preference before first paint so there's no flash of the wrong theme.
- Re-theme **everything**, including the Three.js scene — node/line colors and the canvas clear color should shift between the Signal/Pulse dark values and their light-mode counterparts, not just the surrounding DOM.

---

## 6. Global Components

- **Navbar** — sticky, transparent over the hero, gains a blurred background + subtle border after scrolling past it. Links to each section, active-section indicator, theme toggle, mobile view collapses into a slide-in menu.
- **Footer** — quick links, social icons (GitHub, LinkedIn, email), a "Built with React, Three.js & GSAP" line, dynamic copyright year.
- **Scroll progress bar** — thin bar under the navbar tracking scroll position.
- **Back-to-top button** — appears once scrolled past the hero.

---

## 7. Sections

### 7.1 Hero
Layout per Section 3: text left, Three.js scene right (desktop), stacked on mobile.

**Content:**
- Lead-in line: "Hi, I'm"
- Name (large, gradient-eligible): **Saravanakumar KS**
- Rotating role line (GSAP text swap, not a heavy typewriter library): "Full-Stack Developer" / "AI Engineer" / "RAG & LLM Builder" / "Aspiring System Design Architect"
- Tagline: "I build full-stack products end-to-end — and the intelligence that powers them."
- CTAs: "View My Work" (scrolls to Projects), "Let's Connect" (scrolls to Connect)
- Social row: GitHub, LinkedIn, Email
- A small animated scroll cue at the bottom of the viewport

3D scene detail: Section 8. Entrance animation detail: Section 9.

### 7.2 About
**Content — use verbatim:**

> Hi, I'm Saravanakumar KS — a Full-Stack Developer by role, and an AI Engineer at heart. Day to day, I build across the stack with React, React Native, Node.js, GraphQL, and PostgreSQL, but where I really lean in is backend engineering and AI: I've built production RAG pipelines, fine-tuned lightweight LLaMA models, and worked hands-on with MCP tools and agentic AI frameworks — all backed by a strong foundation in Machine Learning and Deep Learning. I'm currently deepening my System Design skills to architect things that scale, with practical DevOps experience in Docker, Kubernetes, and Jenkins to back it up. For me, good engineering doesn't stop at "it works" — it has to ship, and it has to scale.

Small stat row beneath it (count up once when scrolled into view):
- `4+` Projects shipped
- `2` Teams worked with
- `8.54` CGPA / 10
- `Backend + AI` Core focus

### 7.3 Experience
Sequential — connected timeline rail is appropriate here. Most recent first.

**Content:**

**Slate.AI, Bangalore — Junior Software Developer** · Jan 2026 – Present
- Building modules across the mobile app (React Native) and web app (React), owning both frontend and backend implementation.
- Also handles basic DevOps as part of the role — containerizing services and working with Kubernetes.
- Tools: React, React Native, TypeScript, JavaScript, SCSS, Node.js/Express, GraphQL, Hasura, PostgreSQL, REST API, Docker, Kubernetes, Python, FastAPI

**Kenesis — AI Intern** · Jul 2025 – Oct 2025 (4 months, during college)
- Worked on AI/agentic systems using Python, Pydantic, FastAPI, and Flask.
- Built with agentic AI frameworks including LangChain and CrewAI.
- Tools: Python, Pydantic, FastAPI, Flask, LangChain, CrewAI

### 7.4 Projects
Not sequential — grid layout, no numbering. 2-column grid on desktop, 1-column on mobile. One considered hover interaction (e.g. tags/description shift into view over the title, or a soft tag-colored wash) rather than a generic tilt-and-glow applied to every card.

**Content:**

1. **Facial Recognition Attendance System — Construction Sites** *(Production — CasaGrand, DRA)*
   Marks labourer attendance and calculates working hours and wages on active construction sites. Recognition runs over a WebSocket connection using the ArcFace model, with face embeddings stored in Milvus. Included on-site deployment support at client locations.
   Tags: Computer Vision · WebSockets · Milvus · ArcFace · Production

2. **RAG-Based VC Matching Chatbot**
   Helps startup founders and first-time entrepreneurs find the right venture capitalists for their idea through a RAG-powered chat interface, then lets the founder and VC talk directly in-platform to work toward a deal.
   Tags: RAG · LLMs · Chatbot · Startups

3. **Virtual Try-On — Fashion Recommendation System**
   Users upload a photo of themselves and an outfit to preview the fit, plus get personalized outfit recommendations based on their taste — trained on a large Myntra fashion dataset from Kaggle.
   Tags: Computer Vision · Recommendation Systems · ML

4. **Document Management System** *(Drive-style)*
   A Google Drive-style clone covering document versioning and a hierarchical folder/file tree, with files stored in Amazon S3 and metadata in PostgreSQL — built to understand how production file-system design actually works.
   Tags: System Design · AWS S3 · PostgreSQL

No live/GitHub links were provided. Keep an optional `href` field per project in the data file, and hide the link button entirely when it's empty rather than linking to nothing — fill these in once available.

### 7.5 Skills
Not sequential — grouped chips by category, no numbering.

**Content — group exactly like this:**
- **Frontend:** React, React Native, SCSS, Tailwind CSS, TypeScript, JavaScript, Material UI
- **Backend:** Node.js, Express.js, Flask, REST API, GraphQL, FastAPI, WebSockets, JWT, Hasura
- **Databases:** PostgreSQL, MySQL, MongoDB
- **Cloud & DevOps:** Docker, Kubernetes, Jenkins, AWS (IAM, Lambda, ECS, EC2, S3)
- **AI / ML:** Machine Learning, Deep Learning, Generative AI, RAG, MCP, Agentic AI, CrewAI, LangChain, NLP
- **Languages:** C, C++, Java, Python, JavaScript

### 7.6 Education
Sequential (two entries in time) — same timeline family as Experience, but visually distinguished (e.g. a lighter/secondary rail) so Experience and Education don't look interchangeable.

**Content:**
- **Rajalakshmi Engineering College, Chennai** — B.Tech, Artificial Intelligence & Machine Learning — CGPA 8.54/10
- **Zion Matriculation Higher Secondary School** — HSC — 573/600 (95.5%)

### 7.7 Connect (dedicated contact module)
The explicit point of this section: turn a profile viewer into an actual conversation. Two columns — left is direct info + socials (each row clickable: `mailto:`, `tel:`, LinkedIn, GitHub), right is a form (Name, Email, Message) with `react-hook-form` + `zod` validation and a `sonner` toast on submit success/error. A soft blurred gradient blob in Signal/Pulse behind the form ties it back to the palette without repeating the hero's 3D scene.

**Content:**
- Email: `saravana28092004@gmail.com`
- Phone: `+91 76399 24552` *(optional: many portfolios keep the phone number in the downloadable résumé only and show just email + LinkedIn on the live site — worth deciding before this goes public)*
- LinkedIn: https://www.linkedin.com/in/saravanakumar-ks-548861257/
- GitHub: https://github.com/Saravana-2816

### 7.8 Footer
Quick nav links, the same social icons as Connect, "Built with React, Three.js & GSAP," dynamic copyright year.

---

## 8. Three.js Hero Scene

Build with `@react-three/fiber` + `@react-three/drei`, grounded in the AI/systems subject matter rather than decoration for its own sake:

- **Concept:** a sparse constellation of nodes connected by thin animated lines — a quiet nod to neural networks and distributed systems — gently drifting, with subtle cursor-based parallax on desktop.
- Color the nodes/lines from the Signal/Pulse tokens (Section 3), swapping to light-mode values with the theme.
- **Performance:** scale node count down on narrower viewports, pause the render loop via the Page Visibility API when the tab isn't active, dispose geometries/materials on unmount.
- Provide a static-gradient fallback (no canvas) when `prefers-reduced-motion` is set or WebGL isn't available.

---

## 9. GSAP Animation Approach

Tie each animation to what the content actually is, rather than copy-pasting one entrance effect everywhere:

- **Hero (the one big moment):** a single orchestrated GSAP timeline on load — lead-in, name, role, tagline, and CTAs reveal in sequence (SplitText for the name is a nice, now-free option) while the Three.js scene fades/scales in alongside it. This is where the "wow" budget goes.
- **Experience & Education timelines:** the connecting rail draws progressively via `ScrollTrigger` (`scrub: true`) as the visitor scrolls — motion that represents actual progression through time.
- **About stats:** numbers count up once when scrolled into view.
- **Section headings:** a single quiet fade/rise on first entry only — restrained, not the star of the show.
- **Project cards:** one distinctive, considered hover interaction (Section 7.4) rather than a generic tilt+glow on every card.
- **Navbar:** background/blur toggles via `ScrollTrigger.toggleClass` once scrolled past the hero.
- Register plugins once centrally (`gsap.registerPlugin(ScrollTrigger)`); use `useGSAP()` from `@gsap/react` in components for automatic cleanup.
- Respect `prefers-reduced-motion`: keep content transitions (opacity) but drop parallax, scroll-scrubbed motion, and the 3D scene's animation loop.

---

## 10. Folder Structure (suggested)

```
src/
  components/
    layout/       Navbar, Footer, ThemeToggle, ScrollProgress, BackToTop
    sections/     Hero, About, Experience, Projects, Skills, Education, Connect
    three/        Scene, NodeField, useThemeColors
    ui/           shadcn components (generated)
  hooks/          useTheme, useActiveSection, useReducedMotion
  data/           experience.ts, projects.ts, skills.ts, education.ts
  lib/            gsap.ts (plugin registration), utils.ts
  styles/         globals.css (Tailwind + the Section 3 CSS variables)
api/
  contact.ts      Vercel serverless function for the contact form
```

---

## 11. Performance, Accessibility & SEO

- Lighthouse (mobile): 90+ on Performance, Accessibility, Best Practices, and SEO.
- Images optimized (WebP) and lazy-loaded; heavy components (the 3D scene) code-split with `React.lazy` + `Suspense`.
- Semantic HTML, visible keyboard focus states, sufficient color contrast in both themes, alt text on all images.
- Meta tags, Open Graph tags (so the link looks good when shared), favicon, a simple 404 fallback.

---

## 12. Step-by-Step Build Order

1. **Scaffold the project.**
   ```bash
   npx shadcn@latest init
   ```
   Choose the **Vite** template when prompted. (If that flow doesn't fit, fall back to `npm create vite@latest . -- --template react-ts`, then `npx tailwindcss init -p`, then `npx shadcn@latest init`.)

2. **Install the rest of the stack.**
   ```bash
   npm install three @react-three/fiber @react-three/drei
   npm install gsap @gsap/react
   npm install react-hook-form zod @hookform/resolvers
   npm install lucide-react resend
   npx shadcn@latest add button card dialog form input textarea sonner tooltip separator badge switch
   ```

3. Set up the design tokens from Section 3 as CSS variables, wire them into the Tailwind config, and build the theme provider + toggle (Section 5).
4. Build the layout shell — Navbar, Footer, scroll-progress bar, back-to-top button (Section 6).
5. Build the Hero — the Three.js scene (Section 8) and its GSAP entrance timeline (Section 9) first, since the rest of the page is designed around it.
6. Build About, Experience, Projects, Skills, and Education in order, each with its own motion treatment from Section 9.
7. Build Connect — the form with validation, plus `/api/contact.ts` (or the EmailJS fallback).
8. QA pass: every width in Section 4, both themes, reduced motion, keyboard navigation, Lighthouse.
9. Deploy (Section 13).

---

## 13. Deploying to Vercel

1. Push the project to a GitHub repository.
2. Import it at vercel.com/new — Vercel auto-detects Vite and sets the build command and output directory (`dist`) automatically; no `vercel.json` needed for a standard Vite SPA.
3. If using the serverless contact route, add its environment variable (e.g. `RESEND_API_KEY`) under the Vercel project's Environment Variables before deploying.
4. Attach a custom domain later from the project settings, if wanted.

---

## 14. Definition of Done

- [ ] `npm run dev` runs cleanly with zero TypeScript errors
- [ ] All 8 sections built with the exact content from this document
- [ ] Light/dark toggle works everywhere, including the Three.js scene, with no flash of the wrong theme on load
- [ ] Verified responsive at 375, 768, 1024, 1440, and 2560px+ widths
- [ ] Hero scene runs smoothly on a mid-range phone and respects `prefers-reduced-motion`
- [ ] ScrollTrigger reveals fire once, cleanly, and simplify under reduced motion
- [ ] Contact form validates input, shows a success/error toast, and an email actually arrives on submit
- [ ] Lighthouse (mobile): 90+ across Performance, Accessibility, Best Practices, SEO
- [ ] Deployed on Vercel with a working public URL

## 15. Stretch Goals (optional — skip if short on time)

- A Cmd+K command palette to jump between sections — a nice fit for a systems-minded engineer's site
- Downloadable résumé PDF wired to a "Resume" nav button
- Project detail/case-study pages once repo or live links exist
- A short notes/writing section for RAG and agentic-AI write-ups