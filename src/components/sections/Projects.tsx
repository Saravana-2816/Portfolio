import { projects } from "@/data/projects"
import { Section } from "@/components/layout/Section"
import { SectionHeading } from "@/components/layout/SectionHeading"
import { ProjectCard } from "@/components/sections/projects/ProjectCard"

// Wide, two tall, wide: production work leads, the rhythm never repeats twice in a row.
const LAYOUTS = ["wide", "tall", "tall", "wide-reverse"] as const

export function Projects() {
  return (
    <Section id="projects">
      <SectionHeading
        id="projects-title"
        title="Selected work"
        intro="Production systems and applied AI, each sketched as the system it actually is."
      />

      <div className="mt-16 grid grid-cols-1 gap-5 sm:mt-24 md:grid-cols-2 lg:gap-6">
        {projects.map((project, i) => (
          <ProjectCard key={project.title} project={project} layout={LAYOUTS[i % LAYOUTS.length]} />
        ))}
      </div>
    </Section>
  )
}
