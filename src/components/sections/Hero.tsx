import * as React from "react"
import { Mail } from "lucide-react"
import { useGSAP } from "@gsap/react"
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap"
import { site } from "@/data/site"
import { cn } from "@/lib/utils"
import { scrollToId } from "@/lib/smooth-scroll"
import { canRenderParticleName, prefersReducedMotion } from "@/lib/env"
import { field, onFieldReady, setNameSample } from "@/components/three/fieldState"
import { sampleName } from "@/components/three/sampleName"
import { GitHubIcon, LinkedInIcon } from "@/components/icons/BrandIcons"
import { PillButton } from "@/components/ui/pill-button"

type NameMode = "pending" | "particles" | "dom"

const socials = [
  { label: "GitHub", href: site.github, icon: GitHubIcon },
  { label: "LinkedIn", href: site.linkedin, icon: LinkedInIcon },
  { label: "Email", href: `mailto:${site.email}`, icon: Mail },
]

const SCRAMBLE_CHARS = "01abcdefghijklmnopqrstuvwxyz"
const FONT_WAIT_MS = 900

export function Hero() {
  const sectionRef = React.useRef<HTMLElement>(null)
  const stageRef = React.useRef<HTMLDivElement>(null)
  const nameRef = React.useRef<HTMLHeadingElement>(null)
  const lineRefs = React.useRef<HTMLSpanElement[]>([])
  const copyRef = React.useRef<HTMLDivElement>(null)
  const leadRef = React.useRef<HTMLParagraphElement>(null)
  const ruleRef = React.useRef<HTMLSpanElement>(null)
  const roleRef = React.useRef<HTMLSpanElement>(null)
  const taglineRef = React.useRef<HTMLParagraphElement>(null)
  const actionsRef = React.useRef<HTMLDivElement>(null)
  const footRef = React.useRef<HTMLDivElement>(null)

  // Phones and reduced motion know their answer on the first render; only the particle name waits for fonts.
  const [mode, setMode] = React.useState<NameMode>(() => (canRenderParticleName() ? "pending" : "dom"))
  const introStarted = React.useRef(false)

  // Decide who draws the name, and resample whenever the layout changes width.
  React.useEffect(() => {
    let cancelled = false
    let lastWidth = 0

    const measure = async () => {
      if (!canRenderParticleName()) {
        lastWidth = window.innerWidth
        if (field.name) setNameSample(null)
        setMode("dom")
        return
      }
      try {
        await document.fonts.load('700 100px "Space Grotesk Variable"')
      } catch {
        /* the fallback face still measures correctly */
      }
      await document.fonts.ready
      if (cancelled || !stageRef.current) return
      lastWidth = window.innerWidth

      const lines = lineRefs.current.filter(Boolean)
      const sample = sampleName(lines, stageRef.current, {
        maxCount: window.innerWidth >= 1280 ? 9000 : 6000,
      })
      setNameSample(sample)
      setMode(sample ? "particles" : "dom")
    }

    measure()

    let timer = 0
    const onResize = () => {
      // Mobile toolbars change height constantly; only width changes reflow the name.
      if (Math.abs(window.innerWidth - lastWidth) < 2) return
      window.clearTimeout(timer)
      timer = window.setTimeout(measure, 220)
    }
    window.addEventListener("resize", onResize)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
      window.removeEventListener("resize", onResize)
    }
  }, [])

  // The intro: one orchestrated timeline. The copy keeps its schedule; the particle
  // name joins as soon as the GPU has painted, and the DOM name steps in if it never does.
  useGSAP(
    (_context, contextSafe) => {
      if (mode === "pending" || introStarted.current) return
      introStarted.current = true
      const root = document.documentElement

      if (prefersReducedMotion()) {
        field.intro = 1
        root.classList.remove("js-intro")
        return
      }

      let cancelled = false
      let copyTimer = 0
      let fallbackTimer = 0
      let unsubscribe = () => {}
      let roleCall: gsap.core.Tween | null = null

      const start = () => {
        // Splits are scaffolding for the entrance: revert them once played so the DOM and
        // screen readers get the original text back.
        const tl = gsap.timeline({ paused: true })
        if (leadRef.current) {
          const lead = SplitText.create(leadRef.current, { type: "chars", mask: "chars", aria: "none" })
          tl.from(lead.chars, { yPercent: 100, duration: 0.9, stagger: 0.03, onComplete: () => lead.revert() }, 0.15)
        }
        tl.from(ruleRef.current, { scaleX: 0, duration: 1.1, ease: "swing" }, 0.95)
        tl.fromTo(
          roleRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 1.2,
            scrambleText: { text: site.roles[0], chars: SCRAMBLE_CHARS, speed: 0.5 },
            ease: "none",
          },
          1.05
        )
        if (taglineRef.current && mode === "particles") {
          const tag = SplitText.create(taglineRef.current, {
            type: "lines",
            mask: "lines",
            linesClass: "split-mask",
            aria: "none",
          })
          tl.from(tag.lines, { yPercent: 100, duration: 1.1, stagger: 0.09, onComplete: () => tag.revert() }, 1.2)
        } else if (taglineRef.current) {
          // Phones: the tagline is the largest thing on screen, so it is visible from the
          // first frame and only settles into place. No mask, no fade.
          tl.from(taglineRef.current, { y: 22, duration: 1.4 }, 0)
        }
        if (actionsRef.current) {
          tl.from(actionsRef.current.children, { y: 26, opacity: 0, duration: 1, stagger: 0.08 }, 1.45)
        }
        if (footRef.current) {
          tl.from(footRef.current.children, { opacity: 0, y: 12, duration: 1, stagger: 0.1 }, 1.85)
        }
        tl.add(() => startRoleRotation(), 2.6)

        // Reveal happens in the same task as the first rendered frame of every "from" tween.
        root.classList.remove("js-intro")
        tl.progress(0)

        let nameStarted = false
        const revealDomName = () => {
          if (nameStarted) return
          nameStarted = true
          field.intro = 1
          const glyphs = nameRef.current?.querySelectorAll<HTMLElement>("[data-glyphs]")
          if (glyphs?.length) {
            const split = SplitText.create(Array.from(glyphs), { type: "chars", mask: "chars", aria: "none" })
            gsap.from(split.chars, {
              yPercent: 105,
              duration: 1.2,
              stagger: 0.028,
              ease: "settle",
              onComplete: () => split.revert(),
            })
          }
        }

        if (mode === "particles") {
          unsubscribe = onFieldReady(() => {
            if (nameStarted) return
            nameStarted = true
            window.clearInterval(fallbackTimer)
            gsap.to(field, { intro: 1, duration: 2.9, ease: "none" })
            tl.play()
          })
          // The words never wait long for the GPU.
          copyTimer = window.setTimeout(() => tl.play(), 900)
          // Count only visible time: a background tab is not a slow GPU.
          let visibleMs = 0
          fallbackTimer = window.setInterval(() => {
            if (document.hidden) return
            visibleMs += 250
            if (visibleMs < 5000) return
            window.clearInterval(fallbackTimer)
            setNameSample(null)
            setMode("dom")
            revealDomName()
          }, 250)
        } else {
          // No particle assembly to wait on, so the words can arrive sooner.
          revealDomName()
          tl.timeScale(1.6).play()
        }

        let roleIndex = 0
        function startRoleRotation() {
          const step = () => {
            if (field.burst < 0.6 && !document.hidden) {
              roleIndex = (roleIndex + 1) % site.roles.length
              gsap.to(roleRef.current, {
                duration: 1.1,
                scrambleText: { text: site.roles[roleIndex], chars: SCRAMBLE_CHARS, speed: 0.55 },
                ease: "none",
              })
            }
            roleCall = gsap.delayedCall(3.4, step)
          }
          roleCall = gsap.delayedCall(2.2, step)
        }
      }

      const safeStart = contextSafe ? contextSafe(start) : start
      if (mode === "particles") {
        // Fonts already loaded: the name was sampled from them.
        safeStart()
      } else {
        // The name is live text here, so reveal it only once the web fonts have landed
        // (or after a short cap). Swapping fonts under a visible hero shifts the layout.
        const fonts = Promise.all([
          document.fonts.load('600 1em "Space Grotesk Variable"'),
          document.fonts.load('400 1em "Inter Variable"'),
        ]).catch(() => undefined)
        const cap = new Promise((resolve) => window.setTimeout(resolve, FONT_WAIT_MS))
        Promise.race([fonts, cap]).then(() => {
          if (!cancelled) safeStart()
        })
      }

      return () => {
        cancelled = true
        window.clearTimeout(copyTimer)
        window.clearInterval(fallbackTimer)
        unsubscribe()
        roleCall?.kill()
      }
    },
    { dependencies: [mode], scope: sectionRef }
  )

  // Scrolling through the hero bursts the name and flies into the cloud.
  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section) return

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          field.burst = self.progress
        },
      })

      if (prefersReducedMotion()) return () => trigger.kill()

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: section, start: "top top", end: "bottom bottom", scrub: 0.5 },
      })
      // The words leave first so the burst has the stage; the name's DOM layer follows it out.
      tl.to(copyRef.current, { yPercent: -22, opacity: 0, duration: 0.3 }, 0)
        .to(footRef.current, { opacity: 0, duration: 0.1 }, 0)
        .to(leadRef.current, { y: -40, opacity: 0, duration: 0.28 }, 0.02)
        .to(nameRef.current, { y: -60, opacity: 0, duration: 0.32, transformOrigin: "0% 50%" }, 0.04)
        // A scrubbed timeline spans the whole scroll range; pin its length to 1 so the numbers above mean progress.
        .set({}, {}, 1)

      return () => trigger.kill()
    },
    { scope: sectionRef }
  )

  const ghostName = mode === "particles"

  return (
    <section id="hero" ref={sectionRef} aria-label="Introduction" className="relative h-[175svh] md:h-[220svh]">
      <div ref={stageRef} className="sticky top-0 flex h-svh flex-col overflow-hidden">
        <div className="container-page flex flex-1 flex-col justify-center pt-20 pb-24 sm:pb-28">
          <p
            ref={leadRef}
            data-intro
            className="font-heading text-lg font-medium text-muted-foreground sm:text-xl md:text-2xl"
          >
            {site.leadIn}
          </p>

          <h1
            ref={nameRef}
            className={cn(
              "mt-3 font-display font-bold tracking-[-0.045em] uppercase",
              ghostName ? "text-transparent selection:text-foreground" : "text-foreground"
            )}
            style={{ fontSize: "clamp(2.4rem, 10.2vw, 9.6rem)", lineHeight: 0.84 }}
          >
            <span
              ref={(el) => {
                if (el) lineRefs.current[0] = el
              }}
              data-text={site.nameLines[0]}
              className="inline-block whitespace-nowrap"
            >
              <span data-glyphs data-intro-name>
                Saravanakumar
              </span>
              <span data-baseline aria-hidden className="inline-block h-0 w-0 align-baseline" />
            </span>
            <span className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-8">
              <span
                ref={(el) => {
                  if (el) lineRefs.current[1] = el
                }}
                data-text={site.nameLines[1]}
                className="inline-block whitespace-nowrap"
              >
                <span className="sr-only"> </span>
                <span data-glyphs data-intro-name>
                  KS
                </span>
                <span data-baseline aria-hidden className="inline-block h-0 w-0 align-baseline" />
              </span>

              <span
                aria-hidden
                className="flex min-h-[2.5em] items-start gap-4 pb-[0.2em] font-heading sm:min-h-0 sm:items-center text-xl font-medium tracking-normal text-foreground normal-case sm:pb-[0.35em] sm:text-2xl lg:text-3xl"
                style={{ lineHeight: 1.2 }}
              >
                <span ref={ruleRef} data-intro className="hidden h-px w-14 origin-left bg-line-strong sm:block" />
                <span ref={roleRef} data-intro className="sm:whitespace-nowrap">
                  {site.roles[0]}
                </span>
              </span>
            </span>
          </h1>
          <p className="sr-only">{site.roles.join(", ")}.</p>

          <div ref={copyRef} className="mt-8 sm:mt-10">
            <p
              ref={taglineRef}
              data-intro
              className="max-w-[34ch] text-lg leading-snug text-muted-foreground sm:text-xl md:text-2xl"
            >
              {site.tagline.lead} — <span className="text-foreground">{site.tagline.rest}</span>
            </p>

            <div ref={actionsRef} data-intro className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
              <PillButton onClick={() => scrollToId("projects")}>View My Work</PillButton>
              <PillButton variant="ghost" onClick={() => scrollToId("connect")}>
                Let&apos;s Connect
              </PillButton>
              <span aria-hidden className="mx-1 hidden h-6 w-px bg-line sm:block" />
              <div className="flex items-center gap-1">
                {socials.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noreferrer" : undefined}
                    aria-label={label}
                    className="flex size-11 items-center justify-center rounded-full text-muted-foreground transition-colors duration-300 hover:bg-raised hover:text-foreground"
                  >
                    <Icon className="size-[18px]" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div
          ref={footRef}
          className="container-page absolute inset-x-0 bottom-0 flex items-end justify-between pb-6 sm:pb-8"
        >
          <button
            type="button"
            data-intro
            onClick={() => scrollToId("about")}
            className="group flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="relative block h-10 w-px overflow-hidden bg-line">
              <span className="cue-drop absolute inset-x-0 top-0 block h-1/2 bg-foreground" />
            </span>
            Scroll
          </button>

          <button
            type="button"
            data-intro
            onClick={() => scrollToId("experience")}
            className="flex items-center gap-2.5 rounded-full border border-line bg-background/40 px-3.5 py-2 text-sm text-muted-foreground backdrop-blur-md transition-colors hover:border-line-strong hover:text-foreground"
          >
            <span className="relative flex size-2">
              <span className="live-ping absolute inset-0 rounded-full bg-ember" />
              <span className="relative size-2 rounded-full bg-ember" />
            </span>
            Now building at Slate.AI
          </button>
        </div>
      </div>
    </section>
  )
}
