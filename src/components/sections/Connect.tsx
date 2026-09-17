import * as React from "react"
import { toast } from "sonner"
import { ArrowUpRight, Check, Copy, FileText } from "lucide-react"
import { useGSAP } from "@gsap/react"
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap"
import { prefersReducedMotion } from "@/lib/env"
import { onApproach } from "@/lib/motion"
import { site } from "@/data/site"
import { GitHubIcon, LinkedInIcon } from "@/components/icons/BrandIcons"

const ContactForm = React.lazy(() => import("@/components/sections/connect/ContactForm"))

const channels = [
  { label: "LinkedIn", value: "saravanakumar-ks", href: site.linkedin, icon: LinkedInIcon },
  { label: "GitHub", value: "Saravana-2816", href: site.github, icon: GitHubIcon },
  { label: "Résumé", value: "PDF", href: site.resumeHref, icon: FileText },
]

export function Connect() {
  const rootRef = React.useRef<HTMLElement>(null)
  const headlineRef = React.useRef<HTMLHeadingElement>(null)
  const formSlotRef = React.useRef<HTMLDivElement>(null)
  const [copied, setCopied] = React.useState(false)
  const [formNear, setFormNear] = React.useState(false)

  // Fetch the form's code when the visitor is within a couple of screens of it.
  React.useEffect(() => {
    const slot = formSlotRef.current
    if (!slot) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setFormNear(true)
          observer.disconnect()
        }
      },
      { rootMargin: "1600px 0px" }
    )
    observer.observe(slot)
    return () => observer.disconnect()
  }, [])

  useGSAP(
    () => {
      const headline = headlineRef.current
      if (prefersReducedMotion() || !headline) return
      const fades = rootRef.current?.querySelectorAll("[data-connect-fade]") ?? []
      const channels = rootRef.current?.querySelectorAll("[data-channel]") ?? []
      onApproach(headline, () => gsap.set([fades, channels], { opacity: 0 }))

      let split: SplitText | null = null
      ScrollTrigger.create({
        trigger: headline,
        start: "top 80%",
        once: true,
        onEnter: () => {
          // Split only when it plays, and hand the original text back afterwards.
          split = SplitText.create(headline, { type: "lines,words", mask: "lines", linesClass: "split-mask", aria: "none" })
          // Split words sit in their own boxes; re-apply the gradient so "ships." keeps its color.
          headline.querySelectorAll(".text-gradient-signal > div").forEach((word) => {
            word.classList.add("text-gradient-signal")
          })
          gsap
            .timeline({ onComplete: () => split?.revert() })
            .from(split.words, { yPercent: 110, duration: 1.3, stagger: 0.06 })
            .fromTo(fades, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.1 }, 0.35)
            .fromTo(channels, { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 1, stagger: 0.07 }, 0.5)
        },
      })
      return () => split?.revert()
    },
    { scope: rootRef }
  )

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email)
      setCopied(true)
      toast.success("Email copied.")
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Couldn't copy. The address is " + site.email)
    }
  }

  return (
    <section ref={rootRef} id="connect" aria-labelledby="connect-title" className="relative overflow-hidden py-20 sm:py-28 lg:py-32">
      <div className="container-page">
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-end lg:gap-16">
          <h2
            id="connect-title"
            ref={headlineRef}
            className="max-w-[14ch] font-display text-[clamp(3rem,9vw,8.5rem)] leading-[0.9] font-semibold tracking-[-0.05em]"
          >
            Let&apos;s build something that <span className="text-gradient-signal pr-[0.06em]">ships.</span>
          </h2>
          <p data-connect-fade className="max-w-[40ch] text-lg text-muted-foreground sm:text-xl lg:pb-4">
            Have a role, a project, or just want to talk shop about RAG pipelines and system design? Reach out.
          </p>
        </div>

        <div className="mt-16 grid gap-14 sm:mt-24 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div className="flex flex-col">
            <div data-connect-fade className="flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${site.email}`}
                className="group relative font-display text-[clamp(1.25rem,2.6vw,2.1rem)] font-medium tracking-[-0.02em] break-all"
              >
                {site.email}
                <span
                  aria-hidden
                  className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-signal transition-transform duration-700 ease-(--ease-out-expo) group-hover:origin-left group-hover:scale-x-100"
                />
              </a>
              <button
                type="button"
                onClick={copyEmail}
                aria-label="Copy email address"
                className="grid size-10 place-items-center rounded-full border border-line text-muted-foreground transition-colors hover:border-line-strong hover:text-foreground"
              >
                {copied ? <Check className="size-4 text-signal" /> : <Copy className="size-4" />}
              </button>
            </div>

            <ul className="mt-12 border-t border-line">
              {channels.map(({ label, value, href, icon: Icon }) => {
                const external = href.startsWith("http") || href.endsWith(".pdf")
                return (
                  <li key={label} data-channel className="border-b border-line">
                    <a
                      href={href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noreferrer" : undefined}
                      className="group relative isolate -mx-3 flex items-center gap-4 overflow-hidden rounded-xl px-3 py-5"
                    >
                      <span
                        aria-hidden
                        className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-raised transition-transform duration-500 ease-(--ease-out-expo) group-hover:scale-y-100"
                      />
                      <Icon className="size-[18px] text-muted-foreground transition-colors group-hover:text-foreground" />
                      <span className="text-lg font-medium">{label}</span>
                      <span className="ml-auto truncate text-sm text-muted-foreground">{value}</span>
                      <ArrowUpRight
                        aria-hidden
                        className="size-4 shrink-0 -translate-x-2 text-signal opacity-0 transition-[opacity,transform] duration-500 ease-(--ease-out-expo) group-hover:translate-x-0 group-hover:opacity-100"
                      />
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>

          <div data-connect-fade className="relative">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-10 -z-10 opacity-70 blur-3xl"
              style={{
                background:
                  "radial-gradient(40% 45% at 30% 35%, color-mix(in srgb, var(--signal) 32%, transparent), transparent 70%), radial-gradient(40% 45% at 72% 70%, color-mix(in srgb, var(--pulse) 26%, transparent), transparent 70%)",
              }}
            />
            <div ref={formSlotRef} className="min-h-[540px] sm:min-h-[470px]">
              {formNear && (
                <React.Suspense fallback={null}>
                  <ContactForm />
                </React.Suspense>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
