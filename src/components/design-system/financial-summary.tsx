import { cn } from "@/lib/utils"

export interface FinancialLineItem {
  label: string
  amount: number
  type?: "charge" | "adjustment" | "payment" | "balance"
  /** When true, renders as a bold total/subtotal row with a top border. */
  isTotal?: boolean
}

export interface FinancialSummaryProps {
  items: FinancialLineItem[]
  /** Show a calculated total row at the bottom. Default false. */
  showTotal?: boolean
  /** Label for the auto-calculated total row. Default "Balance Due". */
  totalLabel?: string
  className?: string
}

/**
 * Formats amount in accounting convention:
 * - Positive: $1,234.56
 * - Negative: ($1,234.56) in parentheses, NOT minus sign
 * - Zero: $0.00
 */
function formatAmount(value: number): string {
  const abs = Math.abs(value)
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(abs)

  if (value < 0) return `(${formatted})`
  return formatted
}

/**
 * Financial summary / ledger display for claims, ERA details, patient accounts.
 *
 * Right-aligned amounts with tabular-nums. Negative amounts in parentheses
 * (accounting convention). Subtotal rows with top border. Bold total row.
 *
 * Usage:
 *   <FinancialSummary
 *     items={[
 *       { label: "Billed Amount", amount: 1250.00, type: "charge" },
 *       { label: "Contractual Adjustment", amount: -450.00, type: "adjustment" },
 *       { label: "Insurance Payment", amount: -640.00, type: "payment" },
 *     ]}
 *     showTotal
 *     totalLabel="Patient Responsibility"
 *   />
 */
export function FinancialSummary({
  items,
  showTotal = false,
  totalLabel = "Balance Due",
  className,
}: FinancialSummaryProps) {
  const total = items.reduce((sum, item) => sum + item.amount, 0)

  return (
    <div className={cn("flex flex-col", className)}>
      {items.map((item, index) => (
        <div
          key={index}
          className={cn(
            "flex items-center justify-between py-1.5 gap-4",
            item.isTotal && "border-t border-border pt-2 mt-1",
          )}
        >
          <span
            className={cn(
              "text-[13px]",
              item.isTotal ? "font-semibold text-foreground" : "text-muted-foreground"
            )}
          >
            {item.label}
          </span>
          <span
            className={cn(
              "text-[13px] tabular-nums text-right shrink-0",
              item.isTotal && "font-semibold",
              item.amount < 0 && !item.isTotal && "text-muted-foreground",
              item.amount >= 0 && !item.isTotal && "text-foreground",
              item.isTotal && "text-foreground"
            )}
          >
            {formatAmount(item.amount)}
          </span>
        </div>
      ))}

      {showTotal && (
        <div className="flex items-center justify-between py-1.5 gap-4 border-t-2 border-foreground/20 pt-2 mt-1">
          <span className="text-[13px] font-semibold text-foreground">
            {totalLabel}
          </span>
          <span className="text-[13px] font-semibold tabular-nums text-right text-foreground">
            {formatAmount(total)}
          </span>
        </div>
      )}
    </div>
  )
}
