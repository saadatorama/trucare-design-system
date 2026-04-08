import { cn } from "@/lib/utils"
import type { ClaimStatus } from "./status-badge"

export interface TimelineItem {
  /** Optional status for colored dot. Omit for neutral. */
  status?: ClaimStatus
  label: string
  timestamp: string
  actor?: string
  note?: string
  isCurrent?: boolean
}

export interface ActivityTimelineProps {
  items: TimelineItem[]
  className?: string
}

/**
 * Status dot color from claim status tokens.
 * Falls back to muted for unknown/missing status.
 */
function getDotColor(status?: ClaimStatus): string {
  if (!status) return "var(--muted-foreground)"
  return `var(--status-${status}-text, var(--muted-foreground))`
}

/**
 * Vertical activity timeline for claim lifecycle, patient history, audit trails.
 *
 * Usage:
 *   <ActivityTimeline items={[
 *     { status: "submitted", label: "Claim submitted to Aetna", timestamp: "Mar 28, 2026 9:15 AM", actor: "Jane Smith" },
 *     { status: "accepted", label: "Accepted by clearinghouse", timestamp: "Mar 28, 2026 9:17 AM", isCurrent: true },
 *   ]} />
 */
export function ActivityTimeline({ items, className }: ActivityTimelineProps) {
  return (
    <div className={cn("flex flex-col", className)} role="list" aria-label="Activity timeline">
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        const dotColor = getDotColor(item.status)

        return (
          <div key={index} className="flex gap-3" role="listitem">
            {/* Left gutter: dot + connecting line */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "shrink-0 rounded-full mt-1",
                  item.isCurrent ? "h-2.5 w-2.5" : "h-2 w-2"
                )}
                style={{ backgroundColor: dotColor }}
                aria-hidden="true"
              />
              {!isLast && (
                <div className="w-px flex-1 bg-border min-h-[16px]" aria-hidden="true" />
              )}
            </div>

            {/* Right content */}
            <div className={cn("pb-4 min-w-0", isLast && "pb-0")}>
              <p className={cn(
                "text-[13px] leading-snug",
                item.isCurrent ? "font-semibold text-foreground" : "font-medium text-foreground"
              )}>
                {item.label}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[11px] text-muted-foreground">
                  {item.timestamp}
                </span>
                {item.actor && (
                  <>
                    <span className="text-[11px] text-muted-foreground" aria-hidden="true">·</span>
                    <span className="text-[11px] text-muted-foreground">{item.actor}</span>
                  </>
                )}
              </div>
              {item.note && (
                <p className="mt-1 text-[13px] text-muted-foreground leading-snug">
                  {item.note}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
