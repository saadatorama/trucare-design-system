import type { Table } from "@tanstack/react-table"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function getPageRange(current: number, total: number): (number | "...")[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i)
  if (current <= 2) return [0, 1, 2, "...", total - 1]
  if (current >= total - 3) return [0, "...", total - 3, total - 2, total - 1]
  return [0, "...", current - 1, current, current + 1, "...", total - 1]
}

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  enableRowSelection?: boolean
}

export function DataTablePagination<TData>({
  table,
  enableRowSelection = false,
}: DataTablePaginationProps<TData>) {
  const currentPage = table.getState().pagination.pageIndex
  const pageCount = table.getPageCount()
  const pages = getPageRange(currentPage, pageCount)

  return (
    <div className="flex items-center justify-between px-2 py-3">
      {/* Selected row count */}
      <div className="flex-1 text-[13px] text-muted-foreground">
        {enableRowSelection
          ? `${table.getFilteredSelectedRowModel().rows.length} of ${table.getFilteredRowModel().rows.length} row(s) selected`
          : `${table.getFilteredRowModel().rows.length} row(s) total`}
      </div>

      <div className="flex items-center gap-6 lg:gap-8">
        {/* Page size selector */}
        <div className="flex items-center gap-2">
          <p className="text-[13px] font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 25, 50, 100].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Pagination buttons */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-xs"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {pages.map((page, i) =>
            page === "..." ? (
              <span
                key={`ellipsis-${i}`}
                className="flex h-7 w-7 items-center justify-center text-[13px] text-muted-foreground"
              >
                ...
              </span>
            ) : (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="icon-xs"
                onClick={() => table.setPageIndex(page)}
                className={cn(
                  "text-[13px]",
                  page === currentPage && "pointer-events-none"
                )}
              >
                {page + 1}
              </Button>
            )
          )}

          <Button
            variant="outline"
            size="icon-xs"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
