import * as React from "react"
import { cn } from "@/lib/utils"

type SectionProps = React.ComponentProps<"section"> & { id: string }

export function Section({ id, className, children, ...props }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn("relative scroll-mt-20 py-20 sm:py-28 lg:py-32", className)}
      {...props}
    >
      <div className="container-page">{children}</div>
    </section>
  )
}
