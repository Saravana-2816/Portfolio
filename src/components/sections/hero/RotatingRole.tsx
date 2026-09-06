import * as React from "react"
import { gsap } from "@/lib/gsap"
import { useReducedMotion } from "@/hooks/useReducedMotion"

export function RotatingRole({ roles }: { roles: readonly string[] }) {
  const [index, setIndex] = React.useState(0)
  const textRef = React.useRef<HTMLSpanElement>(null)
  const reducedMotion = useReducedMotion()

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % roles.length)
    }, 2600)
    return () => clearInterval(interval)
  }, [roles.length])

  React.useEffect(() => {
    if (!textRef.current) return
    if (reducedMotion) return
    gsap.fromTo(
      textRef.current,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
    )
  }, [index, reducedMotion])

  return (
    <span ref={textRef} className="text-muted-foreground">
      {roles[index]}
    </span>
  )
}
