const dots = [
  { top: "8%", left: "62%", size: 5, color: "teal", pulse: true },
  { top: "4%", left: "78%", size: 3, color: "teal" },
  { top: "16%", left: "90%", size: 3, color: "gold" },
  { top: "22%", left: "70%", size: 2, color: "teal" },
  { top: "34%", left: "95%", size: 4, color: "teal", pulse: true },
  { top: "48%", left: "84%", size: 2, color: "gold" },
  { top: "58%", left: "68%", size: 3, color: "teal" },
  { top: "62%", left: "92%", size: 2, color: "teal" },
  { top: "74%", left: "78%", size: 4, color: "gold", pulse: true },
  { top: "80%", left: "60%", size: 2, color: "teal" },
  { top: "12%", left: "50%", size: 2, color: "teal" },
  { top: "88%", left: "88%", size: 3, color: "teal" },
]

export function AmbientField() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {dots.map((dot, i) => (
        <span
          key={i}
          className={
            "absolute rounded-full opacity-40 " +
            (dot.color === "teal" ? "bg-teal" : "bg-gold") +
            (dot.pulse ? " motion-safe:animate-pulse" : "")
          }
          style={{
            top: dot.top,
            left: dot.left,
            width: dot.size,
            height: dot.size,
            boxShadow: `0 0 ${dot.size * 4}px ${dot.size}px currentColor`,
            color: dot.color === "teal" ? "var(--teal)" : "var(--gold)",
          }}
        />
      ))}
    </div>
  )
}
