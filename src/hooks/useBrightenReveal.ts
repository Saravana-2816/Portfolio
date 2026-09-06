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
        { opacity: 0.35 },
        {
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 82%",
            once: true,
          },
        }
      )
    },
    { scope: ref, dependencies: [reducedMotion] }
  )

  return ref
}
