import * as React from "react"
import { ThemeProvider, useTheme } from "@/hooks/useTheme"
import { Toaster } from "@/components/ui/sonner"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { BackToTop } from "@/components/layout/BackToTop"
import { Hero } from "@/components/sections/Hero"
import { About } from "@/components/sections/About"
import { Experience } from "@/components/sections/Experience"
import { Projects } from "@/components/sections/Projects"
import { Skills } from "@/components/sections/Skills"
import { Education } from "@/components/sections/Education"
import { Connect } from "@/components/sections/Connect"
import { scrollToId, startSmoothScroll, stopSmoothScroll } from "@/lib/smooth-scroll"
import { ScrollTrigger } from "@/lib/gsap"
import { hasWebGL, prefersReducedMotion } from "@/lib/env"
import { markFieldReady } from "@/components/three/fieldState"

const LatentField = React.lazy(() => import("@/components/three/LatentField"))

const WAKE_EVENTS = ["pointerdown", "touchstart", "wheel", "scroll", "keydown"] as const

function Backdrop() {
  const { theme } = useTheme()
  const [enabled] = React.useState(() => hasWebGL() && !prefersReducedMotion())
  // Wide screens need the field for the particle name, so it loads right away.
  const [load, setLoad] = React.useState(() => enabled && window.innerWidth >= 768)

  React.useEffect(() => {
    // Without a field, nothing will ever mark it ready; let the hero proceed.
    if (!enabled) {
      markFieldReady()
      return
    }
    if (load) return
    // Phones only get the ambient cloud: wait for the visitor's first move so the
    // 3D chunk never competes with the first paint.
    const wake = () => {
      WAKE_EVENTS.forEach((e) => window.removeEventListener(e, wake))
      setLoad(true)
    }
    WAKE_EVENTS.forEach((e) => window.addEventListener(e, wake, { passive: true }))
    return () => WAKE_EVENTS.forEach((e) => window.removeEventListener(e, wake))
  }, [enabled, load])

  return (
    <>
      <div aria-hidden className="latent-backdrop pointer-events-none fixed inset-0 z-0" />
      {load && (
        <React.Suspense fallback={null}>
          <LatentField theme={theme} />
        </React.Suspense>
      )}
    </>
  )
}

const BELOW_FOLD = [About, Experience, Projects, Skills, Education, Connect]

/**
 * The hero paints in the first task; the sections below it then mount one per
 * frame. Many small tasks instead of one long one keep a slow phone responsive
 * while the page assembles out of view.
 */
function useProgressiveMount(total: number) {
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (count >= total) return
    const next = () => setCount((c) => Math.min(total, c + 1))
    let timer = 0
    const frame = requestAnimationFrame(() => {
      timer = window.setTimeout(next, 0)
    })
    // Background tabs pause animation frames; don't leave the page half-built.
    const fallback = window.setTimeout(next, 250)
    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(timer)
      window.clearTimeout(fallback)
    }
  }, [count, total])

  const done = count >= total
  React.useEffect(() => {
    if (!done) return
    // ScrollTrigger refreshes on window load; if the page finished assembling after
    // that, re-measure once so page-length triggers see the full height.
    if (document.readyState === "complete") ScrollTrigger.refresh()
    // A deep link arrived before its section existed; honor it now.
    const id = window.location.hash.slice(1)
    if (id && id !== "main") requestAnimationFrame(() => scrollToId(id))
  }, [done])

  return count
}

function App() {
  const mounted = useProgressiveMount(BELOW_FOLD.length)
  const complete = mounted >= BELOW_FOLD.length

  React.useEffect(() => {
    startSmoothScroll()
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)")
    const onChange = () => (mql.matches ? stopSmoothScroll() : startSmoothScroll())
    mql.addEventListener("change", onChange)
    return () => {
      mql.removeEventListener("change", onChange)
      stopSmoothScroll()
    }
  }, [])

  return (
    <ThemeProvider>
      <a
        href="#main"
        className="fixed top-3 left-3 z-[100] -translate-y-20 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <Backdrop />
      <div aria-hidden className="grain" />
      <Navbar />
      <main id="main" tabIndex={-1} className="relative z-10 outline-none">
        <Hero />
        {BELOW_FOLD.slice(0, mounted).map((Section, i) => (
          <Section key={i} />
        ))}
      </main>
      {complete && (
        <>
          <Footer />
          <BackToTop />
        </>
      )}
      <Toaster position="bottom-center" />
    </ThemeProvider>
  )
}

export default App
