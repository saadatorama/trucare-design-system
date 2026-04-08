import type { ReactNode } from "react"
import { Settings, LogOut } from "lucide-react"
import { Avatar } from "@/components/design-system/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export interface AccountDropdownProps {
  user: { name: string; email: string }
  menuItems?: { label: string; icon?: ReactNode; onClick: () => void }[]
  onSettings?: () => void
  onLogout?: () => void
}

export function AccountDropdown({
  user,
  menuItems,
  onSettings,
  onLogout,
}: AccountDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
          aria-label="Account menu"
        >
          <Avatar name={user.name} size="sm" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-56">
        {/* User info header */}
        <div className="px-2 py-1.5">
          <p className="text-[13px] font-medium leading-tight">{user.name}</p>
          <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
            {user.email}
          </p>
        </div>
        <DropdownMenuSeparator />

        {/* Custom menu items */}
        {menuItems?.map((item) => (
          <DropdownMenuItem
            key={item.label}
            onClick={item.onClick}
            className="gap-2 text-[13px]"
          >
            {item.icon && (
              <span className="shrink-0 [&>svg]:h-4 [&>svg]:w-4">
                {item.icon}
              </span>
            )}
            {item.label}
          </DropdownMenuItem>
        ))}

        {/* Settings */}
        {onSettings && (
          <DropdownMenuItem onClick={onSettings} className="gap-2 text-[13px]">
            <Settings className="h-4 w-4" />
            Settings
          </DropdownMenuItem>
        )}

        {/* Logout */}
        {onLogout && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} className="gap-2 text-[13px]">
              <LogOut className="h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
