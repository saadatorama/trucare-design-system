import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet"

const WIDTH_MAP = {
  sm: "sm:max-w-[400px]",
  md: "sm:max-w-[520px]",
  lg: "sm:max-w-[640px]",
} as const

export interface DetailPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  subtitle?: string
  badge?: ReactNode
  children: ReactNode
  footer?: ReactNode
  width?: "sm" | "md" | "lg"
}

export function DetailPanel({
  open,
  onOpenChange,
  title,
  subtitle,
  badge,
  children,
  footer,
  width = "md",
}: DetailPanelProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className={cn(
          "flex flex-col p-0",
          WIDTH_MAP[width]
        )}
      >
        {/* Sticky header */}
        <div className="shrink-0 border-b px-5 py-4">
          <div className="flex items-start gap-2">
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-[16px] font-medium leading-tight">
                {title}
              </SheetTitle>
              {subtitle && (
                <p className="text-[13px] text-muted-foreground mt-0.5 leading-tight">
                  {subtitle}
                </p>
              )}
            </div>
            {badge && <div className="shrink-0">{badge}</div>}
          </div>
        </div>

        {/* Scrollable body */}
        <ScrollArea className="flex-1">
          <div className="px-5 py-4">{children}</div>
        </ScrollArea>

        {/* Sticky footer */}
        {footer && (
          <div className="shrink-0 border-t px-5 py-3 flex justify-end gap-2">
            {footer}
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
