import { Badge } from "@/components/ui/badge";
import { User } from "@/interfaces/user"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Nama lengkap",
    enableSorting: true,
  },
  {
    accessorKey: "username",
    header: "Nama pengguna",
    enableSorting: true,
  },
  {
    accessorKey: "email",
    header: "Email",
    enableSorting: true,
  },
  {
    header: "Peran",
    enableSorting: true,
    cell: (({row}) => {
      return row.original.roles.map(r => r.name).join(", ")
    })
  },
  {
    accessorKey: "is_deleted",
    header: "Status pengguna",
    enableSorting: true,
    cell: (({ row }) => {
      const data = row.original;
      switch (data.is_deleted) {
        case true:
          return <Badge variant="destructive">Nonaktif</Badge>
        case false:
          return <Badge variant="success">Aktif</Badge>
      }
    })
  }
]