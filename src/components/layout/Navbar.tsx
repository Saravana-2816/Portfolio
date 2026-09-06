import * as React from "react"
import { Menu } from "lucide-react"
import { cn } from "cn"
import { navLinks, site } from "@/data/site"
import { useActiveSection } from "@/hooks/useActiveSection"
import { ThemeToggle } from "@/components/layout/ThemeToggle"
import { ScrollProgress } from "@/components/layout/ScrollProgress"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet"

const SECTION_IDS = navLinks.map((l) => l.id)

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
}

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false)
  const [sheetOpen, setSheetOpen] = React.useState(false)
  const activeId = useActiveSection(SECTION_IDS)

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.7)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-b border-border bg-background/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-[1120px] items-center justify-between px-4 sm:px-6">
        <button
          onClick={() => scrollToSection("hero")}
          className="font-heading text-sm font-semibold tracking-tight"
        >
          Saravanakumar<span className="text-signal">.</span>
        </button>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className={cn(
                "relative rounded-md px-3 py-2 text-sm font-medium transition-colors",
                activeId === link.id
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.label}
              {activeId === link.id && (
                <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-gradient-to-r from-signal to-pulse" />
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex" asChild>
            <a href={site.resumeHref} target="_blank" rel="noreferrer">
              Resume
            </a>
          </Button>
          <ThemeToggle />

          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="font-heading">Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-1 px-4">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => {
                      setSheetOpen(false)
                      scrollToSection(link.id)
                    }}
                    className={cn(
                      "rounded-md px-3 py-2 text-left text-base font-medium transition-colors",
                      activeId === link.id
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {link.label}
                  </button>
                ))}
                <a
                  href={site.resumeHref}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md px-3 py-2 text-left text-base font-medium text-muted-foreground hover:text-foreground"
                  onClick={() => setSheetOpen(false)}
                >
                  Resume
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      <ScrollProgress />
    </header>
  )
}
