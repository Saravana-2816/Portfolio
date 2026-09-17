import * as React from "react"
import { flushSync } from "react-dom"

export type Theme = "dark" | "light"

type Origin = { x: number; y: number }

type ThemeContextValue = {
  theme: Theme
  toggleTheme: (origin?: Origin) => void
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null)

const THEME_COLORS: Record<Theme, string> = { dark: "#06070d", light: "#f4f5f9" }

function readInitialTheme(): Theme {
  // index.html already applied the class before first paint; mirror it.
  return document.documentElement.classList.contains("dark") ? "dark" : "light"
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.classList.toggle("dark", theme === "dark")
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLORS[theme])
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<Theme>(readInitialTheme)
  const busy = React.useRef(false)

  React.useEffect(() => {
    applyTheme(theme)
  }, [theme])

  // Follow the OS until the visitor makes an explicit choice.
  React.useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)")
    const onChange = (e: MediaQueryListEvent) => {
      let stored: string | null = null
      try {
        stored = localStorage.getItem("theme")
      } catch {
        /* storage blocked */
      }
      if (stored !== "dark" && stored !== "light") setTheme(e.matches ? "dark" : "light")
    }
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  const toggleTheme = React.useCallback(
    (origin?: Origin) => {
      if (busy.current) return
      const next: Theme = theme === "dark" ? "light" : "dark"
      try {
        localStorage.setItem("theme", next)
      } catch {
        /* storage blocked */
      }

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      if (!document.startViewTransition || reduced) {
        applyTheme(next)
        setTheme(next)
        return
      }

      const x = origin?.x ?? window.innerWidth / 2
      const y = origin?.y ?? 0
      const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))

      busy.current = true
      const transition = document.startViewTransition(() => {
        applyTheme(next)
        flushSync(() => setTheme(next))
      })
      transition.ready
        .then(() => {
          document.documentElement.animate(
            { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
            { duration: 750, easing: "cubic-bezier(0.76, 0, 0.24, 1)", pseudoElement: "::view-transition-new(root)" }
          )
        })
        .catch(() => {})
      transition.finished.finally(() => {
        busy.current = false
      })
    },
    [theme]
  )

  const value = React.useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider")
  return ctx
}
