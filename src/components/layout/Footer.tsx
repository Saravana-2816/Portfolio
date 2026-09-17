import * as React from "react"
import { Mail } from "lucide-react"
import { useGSAP } from "@gsap/react"
import { gsap } from "@/lib/gsap"
import { prefersReducedMotion } from "@/lib/env"
import { navLinks, site } from "@/data/site"
import { scrollToId } from "@/lib/smooth-scroll"
import { GitHubIcon, LinkedInIcon } from "@/components/icons/BrandIcons"

const socials = [
  { label: "GitHub", href: site.github, icon: GitHubIcon },
  { label: "LinkedIn", href: site.linkedin, icon: LinkedInIcon },
  { label: "Email", href: `mailto:${site.email}`, icon: Mail },
]

export function Footer() {
  const footerRef = React.useRef<HTMLElement>(null)
  const markRef = React.useRef<HTMLParagraphElement>(null)
  const year = new Date().getFullYear()

  // The wordmark rises out of the page edge as you reach the end.
  useGSAP(
    () => {
      if (prefersReducedMotion() || !markRef.current) return
      gsap.fromTo(
        markRef.current,
        { yPercent: 60 },
        {
          yPercent: 0,
          ease: "none",
          scrollTrigger: { trigger: footerRef.current, start: "top bottom", end: "bottom bottom", scrub: 0.5 },
        }
      )
    },
    { scope: footerRef }
  )

  return (
    <footer ref={footerRef} className="relative z-10 overflow-hidden border-t border-line">
      <div className="container-page grid gap-12 pt-16 pb-10 sm:pt-20 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="max-w-sm">
          <p className="font-display text-xl font-semibold tracking-[-0.02em]">{site.name}</p>
          <p className="mt-3 text-muted-foreground">Full-Stack Developer and AI Engineer, building systems that ship and scale.</p>
        </div>

        <nav aria-label="Footer">
          <p className="text-sm text-muted-foreground">Sections</p>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 md:grid-cols-1">
            {navLinks.map((link) => (
              <li key={link.id}>
                <button
                  type="button"
                  onClick={() => scrollToId(link.id)}
                  className="text-foreground/85 transition-colors hover:text-signal"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-sm text-muted-foreground">Elsewhere</p>
          <ul className="mt-4 flex gap-2">
            {socials.map(({ label, href, icon: Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer" : undefined}
                  aria-label={label}
                  className="grid size-11 place-items-center rounded-full border border-line text-muted-foreground transition-colors hover:border-signal hover:text-foreground"
                >
                  <Icon className="size-[18px]" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container-page flex flex-col gap-2 border-t border-line py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© {year} Saravanakumar KS</p>
        <p>Built with React, Three.js &amp; GSAP</p>
      </div>

      <div aria-hidden className="pointer-events-none select-none">
        <p
          ref={markRef}
          className="-mb-[0.18em] text-center font-display leading-[0.8] font-bold tracking-[-0.055em] whitespace-nowrap text-transparent uppercase"
          style={{ fontSize: "11.6vw", WebkitTextStroke: "1px var(--line-strong)" }}
        >
          Saravanakumar
        </p>
      </div>
    </footer>
  )
}
