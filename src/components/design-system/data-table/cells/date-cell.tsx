import { formatDate } from "@/lib/date-format"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export interface DateCellProps {
  value: string | Date
  format?: "absolute" | "relative" | "short" | "long"
}

export function DateCell({ value, format = "absolute" }: DateCellProps) {
  const date = value instanceof Date ? value : new Date(value)
  const displayText = formatDate(date, format)
  const fullDate = formatDate(date, "long")

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="text-[13px] text-muted-foreground">{displayText}</span>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-xs">
        {fullDate}
      </TooltipContent>
    </Tooltip>
  )
}
