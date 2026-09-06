import * as React from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "@/lib/gsap"
import { useReducedMotion } from "@/hooks/useReducedMotion"

export function useBrightenReveal<T extends HTMLElement>() {
  const ref = React.useRef<T>(null)
  const reducedMotion = useReducedMotion()

  useGSAP(
    () => {
      if (reducedMotion || !ref.current) return
      gsap.fromTo(
        ref.current,
        { opacity: 0.3 },
        {
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 95%",
            end: "top 55%",
            scrub: 0.3,
          },
        }
      )
    },
    { scope: ref, dependencies: [reducedMotion] }
  )

  return ref
}
