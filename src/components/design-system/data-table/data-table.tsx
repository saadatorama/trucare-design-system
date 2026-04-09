import { useState } from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type RowSelectionState,
  type VisibilityState,
  type PaginationState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { DataTablePagination } from "./data-table-pagination"

export interface DataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[]
  data: TData[]
  searchKey?: string
  searchPlaceholder?: string
  enableRowSelection?: boolean
  enablePagination?: boolean
  pageSize?: number
  density?: "compact" | "default" | "comfortable"
  isLoading?: boolean
  emptyMessage?: string
  emptyAction?: React.ReactNode
  onRowClick?: (row: TData) => void
  /** Accessible label for the table. Required for screen readers. */
  ariaLabel?: string
  /** Server-side pagination: total page count (enables controlled mode). */
  pageCount?: number
  /** Server-side pagination: callback when page/size changes. */
  onPaginationChange?: (pagination: { pageIndex: number; pageSize: number }) => void
  /** Expose the table instance for external control (column visibility, selection, etc.) */
  onTableReady?: (table: ReturnType<typeof useReactTable<TData>>) => void
}

const densityClasses = {
  compact: {
    row: "h-9",
    cell: "py-1.5 px-3 text-[13px]",
    head: "h-8 px-3 text-[13px]",
  },
  default: {
    row: "h-10",
    cell: "py-2 px-3 text-[13px]",
    head: "h-9 px-3 text-[13px]",
  },
  comfortable: {
    row: "h-12",
    cell: "py-3 px-4 text-sm",
    head: "h-10 px-4 text-sm",
  },
}

export function DataTable<TData>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Search...",
  enableRowSelection = false,
  enablePagination = true,
  pageSize = 10,
  density = "default",
  isLoading = false,
  emptyMessage = "No results found.",
  emptyAction,
  onRowClick,
  ariaLabel,
  pageCount,
  onPaginationChange,
  onTableReady,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  })

  const isServerSide = pageCount !== undefined

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      columnVisibility,
      pagination,
    },
    enableRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === "function" ? updater(pagination) : updater
      setPagination(newPagination)
      onPaginationChange?.(newPagination)
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    ...(enablePagination && !isServerSide && {
      getPaginationRowModel: getPaginationRowModel(),
    }),
    ...(isServerSide && {
      pageCount,
      manualPagination: true,
    }),
  })

  // Expose table instance for external control
  if (onTableReady) {
    onTableReady(table)
  }

  const dClasses = densityClasses[density]

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      {searchKey && (
        <div className="flex items-center justify-between gap-2">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={
                (table.getColumn(searchKey)?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn(searchKey)?.setFilterValue(event.target.value)
              }
              className="h-8 pl-8 text-[13px]"
            />
          </div>
          <p className="text-[13px] text-muted-foreground">
            {table.getFilteredRowModel().rows.length} result(s)
          </p>
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border">
        <Table className="table-fixed w-full" aria-label={ariaLabel}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      dClasses.head,
                      "sticky top-0 z-[var(--z-sticky,10)] bg-muted/50 backdrop-blur-sm"
                    )}
                    style={{
                      width: header.getSize(),
                      minWidth: header.column.columnDef.minSize,
                      maxWidth: header.column.columnDef.maxSize,
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading skeleton rows
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  {columns.map((_, j) => (
                    <TableCell key={`skeleton-cell-${j}`} className={dClasses.cell}>
                      <div className="h-4 w-full animate-pulse rounded bg-muted" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(
                    dClasses.row,
                    row.getIsSelected() && "border-l-2 border-l-primary",
                    onRowClick && "cursor-pointer"
                  )}
                  onClick={() => onRowClick?.(row.original)}
                  {...(onRowClick ? {
                    tabIndex: 0,
                    role: "button",
                    onKeyDown: (e: React.KeyboardEvent) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        onRowClick(row.original)
                      }
                    },
                  } : {})}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={dClasses.cell}
                      style={{
                        width: cell.column.getSize(),
                        minWidth: cell.column.columnDef.minSize,
                        maxWidth: cell.column.columnDef.maxSize,
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              // Empty state
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center"
                >
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-[13px] text-muted-foreground">
                      {emptyMessage}
                    </p>
                    {emptyAction}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {enablePagination && !isLoading && (
        <DataTablePagination
          table={table}
          enableRowSelection={enableRowSelection}
        />
      )}
    </div>
  )
}
