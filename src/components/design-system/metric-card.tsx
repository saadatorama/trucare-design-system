import type * as React from "react"
import { ArrowUp, ArrowDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

export interface MetricCardProps {
  title: string
  value: string | number
  change?: { value: number; label: string }
  /** When true, a negative change is good (green) and positive is bad (red). Use for metrics like "Denial Rate" or "Days in AR". */
  invertTrend?: boolean
  icon?: React.ReactNode
  className?: string
}

export function MetricCard({
  title,
  value,
  change,
  invertTrend = false,
  icon,
  className,
}: MetricCardProps) {
  const rawPositive = change ? change.value >= 0 : undefined
  const isPositive = invertTrend ? !rawPositive : rawPositive

  return (
    <Card className={cn("p-4", className)}>
      <div className="flex items-start justify-between">
        <p className="text-[13px] font-medium uppercase tracking-wider text-muted-foreground">
          {title}
        </p>
        {icon && (
          <span className="text-muted-foreground [&_svg]:h-4 [&_svg]:w-4">
            {icon}
          </span>
        )}
      </div>

      <div className="mt-2 flex items-end gap-2">
        <span className="text-2xl font-semibold tabular-nums">
          {value}
        </span>

        {change && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-[13px] font-medium",
              isPositive ? "text-[var(--status-eligible-text)]" : "text-[var(--status-denied-text)]"
            )}
          >
            {isPositive ? (
              <ArrowUp className="h-3.5 w-3.5" aria-label="Increased" />
            ) : (
              <ArrowDown className="h-3.5 w-3.5" aria-label="Decreased" />
            )}
            {Math.abs(change.value)}%
          </span>
        )}
      </div>

      {change?.label && (
        <p className="mt-1 text-[13px] text-muted-foreground">
          {change.label}
        </p>
      )}
    </Card>
  )
}
