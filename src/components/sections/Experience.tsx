import * as React from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "@/lib/gsap"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import { experience } from "@/data/experience"
import { Section } from "@/components/layout/Section"
import { SectionHeading } from "@/components/layout/SectionHeading"
import { Badge } from "@/components/ui/badge"

export function Experience() {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const railRef = React.useRef<HTMLDivElement>(null)
  const nodeRefs = React.useRef<(HTMLSpanElement | null)[]>([])
  const entryRefs = React.useRef<(HTMLDivElement | null)[]>([])
  const reducedMotion = useReducedMotion()

  useGSAP(
    () => {
      if (!railRef.current || !containerRef.current) return

      const nodes = nodeRefs.current.filter(Boolean)
      const entries = entryRefs.current.filter(Boolean)

      if (reducedMotion) {
        gsap.set(railRef.current, { scaleY: 1 })
        gsap.set([...nodes, ...entries], { opacity: 1, scale: 1, x: 0 })
        return
      }

      const tl = gsap.timeline({
        scrollTrigger: { trigger: containerRef.current, start: "top 75%", once: true },
      })
      tl.from(railRef.current, { scaleY: 0, transformOrigin: "top", duration: 1.1, ease: "power2.out" })
        .from(nodes, { scale: 0, duration: 0.3, stagger: 0.18, ease: "back.out(2.5)" }, "-=0.65")
        .from(
          entries,
          { opacity: 0, x: -18, duration: 0.45, stagger: 0.18, ease: "power2.out", clearProps: "transform" },
          "<0.05"
        )
    },
    { scope: containerRef, dependencies: [reducedMotion] }
  )

  return (
    <Section id="experience">
      <SectionHeading
        index={2}
        title="Experience"
        description="Most recent first — building across the stack, with a growing DevOps footprint."
      />

      <div ref={containerRef} className="relative mt-10 pl-8 sm:pl-10">
        <div className="absolute top-1 left-[3px] h-full w-px bg-border sm:left-[7px]" />
        <div
          ref={railRef}
          className="absolute top-1 left-[3px] h-full w-px origin-top bg-foreground sm:left-[7px]"
        />

        <div className="flex flex-col gap-10">
          {experience.map((item, i) => (
            <div
              key={item.company}
              ref={(el) => {
                entryRefs.current[i] = el
              }}
              className="relative"
            >
              <span
                ref={(el) => {
                  nodeRefs.current[i] = el
                }}
                className="absolute top-1.5 -left-8 size-2.5 bg-foreground ring-4 ring-background sm:-left-10"
              />
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="font-heading text-lg font-semibold">
                  {item.role} · {item.company}
                  {item.location && (
                    <span className="text-muted-foreground"> — {item.location}</span>
                  )}
                </h3>
                <span className="text-sm text-muted-foreground">{item.period}</span>
              </div>
              <ul className="mt-3 space-y-2">
                {item.points.map((point) => (
                  <li key={point} className="max-w-[70ch] text-sm text-muted-foreground sm:text-base">
                    {point}
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">
                {item.tools.map((tool) => (
                  <Badge key={tool} variant="outline" className="font-mono text-xs font-normal">
                    {tool}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}
