import type { Table } from "@tanstack/react-table"
import { Columns3 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DataTableColumnVisibilityProps<TData> {
  table: Table<TData>
}

/**
 * Column visibility toggle dropdown for DataTable.
 *
 * Renders a popover with checkboxes to show/hide table columns.
 * Only shows columns that have an `id` or accessor key.
 */
export function DataTableColumnVisibility<TData>({
  table,
}: DataTableColumnVisibilityProps<TData>) {
  const columns = table
    .getAllColumns()
    .filter((col) => col.getCanHide())

  if (columns.length === 0) return null

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 text-[13px]">
          <Columns3 className="mr-1.5 h-3.5 w-3.5" />
          Columns
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[180px] p-2">
        <div className="flex flex-col gap-1">
          {columns.map((column) => {
            const header =
              typeof column.columnDef.header === "string"
                ? column.columnDef.header
                : column.id
            return (
              <label
                key={column.id}
                className="flex items-center gap-2 rounded-sm px-2 py-1 text-[13px] hover:bg-muted cursor-pointer"
              >
                <Checkbox
                  checked={column.getIsVisible()}
                  onCheckedChange={(checked) =>
                    column.toggleVisibility(!!checked)
                  }
                />
                <span className="truncate capitalize">{header}</span>
              </label>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
