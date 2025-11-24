import { Badge } from "@/components/ui/badge";
import { Marketplace } from "@/interfaces/marketplace"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<Marketplace>[] = [
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
    accessorKey: "alias",
    header: "Alias",
    enableSorting: true,
  },
  {
    accessorKey: "base_api_url",
    header: "Base API URL",
    enableSorting: true,
  },
  {
    accessorKey: "description",
    header: "Description",
    enableSorting: true,
  },
  {
    accessorKey: "is_need_checker",
    header: "Need checker",
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