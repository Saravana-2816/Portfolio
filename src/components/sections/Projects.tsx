import { ExternalLink } from "lucide-react"
import { projects } from "@/data/projects"
import { Section } from "@/components/layout/Section"
import { SectionHeading } from "@/components/layout/SectionHeading"
import { Badge } from "@/components/ui/badge"

export function Projects() {
  return (
    <Section id="projects">
      <SectionHeading
        index={3}
        title="Projects"
        description="A mix of production systems and applied AI experiments."
      />

      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
        {projects.map((project, i) => (
          <article
            key={project.title}
            tabIndex={0}
            className="group relative flex min-h-[220px] flex-col overflow-hidden border border-border bg-card p-6 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-1 font-heading text-lg leading-snug font-bold transition-transform duration-300 group-hover:-translate-y-1 group-focus-within:-translate-y-1">
                  {project.title}
                </h3>
              </div>
              {project.href && (
                <a
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open ${project.title}`}
                  className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ExternalLink className="size-4" />
                </a>
              )}
            </div>

            {project.status && (
              <p className="mt-1 text-xs text-muted-foreground transition-opacity duration-300 group-hover:opacity-0 group-focus-within:opacity-0">
                {project.status}
              </p>
            )}

            <div className="relative mt-4 flex-1">
              <p className="max-w-[60ch] text-sm text-muted-foreground opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 sm:text-base translate-y-2">
                {project.description}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="font-mono text-xs font-normal text-muted-foreground">
                  {tag}
                </Badge>
              ))}
            </div>
          </article>
        ))}
      </div>
    </Section>
  )
}
