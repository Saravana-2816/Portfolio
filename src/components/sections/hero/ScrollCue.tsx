import { ChevronDown } from "lucide-react"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import { cn } from "cn"

export function ScrollCue() {
  const reducedMotion = useReducedMotion()

  return (
    <button
      onClick={() =>
        document.getElementById("about")?.scrollIntoView({ behavior: "smooth", block: "start" })
      }
      aria-label="Scroll to content"
      className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-muted-foreground transition-colors hover:text-foreground"
    >
      <ChevronDown className={cn("size-5", !reducedMotion && "animate-bounce")} />
    </button>
  )
}
