import * as React from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "@/lib/gsap"
import { useReducedMotion } from "@/hooks/useReducedMotion"

type SectionHeadingProps = {
  index: number
  title: string
  description?: string
  align?: "left" | "center"
}

export function SectionHeading({ index, title, description, align = "left" }: SectionHeadingProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useGSAP(
    () => {
      if (reducedMotion || !ref.current) return
      gsap.from(ref.current, {
        opacity: 0,
        y: 24,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          once: true,
        },
      })
    },
    { scope: ref, dependencies: [reducedMotion] }
  )

  return (
    <div ref={ref} className={align === "center" ? "text-center" : "text-left"}>
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {String(index).padStart(2, "0")}
      </p>
      <h2 className="mt-2 font-heading text-4xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-5xl">
        {title}
      </h2>
      {description && (
        <p
          className={
            "mt-3 max-w-[65ch] text-base text-muted-foreground" +
            (align === "center" ? " mx-auto" : "")
          }
        >
          {description}
        </p>
      )}
    </div>
  )
}
