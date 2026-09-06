import * as React from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "@/lib/gsap"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import { education } from "@/data/education"
import { Section } from "@/components/layout/Section"
import { SectionHeading } from "@/components/layout/SectionHeading"

export function Education() {
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
            start: "top 80%",
            end: "bottom 70%",
            scrub: true,
          },
        }
      )
    },
    { scope: containerRef, dependencies: [reducedMotion] }
  )

  return (
    <Section id="education">
      <SectionHeading index={5} title="Education" />

      <div ref={containerRef} className="relative mt-10 pl-8 sm:pl-10">
        <div className="absolute top-1 left-[3px] h-full w-px border-l border-dashed border-border sm:left-[7px]" />
        <div
          ref={railRef}
          className="absolute top-1 left-[3px] h-full w-px origin-top border-l border-dashed border-muted-foreground sm:left-[7px]"
        />

        <div className="flex flex-col gap-8">
          {education.map((item) => (
            <div key={item.school} className="relative">
              <span className="absolute top-1.5 -left-8 size-2 rounded-full border-2 border-muted-foreground bg-background sm:-left-10" />
              <h3 className="font-heading text-base font-semibold sm:text-lg">
                {item.school}
                {item.location && (
                  <span className="text-muted-foreground"> — {item.location}</span>
                )}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                {item.credential} · {item.score}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}
