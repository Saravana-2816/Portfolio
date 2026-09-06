import * as React from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "@/lib/gsap"
import { useReducedMotion } from "@/hooks/useReducedMotion"

type SectionHeadingProps = {
  title: string
  description?: string
  align?: "left" | "center"
}

export function SectionHeading({ title, description, align = "left" }: SectionHeadingProps) {
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
      <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
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
