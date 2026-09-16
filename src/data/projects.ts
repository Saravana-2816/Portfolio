export type Project = {
  title: string
  status?: string
  description: string
  challenge: string
  approach: string
  outcome: string
  tags: string[]
  href?: string
}

export const projects: Project[] = [
  {
    title: "Facial Recognition Attendance System — Construction Sites",
    status: "Production — CasaGrand, DRA",
    description:
      "Marks labourer attendance and calculates working hours and wages on active construction sites. Recognition runs over a WebSocket connection using the ArcFace model, with face embeddings stored in Milvus. Included on-site deployment support at client locations.",
    challenge:
      "Construction sites needed a fast, tamper-resistant way to mark labourer attendance and calculate wages — without relying on manual registers or fixed hardware.",
    approach:
      "Built real-time face recognition over a WebSocket connection using the ArcFace model, storing face embeddings in Milvus for fast similarity search, and handled on-site deployment directly at client locations.",
    outcome:
      "Running in production at active construction sites for CasaGrand and DRA, automating attendance and wage calculation that was previously manual.",
    tags: ["Computer Vision", "WebSockets", "Milvus", "ArcFace", "Production"],
    href: "",
  },
  {
    title: "RAG-Based VC Matching Chatbot",
    description:
      "Helps startup founders and first-time entrepreneurs find the right venture capitalists for their idea through a RAG-powered chat interface, then lets the founder and VC talk directly in-platform to work toward a deal.",
    challenge:
      "First-time founders often don't know which venture capitalists actually fit their stage, sector, or thesis — most matching happens through cold outreach and guesswork.",
    approach:
      "Built a RAG-powered chat interface that retrieves relevant VC profiles based on a founder's pitch, then opens a direct in-platform conversation between founder and VC to move toward a deal.",
    outcome:
      "A working end-to-end pipeline from founder query to VC introduction, built to remove the guesswork from first-time fundraising outreach.",
    tags: ["RAG", "LLMs", "Chatbot", "Startups"],
    href: "",
  },
  {
    title: "Virtual Try-On — Fashion Recommendation System",
    description:
      "Users upload a photo of themselves and an outfit to preview the fit, plus get personalized outfit recommendations based on their taste — trained on a large Myntra fashion dataset from Kaggle.",
    challenge:
      "Online shoppers can't tell how an outfit will actually look on them, and generic recommendations rarely match personal taste.",
    approach:
      "Built a computer-vision pipeline that overlays outfits on a user's uploaded photo, paired with a recommendation model trained on a large Myntra fashion dataset from Kaggle.",
    outcome:
      "Combines fit preview and personalized recommendations in one flow, closing the gap between browsing and actually knowing what suits you.",
    tags: ["Computer Vision", "Recommendation Systems", "ML"],
    href: "",
  },
  {
    title: "Document Management System",
    status: "Drive-style",
    description:
      "A Google Drive-style clone covering document versioning and a hierarchical folder/file tree, with files stored in Amazon S3 and metadata in PostgreSQL — built to understand how production file-system design actually works.",
    challenge:
      "Wanted to understand how production-grade file storage systems actually handle versioning and hierarchy at scale, beyond just using one.",
    approach:
      "Built a Google Drive-style clone from scratch — document versioning, a hierarchical folder/file tree, files in Amazon S3, metadata in PostgreSQL.",
    outcome:
      "A working system that mirrors real production file-system design decisions, built specifically to learn by implementing rather than just reading about it.",
    tags: ["System Design", "AWS S3", "PostgreSQL"],
    href: "",
  },
]
