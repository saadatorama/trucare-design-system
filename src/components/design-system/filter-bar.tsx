import { useState } from "react"
import { SlidersHorizontal, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface FilterOption {
  label: string
  value: string
}

export interface FilterDefinition {
  label: string
  value: string
  options: FilterOption[]
}

export interface FilterBarProps {
  filters: FilterDefinition[]
  activeFilters?: Record<string, string>
  onFilterChange?: (key: string, value: string) => void
  onClear?: () => void
}

export function FilterBar({
  filters,
  activeFilters = {},
  onFilterChange,
  onClear,
}: FilterBarProps) {
  const [open, setOpen] = useState(false)

  const activeCount = Object.values(activeFilters).filter(
    (v) => v && v !== "" && v !== "__all__"
  ).length

  const hasActiveFilters = activeCount > 0

  return (
    <div>
      {/* Toggle button */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-[13px]"
            onClick={() => setOpen((prev) => !prev)}
          >
            <SlidersHorizontal className="mr-1.5 h-3.5 w-3.5" />
            Filters
          </Button>
          {activeCount > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-none text-primary-foreground">
              {activeCount}
            </span>
          )}
        </div>
      </div>

      {/* Collapsible filter panel */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-250 ease-[cubic-bezier(0.4,0,0.2,1)]",
          open
            ? "max-h-[200px] opacity-100 border-t border-border mt-2"
            : "max-h-0 opacity-0"
        )}
      >
        <div className="flex items-center gap-2 flex-wrap py-3">
          {filters.map((filter) => {
            const currentValue = activeFilters[filter.value] ?? ""
            const isActive = currentValue !== "" && currentValue !== "__all__"

            return (
              <div key={filter.value} className="flex items-center gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  {filter.label}
                </span>
                <Select
                  value={currentValue}
                  onValueChange={(val) => onFilterChange?.(filter.value, val)}
                >
                  <SelectTrigger
                    aria-label={filter.label}
                    className={cn(
                      "h-8 w-auto min-w-[120px] text-[13px] rounded-md transition-colors",
                      isActive
                        ? "border-primary/30 bg-primary/5 text-foreground font-medium"
                        : "border-input bg-background text-muted-foreground"
                    )}
                  >
                    <SelectValue placeholder={`All ${filter.label}`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">All {filter.label}</SelectItem>
                    {filter.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )
          })}

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onClear?.()
                setOpen(false)
              }}
              className="text-muted-foreground"
            >
              <X className="mr-1 h-3.5 w-3.5" />
              Clear filters
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
