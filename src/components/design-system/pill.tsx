import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const PILL_STYLES: Record<string, { bg: string; text: string }> = {
  neutral: { bg: "var(--pill-neutral-bg)", text: "var(--pill-neutral-text)" },
  gray: { bg: "var(--pill-neutral-bg)", text: "var(--pill-neutral-text)" },
  violet: { bg: "var(--pill-violet-bg)", text: "var(--pill-violet-text)" },
  blue: { bg: "var(--pill-blue-bg)", text: "var(--pill-blue-text)" },
  teal: { bg: "var(--pill-teal-bg)", text: "var(--pill-teal-text)" },
  success: { bg: "var(--pill-success-bg)", text: "var(--pill-success-text)" },
  warning: { bg: "var(--pill-warning-bg)", text: "var(--pill-warning-text)" },
  destructive: { bg: "var(--pill-destructive-bg)", text: "var(--pill-destructive-text)" },
}

export interface PillProps {
  children: React.ReactNode
  color?: keyof typeof PILL_STYLES
  size?: "sm" | "md"
  /** "pill" = rounded-full (default), "rounded" = rounded-md (6px) for a more squared look */
  shape?: "pill" | "rounded"
  removable?: boolean
  onRemove?: () => void
  className?: string
}

export function Pill({
  children,
  color = "neutral",
  size = "md",
  shape = "pill",
  removable = false,
  onRemove,
  className,
}: PillProps) {
  const styles = PILL_STYLES[color]

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-medium select-none",
        shape === "pill" ? "rounded-full" : "rounded-md",
        size === "sm" && "h-5 px-1.5 text-[11px]",
        size === "md" && "h-6 px-2 text-xs",
        className
      )}
      style={{ backgroundColor: styles.bg, color: styles.text }}
    >
      {children}
      {removable && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove?.()
          }}
          aria-label={`Remove ${typeof children === "string" ? children : ""}`}
          className={cn(
            "inline-flex items-center justify-center hover:opacity-70 transition-opacity -mr-0.5",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
            shape === "pill" ? "rounded-full" : "rounded-sm"
          )}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  )
}
