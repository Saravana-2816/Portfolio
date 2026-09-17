import * as React from "react"
import { cn } from "@/lib/utils"
import { useMagnetic } from "@/hooks/useMagnetic"

type PillButtonProps = {
  variant?: "solid" | "ghost"
  className?: string
  children: React.ReactNode
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  type?: "button" | "submit"
  disabled?: boolean
}

/**
 * The site's one button shape. Hover sends a fill up from below the label,
 * and the label rolls to a fresh copy of itself.
 */
export function PillButton({
  variant = "solid",
  className,
  children,
  type = "button",
  ...props
}: PillButtonProps) {
  const ref = useMagnetic<HTMLButtonElement>(0.22)

  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "group/pill touch-target relative isolate inline-flex h-12 items-center justify-center overflow-hidden rounded-full px-6 text-[0.95rem] font-medium whitespace-nowrap transition-colors duration-500 ease-(--ease-out-expo) disabled:pointer-events-none disabled:opacity-60",
        variant === "solid"
          ? "bg-foreground text-background"
          : "border border-line-strong text-foreground hover:border-signal hover:text-background",
        className
      )}
      {...props}
    >
      <span
        aria-hidden
        className="absolute inset-0 -z-10 translate-y-[101%] rounded-[inherit] bg-signal transition-transform duration-600 ease-(--ease-out-expo) group-hover/pill:translate-y-0 group-focus-visible/pill:translate-y-0"
      />
      <span className="relative flex h-[1.4em] flex-col overflow-hidden">
        <span className="flex items-center gap-2 transition-transform duration-600 ease-(--ease-out-expo) group-hover/pill:-translate-y-full">
          {children}
        </span>
        <span
          aria-hidden
          className="absolute top-full left-0 flex items-center gap-2 transition-transform duration-600 ease-(--ease-out-expo) group-hover/pill:-translate-y-full"
        >
          {children}
        </span>
      </span>
    </button>
  )
}
