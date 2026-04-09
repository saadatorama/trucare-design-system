import { cn } from "@/lib/utils"

// ─────────────────────────────────────────────────
// Claim Status — lifecycle of a claim through submission/adjudication/payment
// ─────────────────────────────────────────────────
export type ClaimStatus =
  | "draft"
  | "submitted"
  | "accepted"
  | "rejected"
  | "in-review"
  | "pending"
  | "denied"
  | "appealed"
  | "corrected"
  | "paid"
  | "partially-paid"
  | "written-off"
  | "voided"
  | "on-hold"

export const claimStatusLabels: Record<ClaimStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  accepted: "Accepted",
  rejected: "Rejected",
  "in-review": "In Review",
  pending: "Pending",
  denied: "Denied",
  appealed: "Appealed",
  corrected: "Corrected",
  paid: "Paid",
  "partially-paid": "Partially Paid",
  "written-off": "Written Off",
  voided: "Voided",
  "on-hold": "On Hold",
}

/** @deprecated Use claimStatusLabels instead. Kept for backward compatibility. */
export const statusLabels = claimStatusLabels as Record<string, string>

const claimStatusStyleMap: Record<
  ClaimStatus,
  { bg: string; text: string; border: string }
> = {
  draft: {
    bg: "var(--status-draft-bg)",
    text: "var(--status-draft-text)",
    border: "var(--status-draft-border)",
  },
  submitted: {
    bg: "var(--status-submitted-bg)",
    text: "var(--status-submitted-text)",
    border: "var(--status-submitted-border)",
  },
  accepted: {
    bg: "var(--status-accepted-bg)",
    text: "var(--status-accepted-text)",
    border: "var(--status-accepted-border)",
  },
  rejected: {
    bg: "var(--status-rejected-bg)",
    text: "var(--status-rejected-text)",
    border: "var(--status-rejected-border)",
  },
  "in-review": {
    bg: "var(--status-in-review-bg)",
    text: "var(--status-in-review-text)",
    border: "var(--status-in-review-border)",
  },
  pending: {
    bg: "var(--status-pending-bg)",
    text: "var(--status-pending-text)",
    border: "var(--status-pending-border)",
  },
  denied: {
    bg: "var(--status-denied-bg)",
    text: "var(--status-denied-text)",
    border: "var(--status-denied-border)",
  },
  appealed: {
    bg: "var(--status-pending-bg)",
    text: "var(--status-pending-text)",
    border: "var(--status-pending-border)",
  },
  corrected: {
    bg: "var(--status-corrected-bg)",
    text: "var(--status-corrected-text)",
    border: "var(--status-corrected-border)",
  },
  paid: {
    bg: "var(--status-eligible-bg)",
    text: "var(--status-eligible-text)",
    border: "var(--status-eligible-border)",
  },
  "partially-paid": {
    bg: "var(--status-partially-paid-bg)",
    text: "var(--status-partially-paid-text)",
    border: "var(--status-partially-paid-border)",
  },
  "written-off": {
    bg: "var(--status-written-off-bg)",
    text: "var(--status-written-off-text)",
    border: "var(--status-written-off-border)",
  },
  voided: {
    bg: "var(--status-voided-bg)",
    text: "var(--status-voided-text)",
    border: "var(--status-voided-border)",
  },
  "on-hold": {
    bg: "var(--status-on-hold-bg)",
    text: "var(--status-on-hold-text)",
    border: "var(--status-on-hold-border)",
  },
}

// ─────────────────────────────────────────────────
// Eligibility Status — patient coverage state at a point in time
// ─────────────────────────────────────────────────
export type EligibilityStatus = "eligible" | "ineligible" | "pending" | "unknown"

export const eligibilityStatusLabels: Record<EligibilityStatus, string> = {
  eligible: "Eligible",
  ineligible: "Ineligible",
  pending: "Pending",
  unknown: "Unknown",
}

const eligibilityStatusStyleMap: Record<
  EligibilityStatus,
  { bg: string; text: string; border: string }
> = {
  eligible: {
    bg: "var(--status-eligible-bg)",
    text: "var(--status-eligible-text)",
    border: "var(--status-eligible-border)",
  },
  ineligible: {
    bg: "var(--status-denied-bg)",
    text: "var(--status-denied-text)",
    border: "var(--status-denied-border)",
  },
  pending: {
    bg: "var(--status-pending-bg)",
    text: "var(--status-pending-text)",
    border: "var(--status-pending-border)",
  },
  unknown: {
    bg: "var(--status-voided-bg)",
    text: "var(--status-voided-text)",
    border: "var(--status-voided-border)",
  },
}

// ─────────────────────────────────────────────────
// Shared Badge Renderer
// ─────────────────────────────────────────────────
interface BadgeBaseProps {
  styles: { bg: string; text: string; border: string }
  label: string
  size?: "sm" | "md"
  dot?: boolean
  className?: string
}

function BadgeBase({ styles, label, size = "md", dot = false, className }: BadgeBaseProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border font-medium",
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
      {label}
    </span>
  )
}

// ─────────────────────────────────────────────────
// StatusBadge — Claim lifecycle statuses
// ─────────────────────────────────────────────────
export interface StatusBadgeProps {
  status: ClaimStatus
  size?: "sm" | "md"
  className?: string
  dot?: boolean
}

export function StatusBadge({ status, size, className, dot }: StatusBadgeProps) {
  const styles = claimStatusStyleMap[status]
  const label = claimStatusLabels[status]
  return <BadgeBase styles={styles} label={label} size={size} dot={dot} className={className} />
}

// ─────────────────────────────────────────────────
// EligibilityBadge — Patient coverage status
// ─────────────────────────────────────────────────
export interface EligibilityBadgeProps {
  status: EligibilityStatus
  size?: "sm" | "md"
  className?: string
  dot?: boolean
}

export function EligibilityBadge({ status, size, className, dot }: EligibilityBadgeProps) {
  const styles = eligibilityStatusStyleMap[status]
  const label = eligibilityStatusLabels[status]
  return <BadgeBase styles={styles} label={label} size={size} dot={dot} className={className} />
}
