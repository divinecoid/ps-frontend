import { Size } from "@/interfaces/size"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<Size>[] = [
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