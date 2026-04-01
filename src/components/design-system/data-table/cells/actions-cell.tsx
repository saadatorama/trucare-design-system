import type * as React from "react"
import { MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export interface ActionItem {
  label: string
  icon: React.ReactNode
  onClick: () => void
  variant?: "ghost" | "destructive"
}

export interface ActionsCellProps {
  actions: ActionItem[]
}

export function ActionsCell({ actions }: ActionsCellProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-xs">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {actions.map((action) => (
          <DropdownMenuItem
            key={action.label}
            onClick={(e) => {
              e.stopPropagation()
              action.onClick()
            }}
            className={cn(
              action.variant === "destructive" &&
                "text-destructive focus:text-destructive"
            )}
          >
            <span className="[&_svg]:h-4 [&_svg]:w-4">{action.icon}</span>
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
