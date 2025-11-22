import { Factory } from "@/interfaces/factory"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<Factory>[] = [
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
]