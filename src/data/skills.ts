export type SkillGroup = {
  code: string
  category: string
  descriptor: string
  title: string
  description: string
  items: string[]
  flagship: string
  footNote: string
  highlight: string
}

export const skills: SkillGroup[] = [
  {
    code: "01",
    category: "Frontend",
    descriptor: "Component-Driven",
    title: "Frontend & Interfaces",
    description:
      "React and React Native interfaces, styled with Tailwind and SCSS, typed end-to-end with TypeScript.",
    items: ["React", "React Native", "SCSS", "Tailwind CSS", "TypeScript", "JavaScript", "Material UI"],
    flagship: "React Native",
    footNote: "Web + mobile, one codebase",
    highlight: "SHIPPED AT SLATE.AI",
  },
  {
    code: "02",
    category: "Backend",
    descriptor: "APIs & Auth",
    title: "Backend & APIs",
    description:
      "REST and GraphQL services with Node.js, Express, and FastAPI, real-time over WebSockets, secured with JWT.",
    items: ["Node.js", "Express.js", "Flask", "REST API", "GraphQL", "FastAPI", "WebSockets", "JWT", "Hasura"],
    flagship: "GraphQL",
    footNote: "Real-time & request-driven",
    highlight: "IN PRODUCTION",
  },
  {
    code: "03",
    category: "Databases",
    descriptor: "SQL + NoSQL",
    title: "Databases & Storage",
    description:
      "Relational modeling in PostgreSQL and MySQL, document storage in MongoDB, chosen to fit the access pattern.",
    items: ["PostgreSQL", "MySQL", "MongoDB"],
    flagship: "PostgreSQL",
    footNote: "Schema-first by default",
    highlight: "POSTGRESQL FIRST",
  },
  {
    code: "04",
    category: "Cloud & DevOps",
    descriptor: "Kubernetes-Ready",
    title: "Cloud & DevOps",
    description:
      "Containerized services with Docker and Kubernetes, CI pipelines through Jenkins, deployed on AWS.",
    items: ["Docker", "Kubernetes", "Jenkins", "AWS (IAM, Lambda, ECS, EC2, S3)"],
    flagship: "Kubernetes",
    footNote: "Containers, not servers",
    highlight: "DOCKER + K8S",
  },
  {
    code: "05",
    category: "AI / ML",
    descriptor: "RAG & Agentic AI",
    title: "AI & Machine Learning",
    description:
      "Production RAG pipelines, fine-tuned LLaMA models, and agentic workflows with LangChain and CrewAI.",
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
    flagship: "RAG",
    footNote: "Retrieval + generation",
    highlight: "PRODUCTION RAG",
  },
  {
    code: "06",
    category: "Languages",
    descriptor: "Systems & Scripting",
    title: "Core Languages",
    description:
      "Python for AI and backend work, C and C++ for fundamentals, Java for object-oriented systems.",
    items: ["C", "C++", "Java", "Python", "JavaScript"],
    flagship: "Python",
    footNote: "Five languages, one habit",
    highlight: "PYTHON-FIRST",
  },
]
