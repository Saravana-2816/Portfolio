export type ExperienceEntry = {
  company: string
  location?: string
  role: string
  period: string
  note?: string
  current?: boolean
  points: string[]
  tools: string[]
}

export const experience: ExperienceEntry[] = [
  {
    company: "Slate.AI",
    location: "Bangalore",
    role: "Junior Software Developer",
    period: "Jan 2026 – Present",
    current: true,
    points: [
      "Building modules across the mobile app (React Native) and web app (React), owning both frontend and backend implementation.",
      "Also handles basic DevOps as part of the role — containerizing services and working with Kubernetes.",
    ],
    tools: [
      "React",
      "React Native",
      "TypeScript",
      "JavaScript",
      "SCSS",
      "Node.js/Express",
      "GraphQL",
      "Hasura",
      "PostgreSQL",
      "REST API",
      "Docker",
      "Kubernetes",
      "Python",
      "FastAPI",
    ],
  },
  {
    company: "Kenesis",
    role: "AI Intern",
    period: "Jul 2025 – Oct 2025",
    note: "4 months, during college",
    points: [
      "Worked on AI/agentic systems using Python, Pydantic, FastAPI, and Flask.",
      "Built with agentic AI frameworks including LangChain and CrewAI.",
    ],
    tools: ["Python", "Pydantic", "FastAPI", "Flask", "LangChain", "CrewAI"],
  },
]
