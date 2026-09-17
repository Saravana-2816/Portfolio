import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/hooks/useTheme"
import { gsap } from "@/lib/gsap"
import { prefersReducedMotion } from "@/lib/env"

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const iconRef = React.useRef<HTMLSpanElement>(null)
  const buttonRef = React.useRef<HTMLButtonElement>(null)

  const onClick = () => {
    const rect = buttonRef.current?.getBoundingClientRect()
    toggleTheme(rect ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } : undefined)
    if (!prefersReducedMotion() && iconRef.current) {
      gsap.fromTo(
        iconRef.current,
        { rotate: -120, scale: 0.4, opacity: 0 },
        { rotate: 0, scale: 1, opacity: 1, duration: 0.8, ease: "back.out(2.2)" }
      )
    }
  }

  const dark = theme === "dark"

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="grid size-10 place-items-center rounded-full border border-line text-foreground transition-colors duration-300 hover:border-signal"
    >
      <span ref={iconRef} className="inline-flex">
        {dark ? <Sun className="size-[17px]" /> : <Moon className="size-[17px]" />}
      </span>
    </button>
  )
}
