import { cn } from "cn"
import { skills } from "@/data/skills"
import { Section } from "@/components/layout/Section"
import { SectionHeading } from "@/components/layout/SectionHeading"
import { Badge } from "@/components/ui/badge"

export function Skills() {
  return (
    <Section id="skills">
      <SectionHeading
        index={4}
        title="Skills"
        description="Core domains I work across, grouped the way I'd reach for them on a real build."
      />

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((group, i) => {
          const accentText = i % 2 === 0 ? "text-teal" : "text-gold"
          const accentBorder = i % 2 === 0 ? "border-teal" : "border-gold"

          return (
            <article key={group.category} className="glass-panel glass-panel-hover rounded-xl p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span
                  className={cn(
                    "border px-2 py-0.5 font-mono text-[11px] uppercase tracking-wide",
                    accentBorder,
                    accentText
                  )}
                >
                  {group.code} // {group.category}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                  {group.descriptor}
                </span>
              </div>

              <h3 className="mt-4 font-heading text-lg leading-snug font-bold">{group.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{group.description}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <Badge
                    key={item}
                    variant="outline"
                    className={cn(
                      "font-mono text-xs font-normal",
                      item === group.flagship && [accentBorder, accentText]
                    )}
                  >
                    {item}
                  </Badge>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-border pt-3">
                <span className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                  {group.footNote}
                </span>
                <span className={cn("font-mono text-[11px] font-medium uppercase tracking-wide", accentText)}>
                  {group.highlight}
                </span>
              </div>
            </article>
          )
        })}
      </div>
    </Section>
  )
}
