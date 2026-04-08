import type { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"

/**
 * Returns a column definition for row selection with header "select all" + row checkboxes.
 *
 * Usage:
 *   const columns = [
 *     getSelectionColumn<Claim>(),
 *     { accessorKey: "id", header: "Claim ID", ... },
 *     ...
 *   ]
 */
export function getSelectionColumn<TData>(): ColumnDef<TData, unknown> {
  return {
    id: "select",
    size: 40,
    minSize: 40,
    maxSize: 40,
    enableSorting: false,
    enableHiding: false,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomePageRowsSelected()
              ? "indeterminate"
              : false
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all rows"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        onClick={(e) => e.stopPropagation()}
        aria-label={`Select row ${row.index + 1}`}
      />
    ),
  }
}
