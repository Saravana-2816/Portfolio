import "@fontsource-variable/bricolage-grotesque"
import "@fontsource-variable/jetbrains-mono"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"
import { ScrollTrigger } from "@/lib/gsap"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
)

document.fonts.ready.then(() => ScrollTrigger.refresh())
