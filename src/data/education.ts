export type EducationEntry = {
  school: string
  location?: string
  credential: string
  /** Shown as given in the résumé */
  score: string
  /** The headline number and its scale, split for display */
  figure: string
  scale: string
}

export const education: EducationEntry[] = [
  {
    school: "Rajalakshmi Engineering College",
    location: "Chennai",
    credential: "B.Tech, Artificial Intelligence & Machine Learning",
    score: "CGPA 8.54/10",
    figure: "8.54",
    scale: "/10 CGPA",
  },
  {
    school: "Zion Matriculation Higher Secondary School",
    credential: "HSC",
    score: "573/600 (95.5%)",
    figure: "573",
    scale: "/600 (95.5%)",
  },
]
