import * as React from "react"
import { Mail } from "lucide-react"
import { GitHubIcon, LinkedInIcon } from "@/components/icons/BrandIcons"
import { useGSAP } from "@gsap/react"
import { gsap, SplitText } from "@/lib/gsap"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import { useTheme } from "@/hooks/useTheme"
import { site } from "@/data/site"
import { projects } from "@/data/projects"
import { Button } from "@/components/ui/button"
import { RotatingRole } from "@/components/sections/hero/RotatingRole"
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
  const roleRef = React.useRef<HTMLParagraphElement>(null)
  const introRef = React.useRef<HTMLDivElement>(null)
  const factsRef = React.useRef<HTMLParagraphElement>(null)
  const ctaRef = React.useRef<HTMLDivElement>(null)
  const socialRef = React.useRef<HTMLDivElement>(null)
  const statRef = React.useRef<HTMLDivElement>(null)
  const panelRef = React.useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const targets = [
        leadRef.current,
        roleRef.current,
        introRef.current,
        factsRef.current,
        ctaRef.current,
        socialRef.current,
        statRef.current,
      ].filter(Boolean)

      if (reducedMotion) {
        gsap.set([...targets, nameRef.current, panelRef.current], { opacity: 1, filter: "none" })
        return
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

      if (nameRef.current) {
        const split = SplitText.create(nameRef.current, { type: "chars" })
        tl.set(nameRef.current, { opacity: 1 })
        tl.from(split.chars, {
          opacity: 0,
          y: 60,
          stagger: 0.015,
          duration: 0.9,
          clearProps: "transform",
        })
      }

      if (leadRef.current) {
        tl.from(leadRef.current, { opacity: 0, y: 12, duration: 0.5, clearProps: "transform" }, 0)
      }

      targets.slice(1).forEach((el, i) => {
        tl.from(el, { opacity: 0, y: 18, duration: 0.55, clearProps: "transform" }, 0.3 + i * 0.09)
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

        <h1
          ref={nameRef}
          className="mt-3 font-heading font-extrabold uppercase leading-[0.88] tracking-tight opacity-0"
          style={{ fontSize: "clamp(1.75rem, 8vw, 6.5rem)" }}
        >
          Saravanakumar
        </h1>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-start lg:gap-8">
          <div>
            <p ref={roleRef} className="text-xl font-medium sm:text-2xl">
              <RotatingRole roles={site.roles} />
            </p>

            <div
              ref={introRef}
              className="mt-3 max-w-[54ch] space-y-1.5 text-base text-muted-foreground sm:text-lg"
            >
              {site.introLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>

            <p
              ref={factsRef}
              className="mt-4 font-mono text-xs uppercase tracking-widest text-muted-foreground"
            >
              Chennai, India · B.Tech, AI &amp; ML
            </p>

            <div ref={ctaRef} className="mt-6 flex flex-wrap gap-4">
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

      <div className="mx-auto mt-8 flex w-full max-w-[1400px] items-end justify-between px-4 sm:px-6">
        <ScrollCue />
        <div ref={statRef} className="text-right">
          <p className="font-heading text-4xl font-extrabold leading-none sm:text-5xl">
            {String(projects.length).padStart(2, "0")}
          </p>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            Projects shipped
          </p>
        </div>
      </div>
    </section>
  )
}
