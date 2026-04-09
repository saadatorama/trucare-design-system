import { Copyable } from "@/components/design-system/copyable"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export interface EmailCellProps {
  value: string
  copyable?: boolean
}

export function EmailCell({ value, copyable = true }: EmailCellProps) {
  // When copyable, the Copyable component provides its own Tooltip
  // ("Click to copy" / "Copied!") so we don't add a second one.
  if (copyable) {
    return (
      <Copyable value={value}>
        <span className="text-[13px] max-w-[200px] truncate block">
          {value}
        </span>
      </Copyable>
    )
  }

  // When not copyable, show a tooltip with the full address (for truncated values).
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="text-[13px] max-w-[200px] truncate block">
          {value}
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-xs">
        {value}
      </TooltipContent>
    </Tooltip>
  )
}
