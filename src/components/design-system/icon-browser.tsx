import { useState } from "react"
import * as LucideIcons from "lucide-react"
import { iconLibrary, type IconCategory } from "@/lib/icons"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface IconBrowserProps {
  className?: string
}

export function IconBrowser({ className }: IconBrowserProps) {
  const [search, setSearch] = useState("")
  const searchLower = search.toLowerCase()

  const categories = Object.entries(iconLibrary) as [
    IconCategory,
    readonly string[],
  ][]

  return (
    <div className={cn("space-y-6", className)}>
      <Input
        placeholder="Search icons..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-xs"
      />
      {categories.map(([category, iconNames]) => {
        const filtered = iconNames.filter((name) =>
          name.toLowerCase().includes(searchLower)
        )
        if (filtered.length === 0) return null

        return (
          <div key={category}>
            <h4 className="text-[11px] font-medium uppercase tracking-[0.05em] text-muted-foreground mb-2">
              {category} ({filtered.length})
            </h4>
            <div className="flex flex-wrap gap-1">
              {filtered.map((iconName) => {
                const IconComponent = (
                  LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>
                )[iconName]
                if (!IconComponent) return null

                return (
                  <Tooltip key={iconName}>
                    <TooltipTrigger asChild>
                      <div className="flex h-9 w-9 items-center justify-center rounded-md border hover:bg-muted transition-colors cursor-default">
                        <IconComponent className="h-4 w-4" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      className="text-xs font-mono"
                    >
                      {iconName}
                    </TooltipContent>
                  </Tooltip>
                )
              })}
            </div>
          </div>
        )
      })}
      {categories.every(([, names]) =>
        names.every((n) => !n.toLowerCase().includes(searchLower))
      ) && (
        <p className="text-sm text-muted-foreground">
          No icons match &ldquo;{search}&rdquo;
        </p>
      )}
    </div>
  )
}
