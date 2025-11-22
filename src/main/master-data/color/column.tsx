import { Color } from "@/interfaces/color"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<Color>[] = [
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