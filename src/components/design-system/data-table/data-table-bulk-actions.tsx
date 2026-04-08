import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export interface BulkAction {
  label: string
  onClick: () => void
  icon?: ReactNode
  variant?: "default" | "destructive"
}

export interface DataTableBulkActionsProps {
  selectedCount: number
  actions: BulkAction[]
  className?: string
}

/**
 * Bulk actions bar shown when rows are selected in a DataTable.
 *
 * Usage:
 *   {selectedRows.length > 0 && (
 *     <DataTableBulkActions
 *       selectedCount={selectedRows.length}
 *       actions={[
 *         { label: "Void", onClick: handleBulkVoid, variant: "destructive" },
 *         { label: "Resubmit", onClick: handleBulkResubmit },
 *         { label: "Export", onClick: handleExport },
 *       ]}
 *     />
 *   )}
 */
export function DataTableBulkActions({
  selectedCount,
  actions,
  className,
}: DataTableBulkActionsProps) {
  if (selectedCount === 0) return null

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-md border bg-muted/50 px-3 py-2",
        className
      )}
    >
      <span className="text-[13px] font-medium tabular-nums">
        {selectedCount} selected
      </span>
      <span className="text-border" aria-hidden="true">|</span>
      <div className="flex items-center gap-1.5">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={action.onClick}
            className={cn(
              "inline-flex items-center gap-1 rounded-md px-2 py-1 text-[13px] font-medium transition-colors",
              "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
              action.variant === "destructive"
                ? "text-destructive hover:text-destructive"
                : "text-foreground"
            )}
          >
            {action.icon && (
              <span className="[&_svg]:h-3.5 [&_svg]:w-3.5">{action.icon}</span>
            )}
            {action.label}
          </button>
        ))}
      </div>
    </div>
  )
}
