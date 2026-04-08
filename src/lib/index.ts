/**
 * TruCare Utilities — Barrel Export
 *
 * Import utility functions from this single entry point:
 *   import { cn, toast, formatDate, iconLibrary } from "@/lib"
 */

export { cn } from "./utils"
export { copyToClipboard } from "./copy-to-clipboard"
export { toast } from "./toast"
export {
  formatDate,
  formatDateRange,
  formatTimeAgo,
  isToday,
  isThisWeek,
  isCurrentYear,
} from "./date-format"
export { iconLibrary } from "./icons"
export type { IconCategory } from "./icons"
