import type { ReactNode } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export interface NavItem {
  label: string
  icon?: ReactNode
  href?: string
  onClick?: () => void
  active?: boolean
  badge?: string | number
  disabled?: boolean
}

export interface NavGroup {
  title: string
  items: NavItem[]
}

export interface SidebarNavProps {
  groups: NavGroup[]
  footer?: ReactNode
  collapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
  className?: string
}

function NavItemButton({
  item,
  collapsed,
}: {
  item: NavItem
  collapsed: boolean
}) {
  const content = (
    <button
      onClick={item.onClick}
      disabled={item.disabled}
      className={cn(
        "flex w-full items-center h-8 rounded-md px-2.5 text-[13px] gap-2 transition-colors",
        "hover:bg-muted hover:text-foreground",
        "disabled:opacity-50 disabled:pointer-events-none",
        item.active && "bg-primary/10 font-medium text-primary",
        !item.active && "text-muted-foreground",
        collapsed && "justify-center px-0"
      )}
    >
      {item.icon && (
        <span className="shrink-0 [&>svg]:h-4 [&>svg]:w-4">{item.icon}</span>
      )}
      {!collapsed && (
        <>
          <span className="truncate flex-1 text-left">{item.label}</span>
          {item.badge !== undefined && (
            <Badge variant="secondary" className="ml-auto text-xs h-5 px-1.5 text-[11px] font-medium">
              {item.badge}
            </Badge>
          )}
        </>
      )}
    </button>
  )

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          <span className="flex items-center gap-2">
            {item.label}
            {item.badge !== undefined && (
              <Badge variant="secondary" className="text-xs h-5 px-1.5 text-[11px] font-medium">
                {item.badge}
              </Badge>
            )}
          </span>
        </TooltipContent>
      </Tooltip>
    )
  }

  return content
}

export function SidebarNav({
  groups,
  footer,
  collapsed = false,
  onCollapsedChange,
  className,
}: SidebarNavProps) {
  return (
    <div
      className={cn(
        "flex flex-col h-full bg-card",
        "transition-[width] duration-[var(--duration-slow,250ms)] ease-[var(--ease-default,cubic-bezier(0.4,0,0.2,1))]",
        collapsed ? "w-12" : "w-[var(--width-sidebar,200px)]",
        className
      )}
    >
      <ScrollArea className="flex-1">
        <nav aria-label="Main navigation" className="flex flex-col gap-4 py-3">
          {groups.map((group) => (
            <div key={group.title}>
              {!collapsed && (
                <div className="px-3 mb-1.5 text-[11px] font-medium uppercase tracking-[0.05em] text-muted-foreground">
                  {group.title}
                </div>
              )}
              <div className={cn("flex flex-col gap-0.5", collapsed ? "px-1.5" : "px-2")}>
                {group.items.map((item) => (
                  <NavItemButton
                    key={item.label}
                    item={item}
                    collapsed={collapsed}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>

      {footer && (
        <div className={cn("border-t", collapsed ? "px-1.5 py-2" : "px-2 py-2")}>
          {footer}
        </div>
      )}

      {onCollapsedChange && (
        <div className={cn("border-t", collapsed ? "px-1.5 py-2" : "px-2 py-2")}>
          <Button
            variant="ghost"
            size={collapsed ? "icon-sm" : "sm"}
            onClick={() => onCollapsedChange(!collapsed)}
            className={cn("w-full", collapsed && "w-8")}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span className="text-[13px] text-muted-foreground">Collapse</span>
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
