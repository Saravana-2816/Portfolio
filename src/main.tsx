import "@fontsource-variable/space-grotesk"
import "@fontsource-variable/inter"
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

document.addEventListener("visibilitychange", () => {
  document.body.classList.toggle("tab-hidden", document.hidden)
})
