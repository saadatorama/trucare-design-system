import type * as React from "react"
import { AlertCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface ErrorStateProps {
  title?: string
  description?: string
  action?: { label: string; onClick: () => void }
  icon?: React.ReactNode
  className?: string
}

/**
 * Non-boundary error state for inline use (e.g., failed API call in one section).
 *
 * Usage:
 *   <ErrorState
 *     title="Failed to load claims"
 *     description="The clearinghouse connection timed out."
 *     action={{ label: "Retry", onClick: refetch }}
 *   />
 */
export function ErrorState({
  title = "Something went wrong",
  description = "An unexpected error occurred.",
  action,
  icon,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 p-8 text-center",
        className
      )}
    >
      <div className="text-muted-foreground [&_svg]:h-12 [&_svg]:w-12">
        {icon ?? <AlertCircle />}
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-medium text-foreground">{title}</h3>
        <p className="text-[13px] text-muted-foreground">{description}</p>
      </div>
      {action && (
        <Button variant="outline" size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}
