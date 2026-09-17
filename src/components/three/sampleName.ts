import type { NameSample } from "@/components/three/fieldState"

type SampleOptions = {
  /** Upper bound on particles; the grid gap widens until the name fits */
  maxCount?: number
}

/** Seeded generator so jitter is identical on every load. */
function rng(seed: number) {
  let s = seed >>> 0
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296
}

/**
 * Draws each name line into an offscreen canvas at exactly the place the DOM
 * lays it out, then samples the glyph pixels. The DOM stays the source of
 * truth for layout, so the particle name follows every breakpoint for free.
 *
 * Each line element must contain a zero-size `[data-baseline]` marker at the
 * end of its text; its top edge is the alphabetic baseline.
 */
export function sampleName(
  lines: HTMLElement[],
  stage: HTMLElement,
  { maxCount = 9000 }: SampleOptions = {}
): NameSample | null {
  const stageRect = stage.getBoundingClientRect()
  const vw = Math.round(stageRect.width)
  const vh = Math.round(stageRect.height)
  if (vw === 0 || vh === 0) return null

  const canvas = document.createElement("canvas")
  canvas.width = vw
  canvas.height = vh
  const ctx = canvas.getContext("2d", { willReadFrequently: true })
  if (!ctx) return null

  ctx.fillStyle = "#fff"
  ctx.textBaseline = "alphabetic"

  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity
  let fontSize = 0

  for (const line of lines) {
    const marker = line.querySelector<HTMLElement>("[data-baseline]")
    const text = line.dataset.text
    if (!marker || !text) continue

    const style = getComputedStyle(line)
    const rect = line.getBoundingClientRect()
    const baseline = marker.getBoundingClientRect().top - stageRect.top
    const left = rect.left - stageRect.left
    fontSize = Math.max(fontSize, parseFloat(style.fontSize))

    ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
    if ("letterSpacing" in ctx) {
      ctx.letterSpacing = style.letterSpacing === "normal" ? "0px" : style.letterSpacing
    }
    ctx.fillText(text, left, baseline)

    minX = Math.min(minX, left)
    maxX = Math.max(maxX, rect.right - stageRect.left)
    minY = Math.min(minY, rect.top - stageRect.top)
    maxY = Math.max(maxY, rect.bottom - stageRect.top)
  }

  if (!Number.isFinite(minX) || fontSize === 0) return null

  const x0 = Math.max(0, Math.floor(minX) - 4)
  const x1 = Math.min(vw, Math.ceil(maxX) + 4)
  const y0 = Math.max(0, Math.floor(minY) - 4)
  const y1 = Math.min(vh, Math.ceil(maxY) + 4)
  const data = ctx.getImageData(0, 0, vw, vh).data

  // Wide enough that each point reads as a point: a dot matrix, not a fill.
  let gap = Math.max(3, Math.round(fontSize / 34))
  let hits: number[] = []

  // Widen the grid until the count fits the budget.
  for (;;) {
    hits = []
    for (let y = y0; y < y1; y += gap) {
      for (let x = x0; x < x1; x += gap) {
        if (data[(y * vw + x) * 4 + 3] > 150) hits.push(x, y)
      }
    }
    if (hits.length / 2 <= maxCount || gap > 8) break
    gap += 1
  }

  const count = hits.length / 2
  const positions = new Float32Array(count * 3)
  const spans = new Float32Array(count)
  const random = rng(20040928)
  const width = Math.max(1, maxX - minX)
  const jitter = gap * 0.32

  for (let i = 0; i < count; i++) {
    const px = hits[i * 2] + (random() - 0.5) * jitter
    const py = hits[i * 2 + 1] + (random() - 0.5) * jitter
    positions[i * 3] = px - vw / 2
    positions[i * 3 + 1] = vh / 2 - py
    positions[i * 3 + 2] = 0
    spans[i] = (px - minX) / width
  }

  return { positions, spans, count, viewportWidth: vw, viewportHeight: vh }
}
