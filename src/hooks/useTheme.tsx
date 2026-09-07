import * as React from "react"
import { gsap } from "@/lib/gsap"

type Theme = "dark" | "light"

type Origin = { x: number; y: number }

type ThemeContextValue = {
  theme: Theme
  toggleTheme: (origin?: Origin) => void
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null)

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light"
  const stored = window.localStorage.getItem("theme")
  if (stored === "dark" || stored === "light") return stored
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<Theme>(getInitialTheme)
  const overlayRef = React.useRef<HTMLDivElement>(null)
  const animatingRef = React.useRef(false)

  React.useEffect(() => {
    const root = document.documentElement
    root.classList.toggle("dark", theme === "dark")
    window.localStorage.setItem("theme", theme)
  }, [theme])

  React.useEffect(() => {
    const stored = window.localStorage.getItem("theme")
    if (stored === "dark" || stored === "light") return

    const mql = window.matchMedia("(prefers-color-scheme: dark)")
    const onChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? "dark" : "light")
    }
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  const toggleTheme = React.useCallback(
    (origin?: Origin) => {
      const next: Theme = theme === "dark" ? "light" : "dark"
      const overlay = overlayRef.current

      if (!overlay || animatingRef.current || prefersReducedMotion()) {
        setTheme(next)
        return
      }

      const x = origin?.x ?? window.innerWidth / 2
      const y = origin?.y ?? window.innerHeight / 2
      const bgVar = next === "dark" ? "var(--eclipse-bg-dark)" : "var(--eclipse-bg-light)"
      const glowVar = next === "dark" ? "var(--eclipse-glow-dark)" : "var(--eclipse-glow-light)"

      animatingRef.current = true
      overlay.style.background = `radial-gradient(circle at ${x}px ${y}px, ${glowVar} 0%, ${bgVar} 65%)`

      gsap
        .timeline({ onComplete: () => (animatingRef.current = false) })
        .set(overlay, { clipPath: `circle(0% at ${x}px ${y}px)`, opacity: 1 })
        .to(overlay, {
          clipPath: `circle(145% at ${x}px ${y}px)`,
          duration: 0.26,
          ease: "power2.in",
        })
        .call(() => setTheme(next))
        .to(overlay, { opacity: 0, duration: 0.16, ease: "power1.out" })
    },
    [theme]
  )

  const value = React.useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])

  return (
    <ThemeContext.Provider value={value}>
      {children}
      <div
        ref={overlayRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[999] opacity-0"
        style={{ clipPath: "circle(0% at 50% 50%)" }}
      />
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider")
  return ctx
}
