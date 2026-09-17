import Lenis from "lenis"
import { gsap, ScrollTrigger } from "@/lib/gsap"

let lenis: Lenis | null = null
let tick: ((time: number) => void) | null = null

const NAV_OFFSET = -72

export function startSmoothScroll() {
  if (lenis) return lenis
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null

  lenis = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 0.95 })
  lenis.on("scroll", ScrollTrigger.update)
  tick = (time: number) => lenis?.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
  return lenis
}

export function stopSmoothScroll() {
  if (tick) gsap.ticker.remove(tick)
  lenis?.destroy()
  lenis = null
  tick = null
}

export function pauseScroll(paused: boolean) {
  if (!lenis) return
  if (paused) lenis.stop()
  else lenis.start()
}

export function scrollToId(id: string) {
  const el = id === "top" ? 0 : document.getElementById(id)
  if (el === null) return
  if (lenis) {
    // Sections mount after the hero, so the cached scroll limit can be stale.
    lenis.resize()
    lenis.scrollTo(el, { offset: el === 0 ? 0 : NAV_OFFSET, duration: 1.4, force: true })
    return
  }
  if (el === 0) {
    window.scrollTo({ top: 0 })
    return
  }
  const top = el.getBoundingClientRect().top + window.scrollY + NAV_OFFSET
  window.scrollTo({ top })
}
