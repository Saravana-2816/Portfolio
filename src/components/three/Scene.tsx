import * as React from "react"
import { Canvas } from "@react-three/fiber"
import { NodeField, nodeCountForWidth } from "./NodeField"
import { useReducedMotion } from "@/hooks/useReducedMotion"

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas")
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    )
  } catch {
    return false
  }
}

function useNodeCount() {
  const [count, setCount] = React.useState(() =>
    nodeCountForWidth(typeof window === "undefined" ? 1280 : window.innerWidth)
  )

  React.useEffect(() => {
    let frame = 0
    const onResize = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => setCount(nodeCountForWidth(window.innerWidth)))
    }
    window.addEventListener("resize", onResize)
    return () => {
      window.removeEventListener("resize", onResize)
      cancelAnimationFrame(frame)
    }
  }, [])

  return count
}

function usePageVisible() {
  const [visible, setVisible] = React.useState(() =>
    typeof document === "undefined" ? true : !document.hidden
  )

  React.useEffect(() => {
    const onVisibility = () => setVisible(!document.hidden)
    document.addEventListener("visibilitychange", onVisibility)
    return () => document.removeEventListener("visibilitychange", onVisibility)
  }, [])

  return visible
}

function StaticFallback() {
  return (
    <div
      aria-hidden
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(60% 60% at 70% 30%, color-mix(in srgb, var(--signal) 22%, transparent), transparent 70%), radial-gradient(50% 55% at 25% 75%, color-mix(in srgb, var(--pulse) 20%, transparent), transparent 70%)",
      }}
    />
  )
}

export function Scene() {
  const reducedMotion = useReducedMotion()
  const [webglOk, setWebglOk] = React.useState(true)
  const count = useNodeCount()
  const visible = usePageVisible()

  React.useEffect(() => {
    setWebglOk(supportsWebGL())
  }, [])

  if (reducedMotion || !webglOk) {
    return <StaticFallback />
  }

  return (
    <div className="absolute inset-0">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        frameloop={visible ? "always" : "never"}
      >
        <ThemedNodeField count={count} />
      </Canvas>
    </div>
  )
}

function ThemedNodeField({ count }: { count: number }) {
  const [theme, setTheme] = React.useState<"dark" | "light">(() =>
    document.documentElement.classList.contains("dark") ? "dark" : "light"
  )

  React.useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light")
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])

  return <NodeField theme={theme} count={count} />
}
