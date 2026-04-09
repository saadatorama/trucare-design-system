import { useState, type ReactNode } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

export interface DetailSectionProps {
  title: string
  children: ReactNode
  collapsible?: boolean
  defaultOpen?: boolean
  className?: string
}

export function DetailSection({
  title,
  children,
  collapsible = false,
  defaultOpen = true,
  className,
}: DetailSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className={cn(className)}>
      {/* Section header */}
      <div className="flex items-center gap-1.5 mb-3">
        <h3 className="text-[11px] font-medium uppercase tracking-[0.05em] text-muted-foreground">
          {title}
        </h3>
        {collapsible && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center h-5 w-5 rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-expanded={isOpen}
            aria-label={isOpen ? `Collapse ${title}` : `Expand ${title}`}
          >
            {isOpen ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>
        )}
      </div>

      {/* Content — animates open/closed when collapsible */}
      {collapsible ? (
        <div
          className={cn(
            "grid transition-[grid-template-rows] duration-[var(--duration-slow,250ms)] ease-[var(--ease-default,cubic-bezier(0.4,0,0.2,1))]",
            isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          )}
        >
          <div className="overflow-hidden">{children}</div>
        </div>
      ) : (
        children
      )}
    </div>
  )
}
