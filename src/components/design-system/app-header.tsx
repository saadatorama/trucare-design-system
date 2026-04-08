import type { ReactNode } from "react"
import { Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AccountDropdown } from "@/components/design-system/account-dropdown"

export interface AppHeaderProps {
  logo?: ReactNode
  title: string
  version?: string
  globalAction?: { label: string; icon: ReactNode; onClick: () => void }
  user: { name: string; email: string }
  onThemeToggle?: () => void
  isDark?: boolean
  children?: ReactNode
  className?: string
}

export function AppHeader({
  logo,
  title,
  version,
  globalAction,
  user,
  onThemeToggle,
  isDark,
  children,
  className,
}: AppHeaderProps) {
  return (
    <header
      className={cn(
        "flex items-center justify-between h-[var(--height-header,48px)] border-b bg-card px-4 z-50",
        className
      )}
    >
      {/* Left section: logo + title + version */}
      <div className="flex items-center gap-2.5">
        {logo && (
          <div className="h-7 w-7 shrink-0 flex items-center justify-center rounded-md overflow-hidden">
            {logo}
          </div>
        )}
        <span className="text-sm font-semibold tracking-tight">{title}</span>
        {version && (
          <Badge variant="secondary" className="text-[11px] px-1.5 h-5 font-normal">
            {version}
          </Badge>
        )}
      </div>

      {/* Right section: global action + theme toggle + children + account */}
      <div className="flex items-center gap-2">
        {globalAction && (
          <Button
            variant="default"
            size="sm"
            onClick={globalAction.onClick}
          >
            <span className="shrink-0 [&>svg]:h-4 [&>svg]:w-4">
              {globalAction.icon}
            </span>
            {globalAction.label}
          </Button>
        )}

        {onThemeToggle && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onThemeToggle}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        )}

        {children}

        <AccountDropdown user={user} />
      </div>
    </header>
  )
}
