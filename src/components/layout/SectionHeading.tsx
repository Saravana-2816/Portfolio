import * as React from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "@/lib/gsap"
import { prefersReducedMotion } from "@/lib/env"
import { cn } from "@/lib/utils"

type SectionHeadingProps = {
  title: string
  intro?: React.ReactNode
  aside?: React.ReactNode
  className?: string
  id?: string
}

/**
 * One quiet rise on first entry. Headings are never the loud part, so the title
 * moves as a single block behind a mask: no text splitting, no extra layout work.
 */
export function SectionHeading({ title, intro, aside, className, id }: SectionHeadingProps) {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const titleRef = React.useRef<HTMLSpanElement>(null)
  const introRef = React.useRef<HTMLParagraphElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion() || !titleRef.current) return
      const tl = gsap.timeline({ scrollTrigger: { trigger: rootRef.current, start: "top 85%", once: true } })
      tl.from(titleRef.current, { yPercent: 105, duration: 1.2 })
      if (introRef.current) tl.from(introRef.current, { opacity: 0, y: 16, duration: 1.1 }, 0.15)
    },
    { scope: rootRef }
  )

  return (
    <div ref={rootRef} className={cn("flex flex-col gap-8 md:flex-row md:items-end md:justify-between", className)}>
      <div>
        <h2
          id={id}
          className="split-mask overflow-hidden font-display text-[clamp(2.75rem,7.2vw,6.25rem)] leading-[0.92] font-semibold tracking-[-0.045em]"
        >
          <span ref={titleRef} className="block">
            {title}
          </span>
        </h2>
        {intro && (
          <p ref={introRef} className="mt-5 max-w-[52ch] text-base text-muted-foreground sm:text-lg">
            {intro}
          </p>
        )}
      </div>
      {aside}
    </div>
  )
}
