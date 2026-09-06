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
  const reducedMotion = useReducedMotion()

  useGSAP(
    () => {
      if (!railRef.current || !containerRef.current) return

      if (reducedMotion) {
        gsap.set(railRef.current, { scaleY: 1 })
        return
      }

      gsap.fromTo(
        railRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            end: "bottom 60%",
            scrub: true,
          },
        }
      )
    },
    { scope: containerRef, dependencies: [reducedMotion] }
  )

  return (
    <Section id="experience">
      <SectionHeading
        title="Experience"
        description="Most recent first — building across the stack, with a growing DevOps footprint."
      />

      <div ref={containerRef} className="relative mt-10 pl-8 sm:pl-10">
        <div className="absolute top-1 left-[3px] h-full w-px bg-border sm:left-[7px]" />
        <div
          ref={railRef}
          className="absolute top-1 left-[3px] h-full w-px origin-top bg-gradient-to-b from-signal to-pulse sm:left-[7px]"
        />

        <div className="flex flex-col gap-10">
          {experience.map((item) => (
            <div key={item.company} className="relative">
              <span className="absolute top-1.5 -left-8 size-2.5 rounded-full bg-signal ring-4 ring-background sm:-left-10" />
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
                  <Badge key={tool} variant="secondary" className="font-normal">
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
