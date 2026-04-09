import { cn } from "@/lib/utils"

export interface ReasonCodeDisplayProps {
  /** The reason code (e.g., "CO-45", "PR-1", "N130") */
  code: string
  /** Human-readable description */
  description: string
  /** Inline renders code + description on one line. Block puts description below. Default "inline". */
  layout?: "inline" | "block"
  className?: string
}

/**
 * Display component for CARC/RARC codes in ERA processing and denial management.
 *
 * Renders code in medium weight with tight tracking + description in regular text.
 * Codes are cryptic (e.g., CO-45) — billers need both the code and description.
 *
 * Usage:
 *   <ReasonCodeDisplay code="CO-45" description="Charge exceeds fee schedule/maximum allowable" />
 *   <ReasonCodeDisplay code="PR-1" description="Deductible amount" layout="block" />
 */
export function ReasonCodeDisplay({
  code,
  description,
  layout = "inline",
  className,
}: ReasonCodeDisplayProps) {
  if (layout === "block") {
    return (
      <div className={cn("flex flex-col gap-0.5", className)}>
        <span className="text-[13px] font-medium tabular-nums tracking-tight text-foreground">
          {code}
        </span>
        <span className="text-[12px] text-muted-foreground leading-snug">
          {description}
        </span>
      </div>
    )
  }

  return (
    <span className={cn("text-[13px]", className)}>
      <span className="font-medium tabular-nums tracking-tight text-foreground">{code}</span>
      <span className="text-muted-foreground"> — {description}</span>
    </span>
  )
}
