import { Badge } from "@/components/ui/badge";
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
  {
    accessorKey: "is_deleted",
    header: "Deleted",
    enableSorting: true,
    cell: (({ row }) => {
      const data = row.original;
      switch (data.is_deleted) {
        case true:
          return <Badge variant="destructive">Deleted</Badge>
        case false:
          return <Badge variant="secondary">Active</Badge>
      }
    })
  }
]