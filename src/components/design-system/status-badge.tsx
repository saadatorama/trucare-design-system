import { cn } from "@/lib/utils"

export type ClaimStatus =
  | "eligible"
  | "pending"
  | "denied"
  | "submitted"
  | "in-review"
  | "paid"
  | "appealed"
  | "ineligible"

export const statusLabels: Record<ClaimStatus, string> = {
  eligible: "Eligible",
  pending: "Pending",
  denied: "Denied",
  submitted: "Submitted",
  "in-review": "In Review",
  paid: "Paid",
  appealed: "Appealed",
  ineligible: "Ineligible",
}

/**
 * Maps each claim status to a CSS custom property group for bg, text, and border.
 */
const statusStyleMap: Record<
  ClaimStatus,
  { bg: string; text: string; border: string }
> = {
  eligible: {
    bg: "var(--status-eligible-bg)",
    text: "var(--status-eligible-text)",
    border: "var(--status-eligible-border)",
  },
  paid: {
    bg: "var(--status-eligible-bg)",
    text: "var(--status-eligible-text)",
    border: "var(--status-eligible-border)",
  },
  pending: {
    bg: "var(--status-pending-bg)",
    text: "var(--status-pending-text)",
    border: "var(--status-pending-border)",
  },
  appealed: {
    bg: "var(--status-pending-bg)",
    text: "var(--status-pending-text)",
    border: "var(--status-pending-border)",
  },
  denied: {
    bg: "var(--status-denied-bg)",
    text: "var(--status-denied-text)",
    border: "var(--status-denied-border)",
  },
  ineligible: {
    bg: "var(--status-denied-bg)",
    text: "var(--status-denied-text)",
    border: "var(--status-denied-border)",
  },
  submitted: {
    bg: "var(--status-submitted-bg)",
    text: "var(--status-submitted-text)",
    border: "var(--status-submitted-border)",
  },
  "in-review": {
    bg: "var(--status-in-review-bg)",
    text: "var(--status-in-review-text)",
    border: "var(--status-in-review-border)",
  },
}

export interface StatusBadgeProps {
  status: ClaimStatus
  size?: "sm" | "md"
  className?: string
  dot?: boolean
}

export function StatusBadge({
  status,
  size = "md",
  className,
  dot = false,
}: StatusBadgeProps) {
  const styles = statusStyleMap[status]

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium capitalize",
        size === "sm" && "h-5 px-1.5 text-[11px]",
        size === "md" && "h-6 px-2 text-xs",
        className
      )}
      style={{
        backgroundColor: styles.bg,
        color: styles.text,
        borderColor: styles.border,
      }}
    >
      {dot && (
        <span
          className="inline-block h-1 w-1 shrink-0 rounded-full"
          style={{ backgroundColor: styles.text }}
          aria-hidden="true"
        />
      )}
      {statusLabels[status]}
    </span>
  )
}
