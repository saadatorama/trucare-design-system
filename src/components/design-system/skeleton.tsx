import { cn } from "@/lib/utils"

export interface SkeletonProps {
  className?: string
  variant?: "text" | "circular" | "rectangular"
  width?: string | number
  height?: string | number
  /** Text variant only: renders N lines, last line at 60% width */
  lines?: number
}

/**
 * Skeleton loading placeholder.
 *
 * Usage:
 *   <Skeleton variant="rectangular" width="100%" height={36} />
 *   <Skeleton variant="text" lines={3} />
 *   <Skeleton variant="circular" width={40} height={40} />
 */
export function Skeleton({
  className,
  variant = "rectangular",
  width,
  height,
  lines,
}: SkeletonProps) {
  const resolveSize = (value: string | number | undefined) =>
    typeof value === "number" ? `${value}px` : value

  if (variant === "text" && lines && lines > 1) {
    return (
      <div className={cn("flex flex-col gap-1", className)}>
        {Array.from({ length: lines }, (_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-md bg-muted"
            style={{
              width: i === lines - 1 ? "60%" : resolveSize(width) ?? "100%",
              height: resolveSize(height) ?? "14px",
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn(
        "animate-pulse bg-muted",
        variant === "circular" ? "rounded-full" : "rounded-md",
        className
      )}
      style={{
        width: resolveSize(width),
        height: resolveSize(height),
      }}
    />
  )
}
