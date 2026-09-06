import * as React from "react"
import { Mail } from "lucide-react"
import { GitHubIcon, LinkedInIcon } from "@/components/icons/BrandIcons"
import { useGSAP } from "@gsap/react"
import { gsap, SplitText } from "@/lib/gsap"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import { site } from "@/data/site"
import { Button } from "@/components/ui/button"
import { RotatingRole } from "@/components/sections/hero/RotatingRole"
import { ScrollCue } from "@/components/sections/hero/ScrollCue"

const Scene = React.lazy(() =>
  import("@/components/three/Scene").then((m) => ({ default: m.Scene }))
)

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
  const sceneWrapRef = React.useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const targets = [
        leadRef.current,
        roleRef.current,
        taglineRef.current,
        ctaRef.current,
        socialRef.current,
      ].filter(Boolean)

      if (reducedMotion) {
        gsap.set([...targets, nameRef.current, sceneWrapRef.current], { opacity: 1 })
        return
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

      if (nameRef.current) {
        const split = SplitText.create(nameRef.current, { type: "chars" })
        tl.set(nameRef.current, { opacity: 1 })
        tl.from(split.chars, {
          opacity: 0,
          y: 24,
          stagger: 0.02,
          duration: 0.6,
        })
      }

      if (leadRef.current) {
        tl.from(leadRef.current, { opacity: 0, y: 12, duration: 0.5 }, 0)
      }

      targets.slice(1).forEach((el, i) => {
        tl.from(el, { opacity: 0, y: 18, duration: 0.55 }, 0.25 + i * 0.12)
      })

      if (sceneWrapRef.current) {
        tl.from(
          sceneWrapRef.current,
          { opacity: 0, scale: 0.92, duration: 1 },
          0.1
        )
      }
    },
    { scope: rootRef, dependencies: [reducedMotion] }
  )

  return (
    <section
      id="hero"
      ref={rootRef}
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 items-center gap-10 px-4 pt-28 pb-20 sm:px-6 lg:grid-cols-2 lg:gap-6 lg:pt-24 lg:pb-16">
        <div className="relative z-10 order-2 max-w-xl lg:order-1 lg:pl-[max(0px,calc((100vw-1120px)/2))]">
          <p ref={leadRef} className="text-sm font-medium text-muted-foreground">
            Hi, I&apos;m
          </p>
          <h1
            ref={nameRef}
            className="mt-2 gradient-text text-balance font-heading text-4xl font-semibold tracking-tight opacity-0 sm:text-5xl lg:text-6xl"
          >
            {site.name}
          </h1>
          <p ref={roleRef} className="mt-4 text-xl font-medium sm:text-2xl">
            <RotatingRole roles={site.roles} />
          </p>
          <p ref={taglineRef} className="mt-5 max-w-[52ch] text-base text-muted-foreground sm:text-lg">
            {site.tagline}
          </p>

          <div ref={ctaRef} className="mt-8 flex flex-wrap gap-3">
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
                className="flex size-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-signal hover:text-signal"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <div
          ref={sceneWrapRef}
          className="relative order-1 h-[300px] sm:h-[400px] lg:order-2 lg:h-[560px] xl:h-[620px]"
        >
          <React.Suspense fallback={null}>
            <Scene />
          </React.Suspense>
        </div>
      </div>

      <ScrollCue />
    </section>
  )
}
