import * as React from "react"

export function useReducedMotion() {
  const [reduced, setReduced] = React.useState(() =>
    typeof window === "undefined"
      ? false
      : window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )

  React.useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)")
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches)
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return reduced
}
