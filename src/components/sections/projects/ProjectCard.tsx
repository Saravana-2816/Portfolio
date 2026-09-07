import * as React from "react"
import { ExternalLink } from "lucide-react"
import { cn } from "cn"
import { useGSAP } from "@gsap/react"
import { gsap } from "@/lib/gsap"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import type { Project } from "@/data/projects"
import { Badge } from "@/components/ui/badge"

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cardRef = React.useRef<HTMLElement>(null)
  const numberRef = React.useRef<HTMLParagraphElement>(null)
  const descRef = React.useRef<HTMLParagraphElement>(null)
  const tagsRef = React.useRef<HTMLDivElement>(null)
  const lineRef = React.useRef<HTMLSpanElement>(null)
  const gridRef = React.useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const accentColor = index % 2 === 0 ? "text-teal" : "text-gold"

  useGSAP(
    () => {
      const card = cardRef.current
      if (!card) return

      if (reducedMotion) {
        gsap.set([card, numberRef.current, descRef.current, tagsRef.current, gridRef.current], {
          clearProps: "all",
          opacity: 1,
        })
        gsap.set(gridRef.current, { opacity: 0.5 })
        return
      }

      const tl = gsap.timeline({
        scrollTrigger: { trigger: card, start: "top 78%", once: true },
      })
      tl.from(card, {
        clipPath: "inset(0 100% 0 0)",
        y: 24,
        duration: 0.75,
        ease: "power3.out",
        clearProps: "clipPath",
      })
        .from(numberRef.current, { x: -16, opacity: 0, duration: 0.4, ease: "power2.out" }, 0.1)
        .to(gridRef.current, { opacity: 0.5, duration: 0.6, ease: "power1.out" }, 0.1)
        .from(
          [descRef.current, tagsRef.current],
          { y: 14, opacity: 0, duration: 0.45, stagger: 0.05, ease: "power2.out" },
          0.25
        )

      const mm = gsap.matchMedia()
      mm.add("(hover: hover) and (pointer: fine)", () => {
        const onEnter = () => {
          gsap.to(card, {
            y: -6,
            borderColor: "var(--foreground)",
            boxShadow: "var(--panel-shadow-hover)",
            duration: 0.35,
            ease: "power2.out",
          })
          gsap.to(lineRef.current, { scaleX: 1, duration: 0.35, ease: "power2.out" })
        }
        const onLeave = () => {
          gsap.to(card, {
            y: 0,
            borderColor: "var(--border)",
            boxShadow: "var(--panel-shadow)",
            duration: 0.35,
            ease: "power2.out",
          })
          gsap.to(lineRef.current, { scaleX: 0, duration: 0.3, ease: "power2.in" })
        }
        card.addEventListener("mouseenter", onEnter)
        card.addEventListener("mouseleave", onLeave)
        return () => {
          card.removeEventListener("mouseenter", onEnter)
          card.removeEventListener("mouseleave", onLeave)
        }
      })

      return () => mm.revert()
    },
    { scope: cardRef, dependencies: [reducedMotion] }
  )

  return (
    <article
      ref={cardRef}
      tabIndex={0}
      className="glass-panel group relative flex min-h-[220px] flex-col overflow-hidden rounded-xl p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div
        ref={gridRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0"
        style={{
          backgroundImage: "radial-gradient(circle, var(--line) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
          maskImage: "linear-gradient(to bottom, black, transparent 85%)",
        }}
      />
      <span
        ref={lineRef}
        aria-hidden
        className={cn("absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0", accentColor)}
        style={{ backgroundColor: "currentColor" }}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p ref={numberRef} className={cn("font-mono text-xs font-medium", accentColor)}>
            {String(index + 1).padStart(2, "0")}
          </p>
          <h3 className="mt-1 font-heading text-lg leading-snug font-bold transition-transform duration-300 group-hover:-translate-y-1 group-focus-within:-translate-y-1">
            {project.title}
          </h3>
        </div>
        {project.href && (
          <a
            href={project.href}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${project.title}`}
            className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ExternalLink className="size-4" />
          </a>
        )}
      </div>

      {project.status && (
        <p className="relative mt-1 text-xs text-muted-foreground">{project.status}</p>
      )}

      <p
        ref={descRef}
        className="relative mt-4 max-w-[60ch] flex-1 text-sm text-muted-foreground sm:text-base"
      >
        {project.description}
      </p>

      <div ref={tagsRef} className="relative mt-4 flex flex-wrap gap-2">
        {project.tags.map((tag, i) => (
          <Badge
            key={tag}
            variant="outline"
            style={{ transitionDelay: `${i * 30}ms` }}
            className="font-mono text-xs font-normal text-muted-foreground transition-colors duration-200 group-hover:text-foreground"
          >
            {tag}
          </Badge>
        ))}
      </div>
    </article>
  )
}
