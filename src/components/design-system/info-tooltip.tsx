import type * as React from "react"
import { Info } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"

export interface InfoTooltipProps {
  content: string | React.ReactNode
  side?: "top" | "right" | "bottom" | "left"
  className?: string
}

/**
 * Small info icon with hover tooltip.
 *
 * Usage:
 *   <InfoTooltip content="NPI is the 10-digit National Provider Identifier" />
 */
export function InfoTooltip({
  content,
  side = "top",
  className,
}: InfoTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex shrink-0 items-center justify-center text-muted-foreground hover:text-foreground transition-colors",
            className
          )}
          aria-label="More information"
        >
          <Info className="h-3.5 w-3.5" />
        </button>
      </TooltipTrigger>
      <TooltipContent side={side}>
        {content}
      </TooltipContent>
    </Tooltip>
  )
}
