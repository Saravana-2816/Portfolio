import * as React from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "@/lib/gsap"
import { prefersReducedMotion } from "@/lib/env"
import { onApproach } from "@/lib/motion"
import { education } from "@/data/education"
import { Section } from "@/components/layout/Section"
import { SectionHeading } from "@/components/layout/SectionHeading"

/** Same timeline family as Experience, drawn lighter: a dashed rail and hollow nodes. */
export function Education() {
  const listRef = React.useRef<HTMLOListElement>(null)
  const railRef = React.useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const list = listRef.current
      const rail = railRef.current
      if (!list || !rail) return
      if (prefersReducedMotion()) return

      // Clip rather than scale, so the dashes never stretch.
      gsap.fromTo(
        rail,
        { clipPath: "inset(0% 0% 100% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "none",
          scrollTrigger: { trigger: list, start: "top 75%", end: "bottom 60%", scrub: 0.4 },
        }
      )
      gsap.utils.toArray<HTMLElement>("[data-school]", list).forEach((item) => {
        onApproach(item, () => {
          gsap.from(item.querySelectorAll("[data-rise]"), {
            opacity: 0,
            y: 24,
            duration: 1.1,
            stagger: 0.08,
            scrollTrigger: { trigger: item, start: "top 80%", once: true },
          })
        })
      })
    },
    { scope: listRef }
  )

  return (
    <Section id="education">
      <SectionHeading id="education-title" title="Education" />

      <ol ref={listRef} className="relative mt-14 sm:mt-20">
        <span
          aria-hidden
          className="absolute top-4 bottom-4 left-[6px] w-px"
          style={{ backgroundImage: "repeating-linear-gradient(to bottom, var(--line) 0 3px, transparent 3px 9px)" }}
        />
        <span
          ref={railRef}
          aria-hidden
          className="absolute top-4 bottom-4 left-[6px] w-px"
          style={{ backgroundImage: "repeating-linear-gradient(to bottom, var(--muted-text) 0 3px, transparent 3px 9px)" }}
        />

        {education.map((item) => (
          <li
            key={item.school}
            data-school
            className="group relative grid gap-6 border-b border-dashed border-line py-10 pl-10 first:pt-2 last:border-b-0 sm:pl-14 md:grid-cols-[1fr_auto] md:items-end md:gap-12"
          >
            <span
              aria-hidden
              className="absolute top-[3.1rem] left-0 size-[13px] rounded-full border border-muted-foreground bg-background group-first:top-3.5"
            />
            <div>
              <h3
                data-rise
                className="font-display text-[clamp(1.5rem,2.8vw,2.4rem)] leading-[1.05] font-semibold tracking-[-0.03em]"
              >
                {item.school}
              </h3>
              <p data-rise className="mt-3 text-base text-muted-foreground sm:text-lg">
                {item.credential}
                {item.location && <>, {item.location}</>}
              </p>
            </div>
            <p data-rise aria-label={item.score} className="flex items-baseline gap-2 md:justify-end">
              <span className="font-display text-[clamp(2.5rem,4.6vw,4rem)] leading-none font-semibold tracking-[-0.04em]">
                {item.figure}
              </span>
              <span className="font-mono text-sm text-muted-foreground">{item.scale}</span>
            </p>
          </li>
        ))}
      </ol>
    </Section>
  )
}
