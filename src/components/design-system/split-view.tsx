import type { ReactNode } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface SplitViewProps {
  list: ReactNode
  detail: ReactNode
  detailOpen: boolean
  onClose: () => void
  /** Grid ratio when detail is open. Default "2:1". */
  ratio?: "2:1" | "1:1" | "1:2"
  /** Title shown in the detail panel header. */
  detailTitle?: string
  className?: string
}

const ratioClasses = {
  "2:1": "grid-cols-[2fr_1fr]",
  "1:1": "grid-cols-[1fr_1fr]",
  "1:2": "grid-cols-[1fr_2fr]",
}

/**
 * Side-by-side split view for list + detail patterns.
 *
 * Unlike DetailPanel (Sheet overlay), SplitView keeps both panels visible
 * simultaneously. Use for high-volume workflows like claims processing
 * where billers need to see the list while reviewing details.
 *
 * Usage:
 *   <SplitView
 *     list={<ClaimsTable onRowClick={setSelected} />}
 *     detail={<ClaimDetail claim={selected} />}
 *     detailOpen={!!selected}
 *     onClose={() => setSelected(null)}
 *     detailTitle="Claim Detail"
 *   />
 */
export function SplitView({
  list,
  detail,
  detailOpen,
  onClose,
  ratio = "2:1",
  detailTitle,
  className,
}: SplitViewProps) {
  return (
    <div
      className={cn(
        "grid min-h-0 transition-[grid-template-columns] duration-[var(--duration-slow,250ms)] ease-[var(--ease-default,cubic-bezier(0.4,0,0.2,1))]",
        detailOpen ? ratioClasses[ratio] : "grid-cols-[1fr]",
        className
      )}
    >
      {/* List panel */}
      <div className="min-h-0 overflow-y-auto">{list}</div>

      {/* Detail panel */}
      {detailOpen && (
        <div className="min-h-0 overflow-y-auto border-l bg-card">
          {/* Sticky header */}
          <div className="sticky top-0 z-[var(--z-sticky,10)] flex items-center justify-between border-b bg-card px-4 py-3">
            {detailTitle && (
              <h3 className="text-[14px] font-medium text-foreground truncate">
                {detailTitle}
              </h3>
            )}
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={onClose}
              aria-label="Close detail panel"
              className="ml-auto shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Detail content */}
          <div className="p-4">{detail}</div>
        </div>
      )}
    </div>
  )
}
