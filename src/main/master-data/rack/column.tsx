import { Rack } from "@/interfaces/rack"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<Rack>[] = [
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
    accessorKey: "warehouse.name",
    header: "Warehouse name",
    enableSorting: true,
  },
]