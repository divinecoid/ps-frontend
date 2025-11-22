import { Warehouse } from "@/interfaces/warehouse"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<Warehouse>[] = [
  {
    accessorKey: "code",
    header: "Code",
    enableSorting: true,
  },
  {
    accessorKey: "name",
    header: "Name",
    enableSorting: true,
  },
  {
    accessorKey: "priority",
    header: "Priority",
    enableSorting: true,
  },
]