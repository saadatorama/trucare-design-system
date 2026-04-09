import { cn } from "@/lib/utils"
import { Clock, AlertTriangle } from "lucide-react"

export interface DeadlineIndicatorProps {
  /** Target date as ISO string (YYYY-MM-DD) or Date object */
  date: string | Date
  /** Optional label prefix (e.g., "Filing deadline", "Auth expires") */
  label?: string
  /** Display format. "relative" shows "3 days left", "absolute" shows the date. Default "relative". */
  format?: "relative" | "absolute"
  className?: string
}

function getUrgency(daysRemaining: number): "neutral" | "warning" | "destructive" | "expired" {
  if (daysRemaining < 0) return "expired"
  if (daysRemaining < 7) return "destructive"
  if (daysRemaining <= 30) return "warning"
  return "neutral"
}

function formatRelative(daysRemaining: number): string {
  if (daysRemaining < 0) {
    const overdue = Math.abs(daysRemaining)
    return overdue === 1 ? "1 day overdue" : `${overdue} days overdue`
  }
  if (daysRemaining === 0) return "Due today"
  if (daysRemaining === 1) return "1 day left"
  return `${daysRemaining} days left`
}

function formatAbsolute(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

const urgencyStyles = {
  neutral: {
    text: "text-muted-foreground",
    icon: "text-muted-foreground",
  },
  warning: {
    text: "text-[var(--warning-foreground)]",
    icon: "text-[var(--warning)]",
  },
  destructive: {
    text: "text-[var(--destructive)]",
    icon: "text-[var(--destructive)]",
  },
  expired: {
    text: "text-muted-foreground line-through",
    icon: "text-[var(--destructive)]",
  },
}

/**
 * Deadline/expiration indicator with urgency-based coloring.
 *
 * Serves: timely filing deadlines, prior auth expiration, appeal deadlines,
 * credentialing expiration.
 *
 * Urgency thresholds:
 * - >30 days: neutral (muted)
 * - 7–30 days: warning (amber)
 * - <7 days: destructive (red)
 * - Past due: expired (strikethrough + red icon)
 *
 * Usage:
 *   <DeadlineIndicator date="2026-05-15" label="Filing deadline" />
 *   <DeadlineIndicator date="2026-04-10" format="absolute" />
 */
export function DeadlineIndicator({
  date,
  label,
  format = "relative",
  className,
}: DeadlineIndicatorProps) {
  const targetDate = typeof date === "string" ? new Date(date + "T00:00:00") : date
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const diffMs = targetDate.getTime() - now.getTime()
  const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  const urgency = getUrgency(daysRemaining)
  const styles = urgencyStyles[urgency]
  const Icon = urgency === "destructive" || urgency === "expired" ? AlertTriangle : Clock

  const displayText = format === "relative"
    ? formatRelative(daysRemaining)
    : formatAbsolute(targetDate)

  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[13px]", styles.text, className)}>
      <Icon className={cn("h-3.5 w-3.5 shrink-0", styles.icon)} aria-hidden="true" />
      {label && <span className="font-medium">{label}:</span>}
      <span className="tabular-nums">{displayText}</span>
    </span>
  )
}
