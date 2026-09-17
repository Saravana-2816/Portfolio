export type ProjectDiagram = "attendance" | "rag" | "tryon" | "drive"

export type Project = {
  title: string
  /** Shown beside the title, e.g. where it runs or what it resembles */
  qualifier?: string
  production?: boolean
  description: string
  tags: string[]
  diagram: ProjectDiagram
  /** Leave empty until a live or repo link exists; the link button hides itself */
  href?: string
}

export const projects: Project[] = [
  {
    title: "Facial Recognition Attendance System — Construction Sites",
    qualifier: "Production — CasaGrand, DRA",
    production: true,
    description:
      "Marks labourer attendance and calculates working hours and wages on active construction sites. Recognition runs over a WebSocket connection using the ArcFace model, with face embeddings stored in Milvus. Included on-site deployment support at client locations.",
    tags: ["Computer Vision", "WebSockets", "Milvus", "ArcFace", "Production"],
    diagram: "attendance",
    href: "",
  },
  {
    title: "RAG-Based VC Matching Chatbot",
    description:
      "Helps startup founders and first-time entrepreneurs find the right venture capitalists for their idea through a RAG-powered chat interface, then lets the founder and VC talk directly in-platform to work toward a deal.",
    tags: ["RAG", "LLMs", "Chatbot", "Startups"],
    diagram: "rag",
    href: "",
  },
  {
    title: "Virtual Try-On — Fashion Recommendation System",
    description:
      "Users upload a photo of themselves and an outfit to preview the fit, plus get personalized outfit recommendations based on their taste — trained on a large Myntra fashion dataset from Kaggle.",
    tags: ["Computer Vision", "Recommendation Systems", "ML"],
    diagram: "tryon",
    href: "",
  },
  {
    title: "Document Management System",
    qualifier: "Drive-style",
    description:
      "A Google Drive-style clone covering document versioning and a hierarchical folder/file tree, with files stored in Amazon S3 and metadata in PostgreSQL — built to understand how production file-system design actually works.",
    tags: ["System Design", "AWS S3", "PostgreSQL"],
    diagram: "drive",
    href: "",
  },
]
