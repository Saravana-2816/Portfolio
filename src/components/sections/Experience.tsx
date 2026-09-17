import * as React from "react"
import { useGSAP } from "@gsap/react"
import { gsap, ScrollTrigger } from "@/lib/gsap"
import { prefersReducedMotion } from "@/lib/env"
import { onApproach } from "@/lib/motion"
import { experience } from "@/data/experience"
import { Section } from "@/components/layout/Section"
import { SectionHeading } from "@/components/layout/SectionHeading"

export function Experience() {
  const listRef = React.useRef<HTMLOListElement>(null)
  const fillRef = React.useRef<HTMLSpanElement>(null)
  const headRef = React.useRef<HTMLSpanElement>(null)

  // A signal travels down the rail as you scroll; each role lights when it arrives.
  useGSAP(
    () => {
      const list = listRef.current
      const fill = fillRef.current
      const head = headRef.current
      if (!list || !fill || !head) return
      const items = gsap.utils.toArray<HTMLElement>("[data-role]", list)

      if (prefersReducedMotion()) {
        gsap.set(fill, { scaleY: 1 })
        gsap.set(head, { opacity: 0 })
        items.forEach((item) => item.classList.add("is-lit"))
        return
      }

      ScrollTrigger.create({
        trigger: list,
        start: "top 65%",
        end: "bottom 65%",
        onUpdate: (self) => {
          gsap.set(fill, { scaleY: self.progress })
          gsap.set(head, { y: self.progress * list.offsetHeight, opacity: self.progress > 0 && self.progress < 1 ? 1 : 0 })
        },
      })

      items.forEach((item) => {
        ScrollTrigger.create({
          trigger: item,
          start: "top 65%",
          onEnter: () => item.classList.add("is-lit"),
          onLeaveBack: () => item.classList.remove("is-lit"),
        })
        onApproach(item, () => {
          gsap.from(item.querySelectorAll("[data-chip]"), {
            opacity: 0,
            y: 10,
            duration: 0.7,
            stagger: 0.025,
            scrollTrigger: { trigger: item, start: "top 60%", once: true },
          })
        })
      })
    },
    { scope: listRef }
  )

  return (
    <Section id="experience">
      <SectionHeading id="experience-title" title="Experience" intro="Most recent first." />

      <ol ref={listRef} className="relative mt-16 sm:mt-24">
        {/* Rail: base line, scroll-driven fill, and the travelling signal head */}
        <span aria-hidden className="absolute top-2 bottom-0 left-[7px] w-px bg-line md:left-[259px]" />
        <span
          ref={fillRef}
          aria-hidden
          className="absolute top-2 bottom-0 left-[7px] w-px origin-top scale-y-0 bg-linear-to-b from-signal to-glow md:left-[259px]"
        />
        <span
          ref={headRef}
          aria-hidden
          className="absolute top-2 left-[4px] size-[7px] rounded-full bg-glow opacity-0 shadow-[0_0_16px_4px_var(--glow)] md:left-[256px]"
        />

        {experience.map((job) => (
          <li
            key={job.company}
            data-role
            className="group/role relative grid gap-4 pb-20 pl-10 last:pb-2 md:grid-cols-[228px_1fr] md:gap-16 md:pl-0"
          >
            {/* Node on the rail */}
            <span
              aria-hidden
              className="absolute top-2 left-0 grid size-[15px] place-items-center rounded-full border border-line-strong bg-background transition-[border-color,box-shadow] duration-700 group-[.is-lit]/role:border-signal group-[.is-lit]/role:shadow-[0_0_0_6px_color-mix(in_srgb,var(--signal)_14%,transparent)] md:left-[252px]"
            >
              <span className="size-[5px] scale-0 rounded-full bg-signal transition-transform duration-700 ease-(--ease-out-expo) group-[.is-lit]/role:scale-100" />
            </span>

            <div className="flex flex-col gap-1.5 md:pt-1 md:text-right">
              <p className="font-mono text-[13px] tracking-tight text-foreground">{job.period}</p>
              {job.note && <p className="text-sm text-muted-foreground">{job.note}</p>}
              {job.current && (
                <p className="mt-1 inline-flex items-center gap-2 self-start text-sm text-ember md:self-end">
                  <span className="relative flex size-1.5">
                    <span className="live-ping absolute inset-0 rounded-full bg-ember" />
                    <span className="relative size-1.5 rounded-full bg-ember" />
                  </span>
                  Current role
                </p>
              )}
            </div>

            <div className="md:pl-10">
              {/* Only the large title dims before the signal arrives: it stays above 3:1 while dim */}
              <h3 className="font-display text-[clamp(1.75rem,3.4vw,2.9rem)] leading-[1.02] font-semibold tracking-[-0.035em] opacity-60 transition-opacity duration-700 group-[.is-lit]/role:opacity-100">
                {job.role}
              </h3>
              <p className="mt-2 text-lg text-muted-foreground">
                <span className="font-medium text-foreground">{job.company}</span>
                {job.location && <>, {job.location}</>}
              </p>

              <ul className="mt-6 flex max-w-[64ch] flex-col gap-3">
                {job.points.map((point) => (
                  <li key={point} className="relative pl-5 text-base leading-relaxed text-muted-foreground sm:text-[17px]">
                    <span aria-hidden className="absolute top-[0.7em] left-0 h-px w-2.5 bg-line-strong" />
                    {point}
                  </li>
                ))}
              </ul>

              <ul aria-label="Tools" className="mt-7 flex flex-wrap gap-2">
                {job.tools.map((tool) => (
                  <li
                    key={tool}
                    data-chip
                    className="rounded-full border border-line px-3 py-1 font-mono text-xs text-muted-foreground"
                  >
                    {tool}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  )
}
