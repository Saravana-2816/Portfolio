import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/hooks/useTheme"
import { Button } from "@/components/ui/button"
import { gsap } from "@/lib/gsap"
import { useReducedMotion } from "@/hooks/useReducedMotion"

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const iconRef = React.useRef<HTMLSpanElement>(null)
  const reducedMotion = useReducedMotion()

  const handleClick = () => {
    if (!reducedMotion && iconRef.current) {
      gsap.fromTo(
        iconRef.current,
        { rotate: -90, opacity: 0, scale: 0.6 },
        { rotate: 0, opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)" }
      )
    }
    toggleTheme()
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      onClick={handleClick}
    >
      <span ref={iconRef} className="inline-flex">
        {theme === "dark" ? <Sun className="size-[1.1rem]" /> : <Moon className="size-[1.1rem]" />}
      </span>
    </Button>
  )
}
