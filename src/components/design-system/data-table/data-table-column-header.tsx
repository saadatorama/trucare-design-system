import type { Column } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface DataTableColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>
  title: string
  className?: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Button
        variant="ghost"
        size="xs"
        className="-ml-3 h-8 data-[state=open]:bg-accent"
        onClick={() => {
          const currentSort = column.getIsSorted()
          if (currentSort === false) {
            column.toggleSorting(false) // ascending
          } else if (currentSort === "asc") {
            column.toggleSorting(true) // descending
          } else {
            column.clearSorting() // none
          }
        }}
      >
        <span>{title}</span>
        {column.getIsSorted() === "desc" ? (
          <ArrowDown className="ml-1 h-3.5 w-3.5" />
        ) : column.getIsSorted() === "asc" ? (
          <ArrowUp className="ml-1 h-3.5 w-3.5" />
        ) : (
          <ChevronsUpDown className="ml-1 h-3.5 w-3.5 opacity-50" />
        )}
      </Button>
    </div>
  )
}
