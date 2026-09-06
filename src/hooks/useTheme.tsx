import * as React from "react"

type Theme = "dark" | "light"

type ThemeContextValue = {
  theme: Theme
  toggleTheme: () => void
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

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<Theme>(getInitialTheme)

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

  const toggleTheme = React.useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"))
  }, [])

  const value = React.useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider")
  return ctx
}
