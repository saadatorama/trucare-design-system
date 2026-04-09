// Date formatting utilities — no external date library.
// Uses native Intl.DateTimeFormat for locale-consistent output.

function toDate(input: Date | string): Date {
  return input instanceof Date ? input : new Date(input)
}

const absoluteFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
})

const longFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
})

const shortFormatterNoYear = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
})

const shortFormatterWithYear = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
})

/**
 * Format a date in one of four modes:
 * - absolute: "Mar 28, 2026"
 * - relative: "3d ago", "2h ago", "just now"
 * - short: "Mar 28" (current year) or "Mar 28, 2025" (different year)
 * - long: "March 28, 2026"
 */
export function formatDate(
  date: Date | string,
  format: "absolute" | "relative" | "short" | "long"
): string {
  const d = toDate(date)

  switch (format) {
    case "absolute":
      return absoluteFormatter.format(d)
    case "relative":
      return formatTimeAgo(d)
    case "short":
      return isCurrentYear(d)
        ? shortFormatterNoYear.format(d)
        : shortFormatterWithYear.format(d)
    case "long":
      return longFormatter.format(d)
  }
}

/**
 * Format a date range.
 * Same year: "Mar 28 – Apr 2, 2026"
 * Different years: "Mar 28, 2025 – Apr 2, 2026"
 */
export function formatDateRange(
  start: Date | string,
  end: Date | string
): string {
  const s = toDate(start)
  const e = toDate(end)

  const sameYear = s.getFullYear() === e.getFullYear()

  if (sameYear) {
    const startStr = shortFormatterNoYear.format(s)
    const endStr = absoluteFormatter.format(e)
    return `${startStr} \u2013 ${endStr}`
  }

  const startStr = absoluteFormatter.format(s)
  const endStr = absoluteFormatter.format(e)
  return `${startStr} \u2013 ${endStr}`
}

/**
 * Human-readable time-ago string.
 * <1min: "just now", then "2m ago", "3h ago", "2d ago", "2w ago", "3mo ago", "1y ago"
 */
export function formatTimeAgo(date: Date | string): string {
  const d = toDate(date)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHr = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHr / 24)
  const diffWeek = Math.floor(diffDay / 7)
  const diffMonth = Math.floor(diffDay / 30)
  const diffYear = Math.floor(diffDay / 365)

  if (diffSec < 60) return "just now"
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHr < 24) return `${diffHr}h ago`
  if (diffDay < 7) return `${diffDay}d ago`
  if (diffWeek < 4) return `${diffWeek}w ago`
  if (diffMonth < 12) return `${diffMonth}mo ago`
  return `${diffYear}y ago`
}

/** True if the date is today in the local timezone. */
export function isToday(date: Date | string): boolean {
  const d = toDate(date)
  const now = new Date()
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  )
}

/** True if the date falls within the current ISO week (Mon-Sun). */
export function isThisWeek(date: Date | string): boolean {
  const d = toDate(date)
  const now = new Date()

  // Get start of current week (Monday)
  const startOfWeek = new Date(now)
  const dayOfWeek = now.getDay()
  const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  startOfWeek.setDate(now.getDate() - diffToMonday)
  startOfWeek.setHours(0, 0, 0, 0)

  // End of week (next Monday 00:00)
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 7)

  return d >= startOfWeek && d < endOfWeek
}

/** True if the date is in the current calendar year. */
export function isCurrentYear(date: Date | string): boolean {
  return toDate(date).getFullYear() === new Date().getFullYear()
}
