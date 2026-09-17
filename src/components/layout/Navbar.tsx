import * as React from "react"
import { useGSAP } from "@gsap/react"
import { gsap, ScrollTrigger } from "@/lib/gsap"
import { cn } from "@/lib/utils"
import { navLinks, site } from "@/data/site"
import { useActiveSection } from "@/hooks/useActiveSection"
import { pauseScroll, scrollToId } from "@/lib/smooth-scroll"
import { prefersReducedMotion } from "@/lib/env"
import { ThemeToggle } from "@/components/layout/ThemeToggle"
import { ScrollProgress } from "@/components/layout/ScrollProgress"

const SECTION_IDS = navLinks.map((l) => l.id)

export function Navbar() {
  const headerRef = React.useRef<HTMLElement>(null)
  const linksRef = React.useRef<HTMLDivElement>(null)
  const indicatorRef = React.useRef<HTMLSpanElement>(null)
  const menuRef = React.useRef<HTMLDivElement>(null)
  const [open, setOpen] = React.useState(false)
  const activeId = useActiveSection(SECTION_IDS)

  // Solid, blurred bar once the hero is behind us.
  useGSAP(() => {
    const hero = document.getElementById("hero")
    if (!hero || !headerRef.current) return
    const header = headerRef.current
    // No end: a toggleClass range would switch off again at the very bottom of the page.
    ScrollTrigger.create({
      trigger: hero,
      start: "bottom 80px",
      onEnter: () => header.classList.add("is-scrolled"),
      onLeaveBack: () => header.classList.remove("is-scrolled"),
    })
  })

  // The active-section pill slides between links.
  React.useLayoutEffect(() => {
    const container = linksRef.current
    const indicator = indicatorRef.current
    if (!container || !indicator) return
    const link = container.querySelector<HTMLElement>(`[data-link="${activeId}"]`)
    if (!link) {
      gsap.to(indicator, { opacity: 0, duration: 0.3 })
      return
    }
    const move = {
      x: link.offsetLeft,
      width: link.offsetWidth,
      opacity: 1,
      duration: prefersReducedMotion() ? 0 : 0.6,
      ease: "settle",
    }
    gsap.to(indicator, move)
  }, [activeId])

  // Full-screen menu on small screens.
  useGSAP(
    () => {
      const menu = menuRef.current
      if (!menu) return
      const items = menu.querySelectorAll("[data-menu-item]")
      const reduced = prefersReducedMotion()
      if (open) {
        pauseScroll(true)
        gsap.set(menu, { display: "flex" })
        gsap.fromTo(
          menu,
          { clipPath: "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: reduced ? 0 : 0.8, ease: "swing" }
        )
        gsap.fromTo(
          items,
          { yPercent: 110 },
          { yPercent: 0, duration: reduced ? 0 : 0.9, stagger: 0.05, delay: reduced ? 0 : 0.25 }
        )
      } else {
        pauseScroll(false)
        gsap.to(menu, {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: reduced ? 0 : 0.6,
          ease: "swing",
          onComplete: () => {
            gsap.set(menu, { display: "none" })
          },
        })
      }
    },
    { dependencies: [open] }
  )

  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  const go = (id: string) => {
    setOpen(false)
    // Release the scroll lock before scrolling: restarting Lenis later would cancel the move.
    pauseScroll(false)
    scrollToId(id)
  }

  return (
    <>
      <header
        ref={headerRef}
        className="group/nav fixed inset-x-0 top-0 z-50 border-b border-transparent transition-[background-color,border-color,backdrop-filter] duration-500 [&.is-scrolled]:border-line [&.is-scrolled]:bg-background/70 [&.is-scrolled]:backdrop-blur-xl"
      >
        <nav aria-label="Primary" className="container-page flex h-16 items-center justify-between gap-4 sm:h-[72px]">
          <button
            type="button"
            onClick={() => go("hero")}
            className="group flex items-center gap-2.5 font-heading text-[15px] font-semibold tracking-tight"
            aria-label="Saravanakumar KS, back to top"
          >
            <span className="relative grid size-8 place-items-center rounded-full border border-line-strong transition-colors duration-500 group-hover:border-signal">
              <span className="size-1.5 rounded-full bg-signal transition-transform duration-500 group-hover:scale-150" />
            </span>
            <span className="hidden sm:inline">Saravanakumar KS</span>
          </button>

          <div
            ref={linksRef}
            className="relative hidden items-center rounded-full border border-line bg-background/40 p-1 backdrop-blur-md lg:flex"
          >
            <span
              ref={indicatorRef}
              aria-hidden
              className="absolute top-1 bottom-1 left-0 rounded-full bg-raised opacity-0 shadow-[inset_0_0_0_1px_var(--line-strong)]"
            />
            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                data-link={link.id}
                onClick={() => go(link.id)}
                aria-current={activeId === link.id ? "true" : undefined}
                className={cn(
                  "relative rounded-full px-4 py-1.5 text-sm transition-colors duration-300",
                  activeId === link.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <a
              href={site.resumeHref}
              target="_blank"
              rel="noreferrer"
              className="hidden h-9 items-center rounded-full border border-line px-4 text-sm text-foreground transition-colors duration-300 hover:border-signal sm:inline-flex"
            >
              Résumé
            </a>
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative z-10 grid size-10 place-items-center rounded-full border border-line lg:hidden"
            >
              <span className="relative block h-3 w-4">
                <span
                  className={cn(
                    "absolute left-0 h-px w-4 bg-foreground transition-transform duration-500 ease-(--ease-out-expo)",
                    open ? "top-1.5 rotate-45" : "top-0.5"
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 h-px w-4 bg-foreground transition-transform duration-500 ease-(--ease-out-expo)",
                    open ? "top-1.5 -rotate-45" : "top-2.5"
                  )}
                />
              </span>
            </button>
          </div>
        </nav>

        <ScrollProgress />
      </header>

      {/* Outside the header: its backdrop-filter would trap a fixed child. */}
      <div
        ref={menuRef}
        id="mobile-menu"
        data-lenis-prevent
        className="fixed inset-0 z-40 hidden flex-col justify-between bg-background px-4 pt-24 pb-10 sm:px-8 lg:hidden"
        style={{ clipPath: "inset(0% 0% 100% 0%)" }}
      >
        <ul className="flex flex-col gap-1">
          {navLinks.map((link) => (
            <li key={link.id} className="overflow-hidden">
              <button
                type="button"
                data-menu-item
                tabIndex={open ? 0 : -1}
                onClick={() => go(link.id)}
                className={cn(
                  "block py-1 text-left font-display text-5xl font-semibold tracking-tight sm:text-6xl",
                  activeId === link.id ? "text-signal" : "text-foreground"
                )}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground">
          <a tabIndex={open ? 0 : -1} href={site.resumeHref} target="_blank" rel="noreferrer" className="hover:text-foreground">
            Résumé
          </a>
          <a tabIndex={open ? 0 : -1} href={site.github} target="_blank" rel="noreferrer" className="hover:text-foreground">
            GitHub
          </a>
          <a tabIndex={open ? 0 : -1} href={site.linkedin} target="_blank" rel="noreferrer" className="hover:text-foreground">
            LinkedIn
          </a>
          <a tabIndex={open ? 0 : -1} href={`mailto:${site.email}`} className="hover:text-foreground">
            Email
          </a>
        </div>
      </div>
    </>
  )
}
