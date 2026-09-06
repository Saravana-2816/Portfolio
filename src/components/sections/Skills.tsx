import { skills } from "@/data/skills"
import { Section } from "@/components/layout/Section"
import { SectionHeading } from "@/components/layout/SectionHeading"
import { Badge } from "@/components/ui/badge"

export function Skills() {
  return (
    <Section id="skills">
      <SectionHeading title="Skills" />

      <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
        {skills.map((group) => (
          <div key={group.category}>
            <h3 className="text-sm font-medium text-muted-foreground">{group.category}</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <Badge key={item} variant="secondary" className="font-normal">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}
