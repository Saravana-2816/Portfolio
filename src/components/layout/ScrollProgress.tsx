import * as React from "react"
import { useGSAP } from "@gsap/react"
import { gsap, ScrollTrigger } from "@/lib/gsap"

export function ScrollProgress() {
  const barRef = React.useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!barRef.current) return
    gsap.set(barRef.current, { scaleX: 0 })

    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        gsap.set(barRef.current, { scaleX: self.progress })
      },
    })

    return () => trigger.kill()
  }, [])

  return (
    <div className="absolute inset-x-0 bottom-0 h-0.5 overflow-hidden bg-transparent">
      <div
        ref={barRef}
        className="h-full origin-left bg-linear-to-r from-teal to-gold"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  )
}
