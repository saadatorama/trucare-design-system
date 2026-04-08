import { DeadlineIndicator, type DeadlineIndicatorProps } from "@/components/design-system/deadline-indicator"

export interface DeadlineCellProps {
  /** Target date as ISO string (YYYY-MM-DD) */
  date: string
  /** Display format. Default "relative". */
  format?: DeadlineIndicatorProps["format"]
}

/**
 * DataTable cell for deadline/expiration dates with urgency coloring.
 *
 * Usage in column definition:
 *   { accessorKey: "filingDeadline", header: "Filing Deadline",
 *     cell: ({ row }) => <DeadlineCell date={row.original.filingDeadline} /> }
 */
export function DeadlineCell({ date, format = "relative" }: DeadlineCellProps) {
  return <DeadlineIndicator date={date} format={format} />
}
