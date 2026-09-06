import * as React from "react"
import { Color } from "three"

const THEME_COLORS = {
  light: { signal: "#0284c7", pulse: "#7c3aed" },
  dark: { signal: "#38bdf8", pulse: "#8b5cf6" },
} as const

export function useThemeColors(theme: "dark" | "light") {
  return React.useMemo(() => {
    const { signal, pulse } = THEME_COLORS[theme]
    return {
      signal: new Color(signal),
      pulse: new Color(pulse),
    }
  }, [theme])
}
