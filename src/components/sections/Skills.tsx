import { skills } from "@/data/skills"
import { Section } from "@/components/layout/Section"
import { SectionHeading } from "@/components/layout/SectionHeading"
import { SkillCard } from "@/components/sections/skills/SkillCard"

export function Skills() {
  return (
    <Section id="skills">
      <SectionHeading
        index={4}
        title="Skills"
        description="Core domains I work across, grouped the way I'd reach for them on a real build."
      />

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((group, i) => (
          <SkillCard key={group.category} group={group} index={i} />
        ))}
      </div>
    </Section>
  )
}
