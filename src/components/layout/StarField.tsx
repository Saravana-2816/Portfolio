import * as React from "react"
import { useTheme } from "@/hooks/useTheme"
import { useReducedMotion } from "@/hooks/useReducedMotion"

type Star = {
  x0: number
  y0: number
  radius: number
  baseAlpha: number
  twinkleSpeed: number
  twinklePhase: number
  driftRadiusX: number
  driftRadiusY: number
  driftSpeedX: number
  driftSpeedY: number
  driftPhaseX: number
  driftPhaseY: number
  color: string
  parallax: number
}

const DARK_PALETTE = [
  { color: "255, 255, 255", weight: 0.68 },
  { color: "125, 211, 252", weight: 0.16 },
  { color: "232, 184, 75", weight: 0.16 },
]

const LIGHT_PALETTE = [
  { color: "20, 19, 15", weight: 0.5 },
  { color: "13, 148, 136", weight: 0.28 },
  { color: "161, 98, 7", weight: 0.22 },
]

function pickColor(palette: typeof DARK_PALETTE) {
  const r = Math.random()
  let acc = 0
  for (const entry of palette) {
    acc += entry.weight
    if (r <= acc) return entry.color
  }
  return palette[0].color
}

function makeStars(width: number, height: number, isDark: boolean): Star[] {
  const palette = isDark ? DARK_PALETTE : LIGHT_PALETTE
  const count = isDark
    ? Math.min(220, Math.floor((width * height) / 9000))
    : Math.min(110, Math.floor((width * height) / 14000))

  return Array.from({ length: count }, () => ({
    x0: Math.random() * width,
    y0: Math.random() * height,
    radius: isDark ? 0.6 + Math.random() * 1.5 : 1 + Math.random() * 1.6,
    baseAlpha: isDark ? 0.4 + Math.random() * 0.55 : 0.35 + Math.random() * 0.4,
    twinkleSpeed: 0.5 + Math.random() * 1,
    twinklePhase: Math.random() * Math.PI * 2,
    driftRadiusX: 6 + Math.random() * 14,
    driftRadiusY: 6 + Math.random() * 14,
    driftSpeedX: 0.08 + Math.random() * 0.12,
    driftSpeedY: 0.08 + Math.random() * 0.12,
    driftPhaseX: Math.random() * Math.PI * 2,
    driftPhaseY: Math.random() * Math.PI * 2,
    color: pickColor(palette),
    parallax: 0.03 + Math.random() * 0.08,
  }))
}

export function StarField() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const reducedMotion = useReducedMotion()

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const isDark = theme === "dark"
    let width = window.innerWidth
    let height = window.innerHeight
    let stars = makeStars(width, height, isDark)
    let scrollY = window.scrollY
    let visible = !document.hidden
    let frameId = 0

    function resize() {
      width = window.innerWidth
      height = window.innerHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas!.width = width * dpr
      canvas!.height = height * dpr
      canvas!.style.width = `${width}px`
      canvas!.style.height = `${height}px`
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      stars = makeStars(width, height, isDark)
    }

    function onScroll() {
      scrollY = window.scrollY
    }

    function onVisibility() {
      visible = !document.hidden
    }

    function paint(t: number, animate: boolean) {
      ctx!.clearRect(0, 0, width, height)
      for (const star of stars) {
        const driftX = animate ? Math.sin(t * star.driftSpeedX + star.driftPhaseX) * star.driftRadiusX : 0
        const driftY = animate ? Math.cos(t * star.driftSpeedY + star.driftPhaseY) * star.driftRadiusY : 0
        const x = star.x0 + driftX
        const rawY = star.y0 + driftY - scrollY * star.parallax
        const y = ((rawY % height) + height) % height
        const twinkle = animate ? 0.55 + 0.45 * Math.sin(t * star.twinkleSpeed + star.twinklePhase) : 1
        ctx!.beginPath()
        ctx!.fillStyle = `rgba(${star.color}, ${star.baseAlpha * twinkle})`
        ctx!.arc(x, y, star.radius, 0, Math.PI * 2)
        ctx!.fill()
      }
    }

    function tick(time: number) {
      frameId = requestAnimationFrame(tick)
      if (!visible) return
      paint(time / 1000, true)
    }

    resize()
    window.addEventListener("resize", resize)
    window.addEventListener("scroll", onScroll, { passive: true })
    document.addEventListener("visibilitychange", onVisibility)

    if (reducedMotion) {
      paint(0, false)
    } else {
      frameId = requestAnimationFrame(tick)
    }

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener("resize", resize)
      window.removeEventListener("scroll", onScroll)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [theme, reducedMotion])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-50"
    />
  )
}
