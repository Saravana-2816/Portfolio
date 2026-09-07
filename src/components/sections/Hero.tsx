import * as React from "react"
import { Mail } from "lucide-react"
import { GitHubIcon, LinkedInIcon } from "@/components/icons/BrandIcons"
import { useGSAP } from "@gsap/react"
import { gsap, SplitText } from "@/lib/gsap"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import { useTheme } from "@/hooks/useTheme"
import { site } from "@/data/site"
import { Button } from "@/components/ui/button"
import { ScrollCue } from "@/components/sections/hero/ScrollCue"
import { CodePanel } from "@/components/sections/hero/CodePanel"

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
}

const socials = [
  { label: "GitHub", href: site.github, icon: GitHubIcon },
  { label: "LinkedIn", href: site.linkedin, icon: LinkedInIcon },
  { label: "Email", href: `mailto:${site.email}`, icon: Mail },
]

export function Hero() {
  const reducedMotion = useReducedMotion()
  const { theme } = useTheme()
  const rootRef = React.useRef<HTMLDivElement>(null)
  const leadRef = React.useRef<HTMLParagraphElement>(null)
  const nameRef = React.useRef<HTMLHeadingElement>(null)
  const headlineRef = React.useRef<HTMLHeadingElement>(null)
  const subtitleRef = React.useRef<HTMLParagraphElement>(null)
  const factsRef = React.useRef<HTMLParagraphElement>(null)
  const ctaRef = React.useRef<HTMLDivElement>(null)
  const socialRef = React.useRef<HTMLDivElement>(null)
  const metricsRef = React.useRef<HTMLDivElement>(null)
  const panelRef = React.useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const targets = [
        leadRef.current,
        nameRef.current,
        subtitleRef.current,
        factsRef.current,
        ctaRef.current,
        socialRef.current,
        metricsRef.current,
      ].filter(Boolean)

      if (reducedMotion) {
        gsap.set([...targets, headlineRef.current, panelRef.current], { opacity: 1, filter: "none" })
        return
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

      if (headlineRef.current) {
        const split = SplitText.create(headlineRef.current, { type: "chars" })
        tl.set(headlineRef.current, { opacity: 1 })
        tl.from(split.chars, {
          opacity: 0,
          y: 60,
          stagger: 0.012,
          duration: 0.9,
          clearProps: "transform",
        })
      }

      if (leadRef.current) {
        tl.from(leadRef.current, { opacity: 0, y: 12, duration: 0.5, clearProps: "transform" }, 0)
      }

      targets.slice(1).forEach((el, i) => {
        tl.from(el, { opacity: 0, y: 18, duration: 0.55, clearProps: "transform" }, 0.3 + i * 0.08)
      })

      if (panelRef.current) {
        tl.from(
          panelRef.current,
          { opacity: 0, y: 24, duration: 0.7, clearProps: "transform" },
          0.45
        )
      }
    },
    { scope: rootRef, dependencies: [reducedMotion, theme] }
  )

  return (
    <section
      id="hero"
      ref={rootRef}
      className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden border-b border-border pt-20 pb-6"
    >
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6">
        <p
          ref={leadRef}
          className="font-mono text-sm font-medium uppercase tracking-[0.25em] text-foreground/80 sm:text-base"
        >
          Hi, I&apos;m
        </p>

        <h1 ref={nameRef} className="mt-2 font-heading text-xl font-bold sm:text-2xl">
          {site.name}
        </h1>

        <h2
          ref={headlineRef}
          className="mt-3 font-heading font-extrabold uppercase leading-[1.05] tracking-tight opacity-0"
          style={{ fontSize: "clamp(1.15rem, 4.6vw, 4.25rem)" }}
        >
          {site.headlineLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>

        <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-start lg:gap-8">
          <div>
            <p
              ref={subtitleRef}
              className="max-w-[56ch] text-base text-muted-foreground sm:text-lg"
            >
              {site.subtitle}
            </p>

            <p
              ref={factsRef}
              className="mt-3 font-mono text-xs uppercase tracking-widest text-muted-foreground"
            >
              Chennai, India · B.Tech, AI &amp; ML
            </p>

            <div ref={ctaRef} className="mt-5 flex flex-wrap gap-4">
              <Button size="lg" onClick={() => scrollToSection("projects")}>
                View My Work
              </Button>
              <Button size="lg" variant="outline" onClick={() => scrollToSection("connect")}>
                Let&apos;s Connect
              </Button>
            </div>

            <div ref={socialRef} className="mt-5 flex items-center gap-3">
              {socials.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer" : undefined}
                  aria-label={label}
                  className="flex size-10 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div ref={panelRef}>
            <CodePanel />
          </div>
        </div>
      </div>

      <div className="mx-auto mt-6 flex w-full max-w-[1400px] flex-wrap items-end justify-between gap-6 px-4 sm:px-6">
        <ScrollCue />
        <div ref={metricsRef} className="grid grid-cols-3 gap-6 sm:gap-10">
          {site.metrics.map((metric) => (
            <div key={metric.value}>
              <p className="font-heading text-2xl font-extrabold leading-none sm:text-3xl">
                {metric.value}
              </p>
              <p className="mt-1.5 font-mono text-[10px] leading-snug uppercase tracking-widest text-muted-foreground sm:text-[11px]">
                {metric.label[0]}
                <br />
                {metric.label[1]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
