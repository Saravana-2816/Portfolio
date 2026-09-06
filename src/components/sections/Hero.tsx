import * as React from "react"
import { Mail } from "lucide-react"
import { GitHubIcon, LinkedInIcon } from "@/components/icons/BrandIcons"
import { useGSAP } from "@gsap/react"
import { gsap, SplitText } from "@/lib/gsap"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import { site } from "@/data/site"
import { projects } from "@/data/projects"
import { Button } from "@/components/ui/button"
import { RotatingRole } from "@/components/sections/hero/RotatingRole"
import { ScrollCue } from "@/components/sections/hero/ScrollCue"

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
  const rootRef = React.useRef<HTMLDivElement>(null)
  const leadRef = React.useRef<HTMLParagraphElement>(null)
  const nameRef = React.useRef<HTMLHeadingElement>(null)
  const roleRef = React.useRef<HTMLParagraphElement>(null)
  const taglineRef = React.useRef<HTMLParagraphElement>(null)
  const ctaRef = React.useRef<HTMLDivElement>(null)
  const socialRef = React.useRef<HTMLDivElement>(null)
  const statRef = React.useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const targets = [
        leadRef.current,
        roleRef.current,
        taglineRef.current,
        ctaRef.current,
        socialRef.current,
        statRef.current,
      ].filter(Boolean)

      if (reducedMotion) {
        gsap.set([...targets, nameRef.current], { opacity: 1, filter: "none" })
        return
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

      if (nameRef.current) {
        const split = SplitText.create(nameRef.current, { type: "chars" })
        tl.set(nameRef.current, { opacity: 1 })
        tl.from(split.chars, {
          opacity: 0,
          y: 60,
          filter: "blur(14px)",
          stagger: 0.015,
          duration: 0.9,
        })
      }

      if (leadRef.current) {
        tl.from(leadRef.current, { opacity: 0, y: 12, duration: 0.5 }, 0)
      }

      targets.slice(1).forEach((el, i) => {
        tl.from(el, { opacity: 0, y: 18, duration: 0.55 }, 0.35 + i * 0.1)
      })
    },
    { scope: rootRef, dependencies: [reducedMotion] }
  )

  return (
    <section
      id="hero"
      ref={rootRef}
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden border-b border-border pt-24 pb-10"
    >
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6">
        <p ref={leadRef} className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Hi, I&apos;m
        </p>

        <h1
          ref={nameRef}
          className="mt-4 font-heading font-extrabold uppercase leading-[0.88] tracking-tight opacity-0"
          style={{ fontSize: "clamp(1.75rem, 9.5vw, 8.5rem)" }}
        >
          <span className="block">Saravanakumar</span>
          <span className="block">KS</span>
        </h1>

        <p ref={roleRef} className="mt-6 text-xl font-medium sm:text-2xl">
          <RotatingRole roles={site.roles} />
        </p>
        <p ref={taglineRef} className="mt-4 max-w-[52ch] text-base text-muted-foreground sm:text-lg">
          {site.tagline}
        </p>

        <div ref={ctaRef} className="mt-9 flex flex-wrap gap-4">
          <Button size="lg" onClick={() => scrollToSection("projects")}>
            View My Work
          </Button>
          <Button size="lg" variant="outline" onClick={() => scrollToSection("connect")}>
            Let&apos;s Connect
          </Button>
        </div>

        <div ref={socialRef} className="mt-8 flex items-center gap-3">
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

      <div className="mx-auto mt-16 flex w-full max-w-[1400px] items-end justify-between px-4 sm:px-6">
        <ScrollCue />
        <div ref={statRef} className="text-right">
          <p className="font-heading text-5xl font-extrabold leading-none sm:text-6xl">
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
