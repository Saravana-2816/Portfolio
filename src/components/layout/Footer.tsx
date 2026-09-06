import { Mail } from "lucide-react"
import { GitHubIcon, LinkedInIcon } from "@/components/icons/BrandIcons"
import { navLinks, site } from "@/data/site"

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
}

const socials = [
  { label: "GitHub", href: site.github, icon: GitHubIcon },
  { label: "LinkedIn", href: site.linkedin, icon: LinkedInIcon },
  { label: "Email", href: `mailto:${site.email}`, icon: Mail },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-[1120px] flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs space-y-3">
          <p className="font-heading text-base font-semibold">
            Saravanakumar<span className="text-signal">.</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Full-Stack Developer &amp; AI Engineer, building systems that ship and scale.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-foreground">Quick links</p>
          <nav className="flex flex-col gap-1.5">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="w-fit text-left text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-foreground">Connect</p>
          <div className="flex items-center gap-3">
            {socials.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noreferrer" : undefined}
                aria-label={label}
                className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-signal hover:text-signal"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-[1120px] flex-col gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {year} Saravanakumar KS. All rights reserved.</p>
          <p>Built with React, Three.js &amp; GSAP.</p>
        </div>
      </div>
    </footer>
  )
}
