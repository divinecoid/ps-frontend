import { Badge } from "@/components/ui/badge";
import { Rack } from "@/interfaces/rack"
import { ColumnDef } from "@tanstack/react-table"

export const detailColumns: ColumnDef<Rack>[] = [
  {
    accessorKey: "code",
    header: "Code",
    enableSorting: true,
    enableHiding: false
  },
  {
    accessorKey: "name",
    header: "Name",
    enableSorting: true,
    enableHiding: false
  },
  {
    accessorKey: "warehouse.name",
    header: "Warehouse name",
    enableSorting: true,
    enableHiding: false
  },
  {
    accessorKey: "is_deleted",
    header: "Deleted",
    enableSorting: true,
    enableHiding: false,
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