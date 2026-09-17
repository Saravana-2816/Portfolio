import * as React from "react"
import { ArrowUpRight } from "lucide-react"
import { useGSAP } from "@gsap/react"
import { gsap } from "@/lib/gsap"
import { cn } from "@/lib/utils"
import { isFinePointer, prefersReducedMotion } from "@/lib/env"
import { onApproach } from "@/lib/motion"
import type { Project } from "@/data/projects"
import { ProjectDiagram } from "@/components/sections/projects/ProjectDiagram"

const ACCENTS: Record<Project["diagram"], string> = {
  attendance: "var(--glow)",
  rag: "var(--pulse)",
  tryon: "var(--pulse)",
  drive: "var(--signal)",
}

type ProjectCardProps = {
  project: Project
  layout: "wide" | "wide-reverse" | "tall"
}

export function ProjectCard({ project, layout }: ProjectCardProps) {
  const cardRef = React.useRef<HTMLElement>(null)
  const figureRef = React.useRef<HTMLDivElement>(null)

  // Diagrams draw themselves in, strokes first, then the nodes and labels.
  useGSAP(
    () => {
      const card = cardRef.current
      const figure = figureRef.current
      if (!card || !figure) return
      if (prefersReducedMotion()) return

      // Measuring every path for the draw-in is layout work: only do it when the card is near.
      onApproach(card, () => {
        const strokes = figure.querySelectorAll("[data-draw]")
        const pops = figure.querySelectorAll("[data-pop]")
        const copy = card.querySelectorAll("[data-copy]")

        const tl = gsap.timeline({ scrollTrigger: { trigger: card, start: "top 80%", once: true } })
        tl.from(card, { opacity: 0, y: 60, duration: 1.2 })
          .from(strokes, { drawSVG: "0%", duration: 1.6, stagger: 0.03, ease: "swing" }, 0.2)
          .from(pops, { opacity: 0, duration: 0.8, stagger: 0.02, ease: "none" }, 0.9)
          .from(copy, { opacity: 0, y: 18, duration: 1, stagger: 0.07 }, 0.25)
      })
    },
    { scope: cardRef }
  )

  // A soft wash in the project's own color follows the pointer.
  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!isFinePointer()) return
    const card = cardRef.current
    if (!card) return
    const r = card.getBoundingClientRect()
    card.style.setProperty("--mx", `${e.clientX - r.left}px`)
    card.style.setProperty("--my", `${e.clientY - r.top}px`)
  }

  const wide = layout !== "tall"
  const [main, suffix] = project.title.split(" — ")

  return (
    <article
      ref={cardRef}
      onPointerMove={onPointerMove}
      style={{ "--card-accent": ACCENTS[project.diagram] } as React.CSSProperties}
      className={cn(
        "group relative isolate overflow-hidden rounded-[1.75rem] border border-line bg-panel/80 transition-[border-color] duration-700 hover:border-line-strong",
        wide ? "md:col-span-2" : ""
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(520px circle at var(--mx, 50%) var(--my, 50%), color-mix(in srgb, var(--card-accent) 13%, transparent), transparent 65%)",
        }}
      />

      <div
        className={cn("grid h-full grid-rows-[auto_1fr]", wide && "lg:grid-cols-2 lg:grid-rows-1")}
      >
        {/* Diagram first on small screens; wide cards alternate sides from lg up */}
        <div
          className={cn(
            "order-2 flex flex-col p-6 sm:p-9 lg:p-12",
            layout === "wide" && "lg:order-1",
            layout === "wide-reverse" && "lg:order-2"
          )}
        >
          {project.qualifier && (
            <p data-copy className="mb-5 flex items-center gap-2.5 text-sm text-muted-foreground">
              {project.production && (
                <span className="relative flex size-1.5">
                  <span className="live-ping absolute inset-0 rounded-full bg-ember" />
                  <span className="relative size-1.5 rounded-full bg-ember" />
                </span>
              )}
              {project.qualifier}
            </p>
          )}

          <h3
            data-copy
            className={cn(
              "font-display font-semibold tracking-[-0.035em] text-balance",
              // Line height must follow the size: the class merger drops it otherwise.
              wide ? "text-[clamp(1.75rem,3.2vw,2.75rem)] leading-[1.04]" : "text-[clamp(1.6rem,2.5vw,2.15rem)] leading-[1.06]"
            )}
          >
            {main}
            {suffix && <span className="block text-muted-foreground">— {suffix}</span>}
          </h3>

          <p data-copy className="mt-5 max-w-[58ch] text-base leading-relaxed text-muted-foreground sm:text-[17px]">
            {project.description}
          </p>

          <div data-copy className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-8">
            <ul aria-label="Tags" className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-line px-3 py-1 font-mono text-xs text-muted-foreground transition-colors duration-500 group-hover:border-line-strong group-hover:text-foreground"
                >
                  {tag}
                </li>
              ))}
            </ul>
            {project.href && (
              <a
                href={project.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-line-strong px-4 py-2 text-sm transition-colors hover:border-foreground"
              >
                Open project
                <ArrowUpRight className="size-4" />
              </a>
            )}
          </div>
        </div>

        <div
          ref={figureRef}
          className={cn(
            "relative order-1 flex items-center justify-center border-b border-line px-6 py-8 sm:px-10",
            layout === "wide" && "lg:order-2 lg:border-b-0 lg:border-l",
            layout === "wide-reverse" && "lg:order-1 lg:border-r lg:border-b-0"
          )}
        >
          <div aria-hidden className="hairline-grid mask-fade-b pointer-events-none absolute inset-0 opacity-50" />
          <div className="relative w-full max-w-[520px] transition-transform duration-1000 ease-(--ease-out-expo) group-hover:scale-[1.02]">
            <ProjectDiagram kind={project.diagram} />
          </div>
        </div>
      </div>
    </article>
  )
}
