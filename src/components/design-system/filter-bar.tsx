import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface FilterDefinition {
  label: string
  value: string
  options: string[]
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
  const hasActiveFilters = Object.values(activeFilters).some(
    (v) => v && v !== ""
  )

  return (
    <div className="flex items-center gap-2">
      {filters.map((filter) => (
        <Select
          key={filter.value}
          value={activeFilters[filter.value] ?? ""}
          onValueChange={(val) => onFilterChange?.(filter.value, val)}
        >
          <SelectTrigger className="h-8 w-auto min-w-[120px] text-[13px]">
            <SelectValue placeholder={filter.label} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All {filter.label}</SelectItem>
            {filter.options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="text-muted-foreground"
        >
          <X className="mr-1 h-3.5 w-3.5" />
          Clear filters
        </Button>
      )}
    </div>
  )
}
