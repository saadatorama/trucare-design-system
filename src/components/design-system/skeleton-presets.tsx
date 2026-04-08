import { cn } from "@/lib/utils"
import { Skeleton } from "./skeleton"

/**
 * Matches MetricCard layout: title line + big number + small change line.
 */
export function MetricCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-md border bg-card p-4", className)}>
      {/* Title row */}
      <div className="flex items-start justify-between">
        <Skeleton variant="rectangular" width={100} height={12} />
        <Skeleton variant="rectangular" width={16} height={16} />
      </div>
      {/* Big number */}
      <div className="mt-2">
        <Skeleton variant="rectangular" width={120} height={28} />
      </div>
      {/* Change line */}
      <div className="mt-1">
        <Skeleton variant="rectangular" width={80} height={12} />
      </div>
    </div>
  )
}

/**
 * N rectangular cells in a flex row, matching table row layout.
 */
export function TableRowSkeleton({
  columns,
  className,
}: {
  columns: number
  className?: string
}) {
  return (
    <div className={cn("flex items-center gap-4 px-4 py-3", className)}>
      {Array.from({ length: columns }, (_, i) => (
        <Skeleton
          key={i}
          variant="rectangular"
          height={14}
          className="flex-1"
        />
      ))}
    </div>
  )
}

/**
 * Label rectangle (80px wide) + full-width input rectangle (h-9).
 */
export function FormFieldSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Skeleton variant="rectangular" width={80} height={14} />
      <Skeleton variant="rectangular" width="100%" height={36} />
    </div>
  )
}
