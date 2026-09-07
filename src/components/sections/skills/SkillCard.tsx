import * as React from "react"
import { cn } from "cn"
import { useGSAP } from "@gsap/react"
import { gsap } from "@/lib/gsap"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import type { SkillGroup } from "@/data/skills"
import { Badge } from "@/components/ui/badge"

export function SkillCard({ group, index }: { group: SkillGroup; index: number }) {
  const cardRef = React.useRef<HTMLElement>(null)
  const innerRef = React.useRef<HTMLDivElement>(null)
  const glowRef = React.useRef<HTMLSpanElement>(null)
  const reducedMotion = useReducedMotion()
  const accentText = index % 2 === 0 ? "text-teal" : "text-gold"
  const accentBorder = index % 2 === 0 ? "border-teal" : "border-gold"

  useGSAP(
    () => {
      const card = cardRef.current
      const inner = innerRef.current
      const glow = glowRef.current
      if (!card) return

      gsap.set(card, { transformPerspective: 800 })

      const dur = reducedMotion ? 0.01 : 0.4
      const setRotateX = gsap.quickTo(card, "rotateX", { duration: dur, ease: "power3.out" })
      const setRotateY = gsap.quickTo(card, "rotateY", { duration: dur, ease: "power3.out" })
      const setInnerX = inner ? gsap.quickTo(inner, "x", { duration: dur, ease: "power3.out" }) : null
      const setInnerY = inner ? gsap.quickTo(inner, "y", { duration: dur, ease: "power3.out" }) : null
      const setGlow = glow ? gsap.quickTo(glow, "opacity", { duration: 0.3, ease: "power1.out" }) : null

      const resetTilt = () => {
        setRotateX(0)
        setRotateY(0)
        setInnerX?.(0)
        setInnerY?.(0)
      }

      const onFocusIn = () => setGlow?.(0.35)
      const onFocusOut = () => {
        setGlow?.(0)
        resetTilt()
      }
      card.addEventListener("focusin", onFocusIn)
      card.addEventListener("focusout", onFocusOut)

      const mm = gsap.matchMedia()
      mm.add("(hover: hover) and (pointer: fine)", () => {
        const onMove = (e: MouseEvent) => {
          const rect = card.getBoundingClientRect()
          const px = (e.clientX - rect.left) / rect.width - 0.5
          const py = (e.clientY - rect.top) / rect.height - 0.5
          setRotateY(px * 5)
          setRotateX(-py * 5)
          setInnerX?.(px * 10)
          setInnerY?.(py * 10)
          setGlow?.(0.35)
        }
        const onLeave = () => {
          resetTilt()
          setGlow?.(0)
        }
        card.addEventListener("mousemove", onMove)
        card.addEventListener("mouseleave", onLeave)
        return () => {
          card.removeEventListener("mousemove", onMove)
          card.removeEventListener("mouseleave", onLeave)
        }
      })

      return () => {
        card.removeEventListener("focusin", onFocusIn)
        card.removeEventListener("focusout", onFocusOut)
        mm.revert()
      }
    },
    { scope: cardRef, dependencies: [reducedMotion] }
  )

  return (
    <article
      ref={cardRef}
      tabIndex={0}
      className="glass-panel glass-panel-hover rounded-xl p-6 outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div ref={innerRef}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="relative inline-flex">
            <span
              ref={glowRef}
              aria-hidden
              className="absolute -inset-1.5 rounded opacity-0 blur-md"
              style={{ backgroundColor: index % 2 === 0 ? "var(--teal)" : "var(--gold)" }}
            />
            <span
              className={cn(
                "relative border px-2 py-0.5 font-mono text-[11px] uppercase tracking-wide",
                accentBorder,
                accentText
              )}
            >
              {group.code} // {group.category}
            </span>
          </span>
          <span className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
            {group.descriptor}
          </span>
        </div>

        <h3 className="mt-4 font-heading text-lg leading-snug font-bold">{group.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{group.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {group.items.map((item) => (
            <Badge
              key={item}
              variant="outline"
              className={cn(
                "font-mono text-xs font-normal",
                item === group.flagship && [accentBorder, accentText]
              )}
            >
              {item}
            </Badge>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-border pt-3">
          <span className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
            {group.footNote}
          </span>
          <span className={cn("font-mono text-[11px] font-medium uppercase tracking-wide", accentText)}>
            {group.highlight}
          </span>
        </div>
      </div>
    </article>
  )
}
