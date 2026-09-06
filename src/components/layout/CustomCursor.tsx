import * as React from "react"
import { useReducedMotion } from "@/hooks/useReducedMotion"

const INTERACTIVE_SELECTOR = 'a, button, input, textarea, [role="button"], .cursor-hover'

export function CustomCursor() {
  const dotRef = React.useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const [enabled, setEnabled] = React.useState(false)

  React.useEffect(() => {
    if (reducedMotion) {
      setEnabled(false)
      return
    }
    setEnabled(window.matchMedia("(hover: hover) and (pointer: fine)").matches)
  }, [reducedMotion])

  React.useEffect(() => {
    const dot = dotRef.current
    if (!enabled || !dot) return

    document.documentElement.classList.add("custom-cursor")

    function onMove(e: PointerEvent) {
      if (!dot) return
      dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`
    }

    function onOver(e: PointerEvent) {
      if (!dot) return
      if ((e.target as Element)?.closest?.(INTERACTIVE_SELECTOR)) {
        dot.classList.add("cursor-hovering")
      }
    }

    function onOut(e: PointerEvent) {
      if (!dot) return
      if ((e.target as Element)?.closest?.(INTERACTIVE_SELECTOR)) {
        dot.classList.remove("cursor-hovering")
      }
    }

    window.addEventListener("pointermove", onMove)
    document.addEventListener("pointerover", onOver)
    document.addEventListener("pointerout", onOut)
    return () => {
      document.documentElement.classList.remove("custom-cursor")
      window.removeEventListener("pointermove", onMove)
      document.removeEventListener("pointerover", onOver)
      document.removeEventListener("pointerout", onOut)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div
      ref={dotRef}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[100] size-2.5 rounded-full bg-foreground transition-[width,height,background-color,border-width] duration-200 ease-out [&.cursor-hovering]:size-10 [&.cursor-hovering]:border [&.cursor-hovering]:border-foreground [&.cursor-hovering]:bg-transparent"
    />
  )
}
