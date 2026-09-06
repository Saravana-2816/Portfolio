import * as React from "react"
import { gsap } from "@/lib/gsap"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import { site } from "@/data/site"

const jsonLines = [
  "{",
  `  "name": "${site.name}",`,
  `  "role": "Full-Stack Developer",`,
  `  "focus": "AI Engineer at heart",`,
  `  "based_in": "Chennai, India",`,
  `  "stack": ["React", "Node.js", "Python", "PostgreSQL"],`,
  `  "currently_building": "RAG pipelines & agentic AI systems",`,
  `  "interests": ["System Design", "Agentic AI", "Open Source", "Distributed Systems"],`,
  `  "status": "open_to_opportunities"`,
  "}",
]

const trafficLights = [
  { color: "#ff5f57", label: "Close" },
  { color: "#febc2e", label: "Minimize" },
  { color: "#28c840", label: "Maximize" },
]

const MAX_TILT = 8

export function CodePanel() {
  const cardRef = React.useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const quickRotateX = React.useRef<ReturnType<typeof gsap.quickTo> | null>(null)
  const quickRotateY = React.useRef<ReturnType<typeof gsap.quickTo> | null>(null)

  React.useEffect(() => {
    const card = cardRef.current
    if (!card || reducedMotion) return
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return

    quickRotateX.current = gsap.quickTo(card, "rotateX", { duration: 0.4, ease: "power2.out" })
    quickRotateY.current = gsap.quickTo(card, "rotateY", { duration: 0.4, ease: "power2.out" })

    function onMove(e: PointerEvent) {
      if (!card) return
      const rect = card.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width - 0.5
      const py = (e.clientY - rect.top) / rect.height - 0.5
      quickRotateY.current?.(px * MAX_TILT * 2)
      quickRotateX.current?.(-py * MAX_TILT * 2)
    }

    function onLeave() {
      quickRotateX.current?.(0)
      quickRotateY.current?.(0)
    }

    card.addEventListener("pointermove", onMove)
    card.addEventListener("pointerleave", onLeave)
    return () => {
      card.removeEventListener("pointermove", onMove)
      card.removeEventListener("pointerleave", onLeave)
    }
  }, [reducedMotion])

  return (
    <div className="hidden lg:block" style={{ perspective: 1000 }}>
      <div
        ref={cardRef}
        className="glass-panel overflow-hidden rounded-xl"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
          {trafficLights.map((light) => (
            <span
              key={light.label}
              aria-hidden
              className="size-2.5 rounded-full"
              style={{ backgroundColor: light.color }}
            />
          ))}
          <span className="ml-2 font-mono text-[11px] text-muted-foreground">about.json</span>
        </div>
        <pre className="overflow-x-auto p-5 font-mono text-[12px] leading-[1.55] text-foreground">
          <code>
            {jsonLines.join("\n")}
            <span className="ml-0.5 inline-block h-3 w-1.5 translate-y-0.5 bg-foreground motion-safe:animate-pulse" />
          </code>
        </pre>
      </div>
    </div>
  )
}
