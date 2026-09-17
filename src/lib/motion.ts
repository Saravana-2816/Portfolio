import { ScrollTrigger } from "@/lib/gsap"

/**
 * Runs `build` once, shortly before `trigger` scrolls into view.
 *
 * Entrance animations write styles (hidden start states, SVG dash lengths) and
 * ScrollTriggers read layout. Doing both for every section at startup interleaves
 * reads and writes and forces a layout per section. Deferring each section's setup
 * until it is near keeps first load to a single layout pass.
 */
export function onApproach(trigger: Element, build: () => void, margin = 500) {
  return ScrollTrigger.create({
    trigger,
    start: `top bottom+=${margin}`,
    once: true,
    onEnter: build,
  })
}
