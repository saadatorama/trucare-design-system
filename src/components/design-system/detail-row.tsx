import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Copyable } from "@/components/design-system/copyable"

export interface DetailRowProps {
  label: string
  value: ReactNode
  copyable?: boolean
  mono?: boolean
  /** Applies tabular-nums WITHOUT monospace font. Use for currency, percentages, phone numbers. */
  tabularNums?: boolean
  /** When true, auto-clears clipboard after copy. Use for PHI fields (SSN, MRN, DOB, member ID). */
  sensitive?: boolean
  className?: string
}

export function DetailRow({
  label,
  value,
  copyable = false,
  mono = false,
  tabularNums = false,
  sensitive = false,
  className,
}: DetailRowProps) {
  const valueContent = (
    <span
      className={cn(
        "text-[13px] text-foreground",
        mono && "font-mono tabular-nums",
        !mono && tabularNums && "tabular-nums"
      )}
    >
      {value}
    </span>
  )

  return (
    <div className={cn("flex items-baseline py-1.5 gap-2", className)}>
      <span className="text-[13px] text-muted-foreground min-w-[120px] shrink-0">
        {label}
      </span>
      {copyable && typeof value === "string" ? (
        <Copyable value={value} sensitive={sensitive}>{valueContent}</Copyable>
      ) : (
        valueContent
      )}
    </div>
  )
}
