import { ExternalLink } from "lucide-react"
import type { Project } from "@/data/projects"
import { useBrightenReveal } from "@/hooks/useBrightenReveal"
import { Badge } from "@/components/ui/badge"

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const descriptionRef = useBrightenReveal<HTMLParagraphElement>()

  return (
    <article
      tabIndex={0}
      className="glass-panel glass-panel-hover group relative flex min-h-[220px] flex-col rounded-xl p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs text-muted-foreground">{String(index + 1).padStart(2, "0")}</p>
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

      {project.status && <p className="mt-1 text-xs text-muted-foreground">{project.status}</p>}

      <p
        ref={descriptionRef}
        className="mt-4 max-w-[60ch] flex-1 text-sm text-muted-foreground sm:text-base"
      >
        {project.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <Badge key={tag} variant="outline" className="font-mono text-xs font-normal text-muted-foreground">
            {tag}
          </Badge>
        ))}
      </div>
    </article>
  )
}
