import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  // getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import DatatablePagination from "./datatable-pagination"
import SortHeader from "./sort-header"
import { Checkbox } from "@/components/ui/checkbox"

interface DataTableProps<TData, TValue> {
  data: TData[],
  columns: ColumnDef<TData, TValue>[];
  currentPage?: number;
  perPage?: number;
  onPageChange: (page: number) => void;
  count?: number;
  onPageSizeChange?: (size: number) => void;
  filterComponents?: React.ReactNode;
  selectable?: boolean;
  actions?: React.ReactNode[];
  rowActions?: (cell: { row: TData }) => React.ReactNode;
}

const pageSizes = [10, 20, 50, 100];

export default function DataTable<TData, TValue>({
  data,
  columns,
  currentPage,
  perPage,
  onPageChange,
  count,
  onPageSizeChange,
  filterComponents,
  selectable,
  actions,
  rowActions }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        {filterComponents}
        <div className="gap-2 ml-auto flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="select-none">
              <Button variant="outline">
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          {actions && actions.map((item, key) => {
            if (React.isValidElement(item)) {
              return React.cloneElement(item, { key });
            }
          })}
        </div>
      </div>
      <div className="flex">
        <div className="flex-1 w-0 overflow-hidden rounded-md border">
          <Table>
            <TableHeader className="select-none">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {selectable && (
                    <TableHead className="w-0">
                      <Checkbox
                        checked={
                          table.getIsAllPageRowsSelected() ||
                          (table.getIsSomePageRowsSelected() ? "indeterminate" : false)
                        }
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label="Select all"
                      />
                    </TableHead>
                  )}
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : header.column.columnDef.enableSorting ?
                            <SortHeader column={header.column}>{flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}</SortHeader>
                            : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                  {rowActions && (
                    <TableHead className="w-0" />
                  )}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    className="group"
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {selectable && (
                      <TableCell>
                        <Checkbox
                          checked={row.getIsSelected()}
                          onCheckedChange={(value) => row.toggleSelected(!!value)}
                          aria-label="Select row"
                        />
                      </TableCell>
                    )}
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                    {rowActions && (
                      <TableCell className="w-0 sticky right-0 opacity-0 group-hover:opacity-100 backdrop-blur-md">
                        {rowActions({ row: row.original })}
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-12 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="select-none text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length == 0 ?
            <>
              {table.getFilteredRowModel().rows.length} of{" "}
              {count} row(s) retrieved.
            </>
            :
            <>
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {count} row(s) selected.
            </>
          }
        </div>
        <div>
          <Select defaultValue={`${perPage}`} onValueChange={value => onPageSizeChange(Number(value))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizes.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>{pageSize}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-x-2">
          <DatatablePagination currentPage={currentPage} totalPages={Math.ceil(count / perPage)} onPageChange={onPageChange} />
        </div>
      </div>
    </div>
  )
}
