import { Badge } from "@/components/ui/badge";
import { Role } from "@/interfaces/role"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<Role>[] = [
  {
    accessorKey: "name",
    header: "Nama",
    enableSorting: true,
  },
  {
    accessorKey: "description",
    header: "Deskripsi",
    enableSorting: true,
  },
  {
    accessorKey: "deleted_at",
    header: "Status peran",
    enableSorting: true,
    cell: (({ row }) => {
      const data = row.original;
      switch (data.deleted_at) {
        case true:
          return <Badge variant="destructive">Nonaktif</Badge>
        case false:
          return <Badge variant="success">Aktif</Badge>
      }
    })
  }
]