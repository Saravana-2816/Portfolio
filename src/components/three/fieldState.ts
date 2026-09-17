/**
 * Shared, mutable state between the DOM (hero layout, GSAP, scroll) and the
 * WebGL field. Plain object on purpose: it is written every frame and must
 * never trigger a React render.
 */
export type NameSample = {
  /** xyz triples in viewport pixels, origin at viewport center, y up */
  positions: Float32Array
  /** 0..1 horizontal position across the whole name, for the gradient */
  spans: Float32Array
  count: number
  viewportWidth: number
  viewportHeight: number
}

type Listener = () => void

export const field = {
  /** 0 → particles scattered, 1 → assembled into the name (tweened on load) */
  intro: 0,
  /** 0 → hero at rest, 1 → hero scrolled through, cloud burst */
  burst: 0,
  /** Pointer in viewport px, origin at center, y up */
  pointer: { x: 0, y: 0, active: 0 },
  name: null as NameSample | null,
  nameVersion: 0,
  ready: false,
}

const readyListeners = new Set<Listener>()
const nameListeners = new Set<Listener>()

export function onFieldReady(fn: Listener) {
  if (field.ready) {
    fn()
    return () => {}
  }
  readyListeners.add(fn)
  return () => {
    readyListeners.delete(fn)
  }
}

export function markFieldReady() {
  if (field.ready) return
  field.ready = true
  readyListeners.forEach((fn) => fn())
  readyListeners.clear()
}

export function setNameSample(sample: NameSample | null) {
  field.name = sample
  field.nameVersion += 1
  nameListeners.forEach((fn) => fn())
}

export function onNameSample(fn: Listener) {
  nameListeners.add(fn)
  return () => {
    nameListeners.delete(fn)
  }
}

if (import.meta.env.DEV) {
  ;(window as unknown as { __field: typeof field }).__field = field
}
