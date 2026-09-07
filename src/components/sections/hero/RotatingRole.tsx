import * as React from "react"
import { gsap } from "@/lib/gsap"
import { useReducedMotion } from "@/hooks/useReducedMotion"

type Role = { text: string; highlight: string }

function renderRole(role: Role) {
  const idx = role.text.indexOf(role.highlight)
  if (idx === -1) return role.text
  return (
    <>
      {role.text.slice(0, idx)}
      <span className="text-teal">{role.highlight}</span>
      {role.text.slice(idx + role.highlight.length)}
    </>
  )
}

export function RotatingRole({ roles }: { roles: readonly Role[] }) {
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
      { opacity: 1, y: 0, duration: 0.45, ease: "power2.out", clearProps: "transform" }
    )
  }, [index, reducedMotion])

  return (
    <span ref={textRef} className="text-muted-foreground">
      {renderRole(roles[index])}
    </span>
  )
}
