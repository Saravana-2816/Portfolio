export type SkillGroup = {
  category: string
  items: string[]
}

export const skills: SkillGroup[] = [
  {
    category: "Frontend",
    items: [
      "React",
      "React Native",
      "SCSS",
      "Tailwind CSS",
      "TypeScript",
      "JavaScript",
      "Material UI",
    ],
  },
  {
    category: "Backend",
    items: [
      "Node.js",
      "Express.js",
      "Flask",
      "REST API",
      "GraphQL",
      "FastAPI",
      "WebSockets",
      "JWT",
      "Hasura",
    ],
  },
  {
    category: "Databases",
    items: ["PostgreSQL", "MySQL", "MongoDB"],
  },
  {
    category: "Cloud & DevOps",
    items: ["Docker", "Kubernetes", "Jenkins", "AWS (IAM, Lambda, ECS, EC2, S3)"],
  },
  {
    category: "AI / ML",
    items: [
      "Machine Learning",
      "Deep Learning",
      "Generative AI",
      "RAG",
      "MCP",
      "Agentic AI",
      "CrewAI",
      "LangChain",
      "NLP",
    ],
  },
  {
    category: "Languages",
    items: ["C", "C++", "Java", "Python", "JavaScript"],
  },
]
