import * as React from "react"
import { gsap } from "@/lib/gsap"
import { isFinePointer, prefersReducedMotion } from "@/lib/env"

/** Pulls an element a little toward the cursor while hovered. Fine pointers only. */
export function useMagnetic<T extends HTMLElement>(strength = 0.28) {
  const ref = React.useRef<T>(null)

  React.useEffect(() => {
    const el = ref.current
    if (!el || !isFinePointer() || prefersReducedMotion()) return

    const toX = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, 0.45)" })
    const toY = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, 0.45)" })

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      toX((e.clientX - (r.left + r.width / 2)) * strength)
      toY((e.clientY - (r.top + r.height / 2)) * strength)
    }
    const onLeave = () => {
      toX(0)
      toY(0)
    }
    el.addEventListener("pointermove", onMove)
    el.addEventListener("pointerleave", onLeave)
    return () => {
      el.removeEventListener("pointermove", onMove)
      el.removeEventListener("pointerleave", onLeave)
    }
  }, [strength])

  return ref
}
