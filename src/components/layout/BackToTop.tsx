import * as React from "react"
import { ArrowUp } from "lucide-react"
import { useGSAP } from "@gsap/react"
import { gsap, ScrollTrigger } from "@/lib/gsap"
import { scrollToId } from "@/lib/smooth-scroll"

const CIRCUMFERENCE = 2 * Math.PI * 21

/** Appears after the hero; its ring doubles as a reading-progress gauge. */
export function BackToTop() {
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const ringRef = React.useRef<SVGCircleElement>(null)
  const [visible, setVisible] = React.useState(false)

  useGSAP(() => {
    const hero = document.getElementById("hero")
    const ring = ringRef.current
    if (!hero || !ring) return
    ScrollTrigger.create({
      trigger: hero,
      start: "bottom top",
      end: "max",
      onToggle: (self) => setVisible(self.isActive),
    })
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => gsap.set(ring, { strokeDashoffset: CIRCUMFERENCE * (1 - self.progress) }),
    })
  })

  return (
    <button
      ref={buttonRef}
      type="button"
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
      onClick={() => scrollToId("top")}
      className={`group fixed right-4 bottom-4 z-40 grid size-12 place-items-center rounded-full border border-line bg-background/70 text-foreground backdrop-blur-md transition-[opacity,transform,border-color] duration-500 ease-(--ease-out-expo) hover:border-line-strong sm:right-6 sm:bottom-6 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <svg aria-hidden viewBox="0 0 48 48" className="absolute inset-0 size-full -rotate-90">
        <circle
          ref={ringRef}
          cx="24"
          cy="24"
          r="21"
          fill="none"
          stroke="var(--signal)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE}
        />
      </svg>
      <ArrowUp className="size-4 transition-transform duration-500 ease-(--ease-out-expo) group-hover:-translate-y-0.5" />
    </button>
  )
}
