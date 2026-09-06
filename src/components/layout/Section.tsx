import * as React from "react"
import { cn } from "cn"

type SectionProps = React.ComponentProps<"section"> & {
  id: string
}

export function Section({ id, className, children, ...props }: SectionProps) {
  return (
    <section
      id={id}
      className={cn("mx-auto max-w-[1120px] px-4 py-20 sm:px-6 sm:py-28", className)}
      {...props}
    >
      {children}
    </section>
  )
}
