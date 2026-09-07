import * as React from "react"
import { useGSAP } from "@gsap/react"
import { gsap, SplitText } from "@/lib/gsap"
import { useReducedMotion } from "@/hooks/useReducedMotion"

export function useMaskedReveal<T extends HTMLElement>() {
  const ref = React.useRef<T>(null)
  const reducedMotion = useReducedMotion()

  useGSAP(
    () => {
      if (!ref.current) return

      if (reducedMotion) {
        gsap.set(ref.current, { opacity: 1 })
        return
      }

      const split = SplitText.create(ref.current, { type: "chars", mask: "chars" })
      gsap.set(ref.current, { opacity: 1 })
      gsap.from(split.chars, {
        opacity: 0,
        yPercent: 100,
        rotationX: -80,
        transformPerspective: 400,
        stagger: { amount: Math.min(split.chars.length * 0.012, 1.1), from: "start" },
        duration: 0.55,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 82%",
          once: true,
        },
      })
    },
    { scope: ref, dependencies: [reducedMotion] }
  )

  return ref
}
