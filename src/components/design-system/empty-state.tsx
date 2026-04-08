import type * as React from "react"
import { FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    icon?: React.ReactNode
  }
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[200px] flex-col items-center justify-center px-4",
        className
      )}
    >
      <div className="text-muted-foreground opacity-50 [&_svg]:h-12 [&_svg]:w-12" aria-hidden="true">
        {icon ?? <FileText />}
      </div>
      <p className="mt-4 text-[16px] font-medium">{title}</p>
      {description && (
        <p className="mt-1 max-w-sm text-center text-[13px] text-muted-foreground">
          {description}
        </p>
      )}
      {action && (
        <Button
          variant="default"
          size="md"
          className="mt-4"
          onClick={action.onClick}
        >
          {action.icon && (
            <span className="[&_svg]:h-4 [&_svg]:w-4">{action.icon}</span>
          )}
          {action.label}
        </Button>
      )}
    </div>
  )
}
