import { site } from "@/data/site"

const note = {
  name: site.name,
  role: "Full-Stack Developer",
  focus: "AI Engineer at heart",
  based_in: "Chennai, India",
  stack: ["React", "Node.js", "Python", "PostgreSQL"],
  currently_building: "RAG pipelines & agentic AI systems",
  interests: ["System Design", "Agentic AI", "Open Source", "Distributed Systems"],
  status: "open_to_opportunities",
}

const json = JSON.stringify(note, null, 2)

const trafficLights = [
  { color: "#ff5f57", label: "Close" },
  { color: "#febc2e", label: "Minimize" },
  { color: "#28c840", label: "Maximize" },
]

export function CodePanel() {
  return (
    <div className="glass-panel hidden overflow-hidden rounded-xl lg:block">
      <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
        {trafficLights.map((light) => (
          <span
            key={light.label}
            aria-hidden
            className="size-2.5 rounded-full"
            style={{ backgroundColor: light.color }}
          />
        ))}
        <span className="ml-2 font-mono text-[11px] text-muted-foreground">about.json</span>
      </div>
      <pre className="overflow-x-auto p-5 font-mono text-[12.5px] leading-relaxed text-foreground">
        <code>
          {json}
          <span className="ml-0.5 inline-block h-3 w-1.5 translate-y-0.5 bg-foreground motion-safe:animate-pulse" />
        </code>
      </pre>
    </div>
  )
}
