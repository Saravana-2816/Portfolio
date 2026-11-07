let webglCache: boolean | null = null

export function hasWebGL() {
  if (webglCache !== null) return webglCache
  try {
    const canvas = document.createElement("canvas")
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl")
    webglCache = !!gl
    gl?.getExtension("WEBGL_lose_context")?.loseContext()
  } catch {
    webglCache = false
  }
  return webglCache
}

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

/** The particle name is enabled whenever WebGL is available and reduced motion is off. */
export function canRenderParticleName() {
  return !prefersReducedMotion() && hasWebGL()
}

export function isFinePointer() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches
}
