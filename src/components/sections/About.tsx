import * as React from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "@/lib/gsap"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import { useMaskedReveal } from "@/hooks/useMaskedReveal"
import { Section } from "@/components/layout/Section"
import { SectionHeading } from "@/components/layout/SectionHeading"

const stats = [
  { value: 4, suffix: "+", label: "Projects shipped" },
  { value: 2, suffix: "", label: "Teams worked with" },
  { value: 8.54, suffix: "", label: "CGPA / 10", decimals: 2 },
  { value: 0, suffix: "", label: "Core focus", display: "Backend + AI" },
]

const bio =
  "Hi, I'm Saravanakumar KS — a Full-Stack Developer by role, and an AI Engineer at heart. Day to day, I build across the stack with React, React Native, Node.js, GraphQL, and PostgreSQL, but where I really lean in is backend engineering and AI: I've built production RAG pipelines, fine-tuned lightweight LLaMA models, and worked hands-on with MCP tools and agentic AI frameworks — all backed by a strong foundation in Machine Learning and Deep Learning. I'm currently deepening my System Design skills to architect things that scale, with practical DevOps experience in Docker, Kubernetes, and Jenkins to back it up. For me, good engineering doesn't stop at \"it works\" — it has to ship, and it has to scale."

function StatCard({ stat }: { stat: (typeof stats)[number] }) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const reducedMotion = useReducedMotion()

  useGSAP(
    () => {
      if (stat.display || !ref.current) return

      if (reducedMotion) {
        ref.current.textContent = stat.value.toFixed(stat.decimals ?? 0) + stat.suffix
        return
      }

      const counter = { val: 0 }
      gsap.to(counter, {
        val: stat.value,
        duration: 1.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          once: true,
        },
        onUpdate: () => {
          if (ref.current) {
            ref.current.textContent = counter.val.toFixed(stat.decimals ?? 0) + stat.suffix
          }
        },
      })
    },
    { scope: ref, dependencies: [reducedMotion] }
  )

  return (
    <div className="border-t border-border pt-4">
      <p className="font-heading text-4xl font-extrabold leading-none sm:text-5xl">
        {stat.display ?? (
          <span ref={ref}>
            0{stat.suffix}
          </span>
        )}
      </p>
      <p className="mt-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
        {stat.label}
      </p>
    </div>
  )
}

export function About() {
  const bioRef = useMaskedReveal<HTMLParagraphElement>()

  return (
    <Section id="about">
      <SectionHeading index={1} title="About" />
      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr]">
        <p
          ref={bioRef}
          className="max-w-[75ch] text-base leading-relaxed text-muted-foreground opacity-0 sm:text-lg"
        >
          {bio}
        </p>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>
      </div>
    </Section>
  )
}
