import * as React from "react"
import { Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"
import { copyToClipboard } from "@/lib/copy-to-clipboard"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export interface CopyableProps {
  /** The value that gets copied to clipboard (may differ from displayed children for masked data) */
  value: string
  children: React.ReactNode
  className?: string
  /** Duration in ms to show "Copied!" feedback. Default 1500. */
  feedbackDuration?: number
  /** When true, auto-clears clipboard after clearDuration ms. Use for PHI (SSN, DOB, MRN). */
  sensitive?: boolean
  /** Duration in ms before clipboard is cleared when sensitive=true. Default 15000 (15s). */
  clearDuration?: number
  /** Audit callback fired when a copy occurs. Use to log PHI access events. Receives the field value. */
  onCopy?: (value: string) => void
  /** Custom aria-label. Defaults to generic "Copy to clipboard" to avoid PHI exposure in accessibility tree. */
  ariaLabel?: string
}

export function Copyable({
  value,
  children,
  className,
  feedbackDuration = 1500,
  sensitive = false,
  clearDuration = 15_000,
  onCopy: onCopyCallback,
  ariaLabel,
}: CopyableProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation()
    const success = await copyToClipboard(value)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), feedbackDuration)

      // Audit callback for PHI access logging
      onCopyCallback?.(value)

      // SECURITY: Auto-clear clipboard for sensitive/PHI values
      if (sensitive) {
        setTimeout(() => {
          navigator.clipboard?.writeText("").catch(() => {
            // Silently fail — clipboard may already be overwritten by user
          })
        }, clearDuration)
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleCopy(e)
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          role="button"
          tabIndex={0}
          className={cn(
            "group inline-flex items-center gap-1 cursor-pointer rounded-sm transition-colors hover:bg-muted/60 -mx-0.5 px-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
            className
          )}
          onClick={handleCopy}
          onKeyDown={handleKeyDown}
          aria-label={ariaLabel ?? "Copy to clipboard"}
        >
          {children}
          {copied ? (
            <Check className="h-3 w-3 shrink-0 text-success" aria-hidden="true" />
          ) : (
            <Copy className="h-3 w-3 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
          )}
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-xs">
        {copied ? "Copied!" : "Click to copy"}
      </TooltipContent>
    </Tooltip>
  )
}
