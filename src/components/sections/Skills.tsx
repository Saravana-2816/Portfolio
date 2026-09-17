import * as React from "react"
import { Search, X } from "lucide-react"
import { useGSAP } from "@gsap/react"
import { Flip, gsap } from "@/lib/gsap"
import { cn } from "@/lib/utils"
import { prefersReducedMotion } from "@/lib/env"
import { onApproach } from "@/lib/motion"
import { skills, skillSuggestions } from "@/data/skills"
import { Section } from "@/components/layout/Section"
import { SectionHeading } from "@/components/layout/SectionHeading"

type Match = "idle" | "hit" | "miss"

const TOTAL = skills.reduce((n, g) => n + g.items.length, 0)

export function Skills() {
  const [query, setQuery] = React.useState("")
  const listRef = React.useRef<HTMLDivElement>(null)
  const flipState = React.useRef<Flip.FlipState | null>(null)
  const q = query.trim().toLowerCase()

  const groups = React.useMemo(
    () =>
      skills.map((group) => {
        const categoryHit = q.length > 0 && group.category.toLowerCase().includes(q)
        const items = group.items.map((name) => {
          const match: Match = !q ? "idle" : categoryHit || name.toLowerCase().includes(q) ? "hit" : "miss"
          return { name, match }
        })
        const hits = items.filter((i) => i.match === "hit")
        // Retrieval ranking: matches move to the front of their row.
        const ordered = q ? [...hits, ...items.filter((i) => i.match !== "hit")] : items
        return { ...group, items: ordered, hits: hits.length }
      }),
    [q]
  )

  const hitCount = groups.reduce((n, g) => n + g.hits, 0)
  const groupCount = groups.filter((g) => g.hits > 0).length

  const search = (value: string) => {
    if (listRef.current && !prefersReducedMotion()) {
      flipState.current = Flip.getState(listRef.current.querySelectorAll("[data-flip-id]"))
    }
    setQuery(value)
  }

  React.useLayoutEffect(() => {
    const state = flipState.current
    if (!state) return
    flipState.current = null
    Flip.from(state, { duration: 0.7, ease: "settle", simple: true })
  }, [q])

  useGSAP(
    () => {
      if (prefersReducedMotion() || !listRef.current) return
      gsap.utils.toArray<HTMLElement>("[data-skill-row]", listRef.current).forEach((row) => {
        onApproach(row, () => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 85%", once: true } })
          tl.from(row.querySelector("[data-row-rule]"), { scaleX: 0, duration: 1.4, ease: "swing" })
            .from(row.querySelector("[data-row-label]"), { opacity: 0, x: -20, duration: 1 }, 0.1)
            .from(
              row.querySelectorAll("[data-flip-id]"),
              // Clear afterwards so the search states own opacity again.
              { opacity: 0, y: 14, duration: 0.8, stagger: 0.03, clearProps: "opacity,transform" },
              0.2
            )
        })
      })
    },
    { scope: listRef }
  )

  const status = !q
    ? `${TOTAL} skills across ${skills.length} groups.`
    : hitCount === 0
      ? `Nothing matches “${query.trim()}”. Try Docker or LangChain.`
      : `${hitCount} ${hitCount === 1 ? "match" : "matches"} in ${groupCount} ${groupCount === 1 ? "group" : "groups"}.`

  return (
    <Section id="skills">
      <SectionHeading
        id="skills-title"
        title="Skills"
        aside={
          <div className="w-full md:max-w-[380px]">
            <label htmlFor="skill-search" className="sr-only">
              Search skills
            </label>
            <div className="group/search relative">
              <Search
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-5 z-10 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within/search:text-signal"
              />
              <input
                id="skill-search"
                type="search"
                value={query}
                onChange={(e) => search(e.target.value)}
                placeholder="Search the stack"
                autoComplete="off"
                spellCheck={false}
                className="h-14 w-full rounded-full border border-line-strong bg-background/60 pr-12 pl-12 text-base backdrop-blur-md transition-[border-color,box-shadow] outline-none placeholder:text-muted-foreground focus:border-signal focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--signal)_16%,transparent)] [&::-webkit-search-cancel-button]:hidden"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => search("")}
                  aria-label="Clear search"
                  className="absolute top-1/2 right-3 grid size-8 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-raised hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 pl-1">
              <span className="text-sm text-muted-foreground">Try</span>
              {skillSuggestions.map((s) => {
                const active = q === s.toLowerCase()
                return (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={active}
                    onClick={() => search(active ? "" : s)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-sm transition-colors duration-300",
                      active
                        ? "border-signal bg-signal text-background"
                        : "border-line text-muted-foreground hover:border-line-strong hover:text-foreground"
                    )}
                  >
                    {s}
                  </button>
                )
              })}
            </div>
          </div>
        }
      />

      <p aria-live="polite" className="mt-12 text-sm text-muted-foreground sm:mt-16">
        {status}
      </p>

      <div ref={listRef} className="mt-4">
        {groups.map((group) => {
          const dim = q.length > 0 && group.hits === 0
          return (
            <div
              key={group.category}
              data-skill-row
              className="relative grid gap-5 py-8 transition-opacity duration-500 md:grid-cols-[minmax(0,300px)_1fr] md:gap-10 md:py-10"
              style={{ opacity: dim ? 0.55 : 1 }}
            >
              <span data-row-rule aria-hidden className="absolute inset-x-0 top-0 h-px origin-left bg-line" />
              <div data-row-label className="flex items-baseline gap-3">
                {group.ai && <span aria-hidden className="size-2 -translate-y-1 rounded-full bg-pulse" />}
                <h3 className={cn("font-display text-2xl font-semibold tracking-[-0.03em] sm:text-3xl", group.ai && "text-pulse")}>
                  {group.category}
                </h3>
                <span className="text-sm text-muted-foreground">
                  {q ? `${group.hits}/${group.items.length}` : group.items.length}
                </span>
              </div>

              <ul className="flex flex-wrap content-start gap-2.5">
                {group.items.map(({ name, match }) => (
                  <li
                    key={name}
                    data-flip-id={`${group.category}:${name}`}
                    className={cn(
                      "rounded-full border px-4 py-2 text-[15px] transition-[opacity,border-color,background-color,color,box-shadow] duration-500",
                      match === "hit" &&
                        "border-signal bg-[color-mix(in_srgb,var(--signal)_12%,transparent)] text-foreground shadow-[0_0_24px_-6px_var(--signal)]",
                      match === "miss" && "border-line text-muted-foreground opacity-50",
                      match === "idle" &&
                        (group.ai
                          ? "border-[color-mix(in_srgb,var(--pulse)_40%,var(--line))] text-foreground"
                          : "border-line text-foreground")
                    )}
                  >
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
        <span aria-hidden className="block h-px w-full bg-line" />
      </div>
    </Section>
  )
}
