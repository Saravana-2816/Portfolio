import * as React from "react"
import { useGSAP } from "@gsap/react"
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap"
import { prefersReducedMotion } from "@/lib/env"
import { onApproach } from "@/lib/motion"
import { Section } from "@/components/layout/Section"
import { SectionHeading } from "@/components/layout/SectionHeading"

type Stat = { value: number; decimals?: number; suffix?: string; text?: string; label: string }

const stats: Stat[] = [
  { value: 4, suffix: "+", label: "Projects shipped" },
  { value: 2, label: "Teams worked with" },
  { value: 8.54, decimals: 2, label: "CGPA / 10" },
  { value: 0, text: "Backend + AI", label: "Core focus" },
]

function formatStat(stat: Stat, v: number) {
  return v.toFixed(stat.decimals ?? 0) + (stat.suffix ?? "")
}

/** Numbers count once, the focus line decodes once. */
function animateStats(list: HTMLElement) {
  const play = { trigger: list, start: "top 85%", once: true }

  list.querySelectorAll<HTMLElement>("[data-stat]").forEach((el, i) => {
    const stat = stats[i]
    if (stat.text) {
      gsap.fromTo(
        el,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1.4,
          ease: "none",
          scrambleText: { text: stat.text, chars: "01+<>/", speed: 0.4 },
          scrollTrigger: play,
        }
      )
      return
    }
    const counter = { v: 0 }
    el.textContent = formatStat(stat, 0)
    gsap.to(counter, {
      v: stat.value,
      duration: 1.8,
      delay: i * 0.12,
      ease: "power3.out",
      scrollTrigger: play,
      onUpdate: () => {
        el.textContent = formatStat(stat, counter.v)
      },
    })
  })

  gsap.from(list.querySelectorAll("[data-stat-rule]"), {
    scaleX: 0,
    duration: 1.4,
    stagger: 0.1,
    ease: "swing",
    scrollTrigger: play,
  })
}

export function About() {
  const bioRef = React.useRef<HTMLParagraphElement>(null)
  const statsRef = React.useRef<HTMLDListElement>(null)

  // The bio lights up word by word as it is read: reading progress made visible.
  // Words rest at the muted text color, never below it, so every word stays readable.
  // The split waits until the paragraph is near, keeping it off the first-load work.
  useGSAP(() => {
    const bio = bioRef.current
    if (!bio || prefersReducedMotion()) return
    let split: SplitText | null = null
    ScrollTrigger.create({
      trigger: bio,
      start: "top bottom+=400",
      once: true,
      onEnter: () => {
        split = SplitText.create(bio, { type: "words", wordsClass: "lit-word", aria: "none" })
        gsap.fromTo(
          split.words,
          { "--lit": 0 },
          {
            "--lit": 1,
            ease: "none",
            stagger: 0.05,
            scrollTrigger: { trigger: bio, start: "top 78%", end: "bottom 52%", scrub: 0.4 },
          }
        )
      },
    })
    return () => split?.revert()
  })

  useGSAP(() => {
    const list = statsRef.current
    if (!list || prefersReducedMotion()) return
    onApproach(list, () => animateStats(list))
  })

  return (
    <Section id="about">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <SectionHeading id="about-title" title="About" />
          </div>
        </div>

        <div className="lg:col-span-8">
          <p
            ref={bioRef}
            className="max-w-[58ch] font-heading text-[clamp(1.2rem,1.9vw,1.7rem)] leading-[1.45] font-normal tracking-[-0.01em] text-foreground"
          >
            Hi, I&apos;m Saravanakumar KS — a Full-Stack Developer by role, and an{" "}
            <span className="text-signal">AI Engineer at heart</span>. Day to day, I build across the stack with
            React, React Native, Node.js, GraphQL, and PostgreSQL, but where I really lean in is backend
            engineering and AI: I&apos;ve built production RAG pipelines, fine-tuned lightweight LLaMA models, and
            worked hands-on with MCP tools and agentic AI frameworks — all backed by a strong foundation in Machine
            Learning and Deep Learning. I&apos;m currently deepening my System Design skills to architect things
            that scale, with practical DevOps experience in Docker, Kubernetes, and Jenkins to back it up. For me,
            good engineering doesn&apos;t stop at “it works” — it has to ship, and it has to scale.
          </p>
        </div>
      </div>

      <dl ref={statsRef} className="mt-24 grid grid-cols-2 gap-x-6 gap-y-12 sm:mt-32 lg:grid-cols-4 lg:gap-8">
        {stats.map((stat) => (
          <div key={stat.label} className="relative pt-6">
            <span data-stat-rule aria-hidden className="absolute inset-x-0 top-0 h-px origin-left bg-line-strong" />
            <dt className="sr-only">{stat.label}</dt>
            <dd
              data-stat
              aria-label={stat.text ?? formatStat(stat, stat.value)}
              className={
                stat.text
                  ? "flex min-h-[clamp(2.6rem,5.4vw,4.75rem)] items-end font-display text-[clamp(1.6rem,2.6vw,2.4rem)] leading-none font-semibold tracking-[-0.03em] text-signal"
                  : "font-display text-[clamp(2.6rem,5.4vw,4.75rem)] leading-none font-semibold tracking-[-0.04em] whitespace-nowrap"
              }
            >
              {stat.text ?? formatStat(stat, stat.value)}
            </dd>
            <dd aria-hidden className="mt-3 text-sm text-muted-foreground sm:text-base">
              {stat.label}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  )
}
