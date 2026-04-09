import { Avatar } from "@/components/design-system/avatar"

export interface AvatarNameCellProps {
  name: string
  email?: string
  subtitle?: string
}

export function AvatarNameCell({ name, email, subtitle }: AvatarNameCellProps) {
  return (
    <div className="flex items-center gap-2">
      <Avatar name={name} email={email} size="sm" />
      <div className="flex flex-col min-w-0">
        <span className="text-[13px] font-medium truncate">{name}</span>
        {subtitle && (
          <span className="text-[11px] text-muted-foreground truncate">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  )
}
