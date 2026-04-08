import type { ReactNode } from "react"
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface BannerProps {
  variant: "info" | "warning" | "destructive" | "success"
  title?: string
  children: ReactNode
  dismissible?: boolean
  onDismiss?: () => void
  action?: { label: string; onClick: () => void }
  className?: string
}

const variantConfig = {
  info: {
    icon: Info,
    borderColor: "var(--info)",
    bgColor: "var(--info)",
  },
  warning: {
    icon: AlertTriangle,
    borderColor: "var(--warning)",
    bgColor: "var(--warning)",
  },
  destructive: {
    icon: AlertCircle,
    borderColor: "var(--destructive)",
    bgColor: "var(--destructive)",
  },
  success: {
    icon: CheckCircle2,
    borderColor: "var(--success)",
    bgColor: "var(--success)",
  },
}

/**
 * Persistent page-level notification banner.
 *
 * Use for messages that must persist until dismissed or resolved:
 * - "Payer connection is down"
 * - "ERA batch processing delayed"
 * - "Subscription expires in 3 days"
 *
 * For ephemeral messages, use Toast instead.
 */
export function Banner({
  variant,
  title,
  children,
  dismissible = false,
  onDismiss,
  action,
  className,
}: BannerProps) {
  const config = variantConfig[variant]
  const Icon = config.icon

  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 rounded-md px-4 py-3 text-[13px]",
        className
      )}
      style={{
        borderLeft: `3px solid ${config.borderColor}`,
        backgroundColor: `color-mix(in oklch, ${config.bgColor} 5%, var(--card))`,
      }}
    >
      <Icon
        className="mt-0.5 h-4 w-4 shrink-0"
        style={{ color: config.borderColor }}
        aria-hidden="true"
      />

      <div className="flex-1 min-w-0">
        {title && (
          <p className="font-medium text-foreground">{title}</p>
        )}
        <div className={cn("text-muted-foreground", title && "mt-0.5")}>
          {children}
        </div>
      </div>

      {action && (
        <Button
          variant="ghost"
          size="xs"
          onClick={action.onClick}
          className="shrink-0 font-medium"
          style={{ color: config.borderColor }}
        >
          {action.label}
        </Button>
      )}

      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className="shrink-0 rounded-sm p-0.5 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
          aria-label="Dismiss"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}
