import * as React from "react"
import { useGSAP } from "@gsap/react"
import { gsap, ScrollTrigger } from "@/lib/gsap"

export function ScrollProgress() {
  const barRef = React.useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const bar = barRef.current
    if (!bar) return
    const setScale = gsap.quickSetter(bar, "scaleX")
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => setScale(self.progress),
    })
  })

  return (
    <div aria-hidden className="absolute inset-x-0 bottom-[-1px] h-px overflow-hidden">
      <div
        ref={barRef}
        className="h-full origin-left bg-linear-to-r from-signal to-glow"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  )
}
