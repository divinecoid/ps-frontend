import { Badge } from "@/components/ui/badge";
import { User } from "@/interfaces/user"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<User>[] = [
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
    accessorKey: "username",
    header: "Username",
    enableSorting: true,
  },

  {
    header: "Role",
    enableSorting: true,
    cell: (({row}) => {
      return row.original.roles.map(r => r.name[0]).join(", ")
    })
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