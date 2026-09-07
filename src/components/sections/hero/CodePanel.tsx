import * as React from "react"
import { gsap } from "@/lib/gsap"
import { useReducedMotion } from "@/hooks/useReducedMotion"

const trafficLights = [
  { color: "#ff5f57", label: "Close" },
  { color: "#febc2e", label: "Minimize" },
  { color: "#28c840", label: "Maximize" },
]

const fields = [
  { label: "role", value: "Backend / AI Engineer" },
  { label: "focus", value: "Agentic AI + RAG" },
]

const whoami = ["engineer", "builder", "problem_solver"]

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
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            {trafficLights.map((light) => (
              <span
                key={light.label}
                aria-hidden
                className="size-2.5 rounded-full"
                style={{ backgroundColor: light.color }}
              />
            ))}
            <span className="ml-2 font-mono text-[11px] text-muted-foreground">
              saravanakumar.system
            </span>
          </div>
          <span className="flex items-center gap-1.5 font-mono text-[10px] font-medium uppercase tracking-wide text-teal">
            <span className="size-1.5 rounded-full bg-teal motion-safe:animate-pulse" />
            Online
          </span>
        </div>

        <div className="space-y-3 p-5 font-mono text-sm">
          {fields.map((field) => (
            <div key={field.label} className="flex items-baseline justify-between gap-4">
              <span className="text-muted-foreground">{field.label}</span>
              <span className="text-foreground">{field.value}</span>
            </div>
          ))}

          <div>
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-muted-foreground">growing</span>
              <span className="text-teal">82%</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-border">
              <div className="h-full rounded-full bg-teal" style={{ width: "82%" }} />
            </div>
          </div>

          <div className="rounded-lg border border-border bg-background/40 p-3.5">
            <p className="text-muted-foreground">$ whoami</p>
            {whoami.map((line) => (
              <p key={line} className="mt-1 text-foreground">
                &gt; {line}
              </p>
            ))}
            <span className="ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 bg-foreground motion-safe:animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}
