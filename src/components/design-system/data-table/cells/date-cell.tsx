export interface DateCellProps {
  value: string | Date
  relative?: boolean
}

function formatRelativeDate(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHr = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHr / 24)
  const diffWeek = Math.floor(diffDay / 7)

  if (diffSec < 60) return "just now"
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHr < 24) return `${diffHr}h ago`
  if (diffDay < 7) return `${diffDay}d ago`
  if (diffWeek < 4) return `${diffWeek}w ago`

  return formatAbsoluteDate(date)
}

function formatAbsoluteDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function DateCell({ value, relative = false }: DateCellProps) {
  const date = value instanceof Date ? value : new Date(value)

  const displayText = relative
    ? formatRelativeDate(date)
    : formatAbsoluteDate(date)

  return (
    <span
      className="text-[13px] text-muted-foreground"
      title={date.toISOString()}
    >
      {displayText}
    </span>
  )
}
