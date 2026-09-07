import * as React from "react"
import { useTheme } from "@/hooks/useTheme"
import { useReducedMotion } from "@/hooks/useReducedMotion"

type Star = {
  x: number
  y: number
  radius: number
  baseAlpha: number
  twinkleSpeed: number
  twinklePhase: number
  color: string
  parallax: number
}

const DARK_PALETTE = [
  { color: "255, 255, 255", weight: 0.68 },
  { color: "125, 211, 252", weight: 0.16 },
  { color: "232, 184, 75", weight: 0.16 },
]

const LIGHT_PALETTE = [
  { color: "20, 19, 15", weight: 0.55 },
  { color: "13, 148, 136", weight: 0.25 },
  { color: "161, 98, 7", weight: 0.2 },
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
  const count = isDark ? Math.min(220, Math.floor((width * height) / 9000)) : Math.min(70, Math.floor((width * height) / 22000))

  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: isDark ? 0.5 + Math.random() * 1.4 : 0.6 + Math.random() * 1.1,
    baseAlpha: isDark ? 0.35 + Math.random() * 0.55 : 0.12 + Math.random() * 0.18,
    twinkleSpeed: 0.4 + Math.random() * 0.8,
    twinklePhase: Math.random() * Math.PI * 2,
    color: pickColor(palette),
    parallax: 0.02 + Math.random() * 0.05,
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
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let stars = makeStars(width, height, isDark)
    let scrollY = window.scrollY
    let visible = !document.hidden
    let frameId = 0

    function resize() {
      width = window.innerWidth
      height = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)
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

    function drawStatic() {
      ctx!.clearRect(0, 0, width, height)
      for (const star of stars) {
        const y = ((star.y - scrollY * star.parallax) % height + height) % height
        ctx!.beginPath()
        ctx!.fillStyle = `rgba(${star.color}, ${star.baseAlpha})`
        ctx!.arc(star.x, y, star.radius, 0, Math.PI * 2)
        ctx!.fill()
      }
    }

    function tick(time: number) {
      frameId = requestAnimationFrame(tick)
      if (!visible) return

      ctx!.clearRect(0, 0, width, height)
      const t = time / 1000
      for (const star of stars) {
        const y = ((star.y - scrollY * star.parallax) % height + height) % height
        const twinkle = 0.65 + 0.35 * Math.sin(t * star.twinkleSpeed + star.twinklePhase)
        ctx!.beginPath()
        ctx!.fillStyle = `rgba(${star.color}, ${star.baseAlpha * twinkle})`
        ctx!.arc(star.x, y, star.radius, 0, Math.PI * 2)
        ctx!.fill()
      }
    }

    resize()
    window.addEventListener("resize", resize)
    window.addEventListener("scroll", onScroll, { passive: true })
    document.addEventListener("visibilitychange", onVisibility)

    if (reducedMotion) {
      drawStatic()
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
