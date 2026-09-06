import { projects } from "@/data/projects"
import { Section } from "@/components/layout/Section"
import { SectionHeading } from "@/components/layout/SectionHeading"
import { ProjectCard } from "@/components/sections/projects/ProjectCard"

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
          <ProjectCard key={project.title} project={project} index={i} />
        ))}
      </div>
    </Section>
  )
}
