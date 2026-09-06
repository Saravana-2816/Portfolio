import * as React from "react"

export function ScrollProgress() {
  const barRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement
      const scrollTop = doc.scrollTop
      const maxScroll = doc.scrollHeight - doc.clientHeight
      const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0
      if (barRef.current) {
        barRef.current.style.width = `${progress}%`
      }
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  return (
    <div className="absolute inset-x-0 bottom-0 h-0.5 overflow-hidden bg-transparent">
      <div
        ref={barRef}
        className="h-full bg-foreground transition-[width] duration-150 ease-out"
        style={{ width: "0%" }}
      />
    </div>
  )
}
