import type { ReactNode } from "react"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface BreadcrumbItem {
  label: string
  href?: string
  onClick?: () => void
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  separator?: ReactNode
  /** Max items to show before truncating middle items with ellipsis. Default 5. */
  maxItems?: number
  className?: string
}

/**
 * Breadcrumb navigation for page depth.
 *
 * Usage:
 *   <Breadcrumb items={[
 *     { label: "Claims", onClick: () => navigate("/claims") },
 *     { label: "CLM-4521", onClick: () => navigate("/claims/4521") },
 *     { label: "Appeal" },
 *   ]} />
 */
export function Breadcrumb({
  items,
  separator,
  maxItems = 5,
  className,
}: BreadcrumbProps) {
  const displayItems = items.length > maxItems
    ? [
        items[0],
        { label: "..." } as BreadcrumbItem,
        ...items.slice(items.length - (maxItems - 2)),
      ]
    : items

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex items-center gap-1">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1
          const isEllipsis = item.label === "..."
          const isClickable = !isLast && !isEllipsis && (item.href || item.onClick)

          return (
            <li key={index} className="flex items-center gap-1">
              {index > 0 && (
                <span className="text-muted-foreground" aria-hidden="true">
                  {separator ?? <ChevronRight className="h-3 w-3" />}
                </span>
              )}

              {isClickable ? (
                <button
                  onClick={item.onClick}
                  className={cn(
                    "text-[13px] text-muted-foreground hover:text-foreground transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded-sm"
                  )}
                >
                  {item.label}
                </button>
              ) : (
                <span
                  className={cn(
                    "text-[13px]",
                    isLast ? "font-medium text-foreground" : "text-muted-foreground"
                  )}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
