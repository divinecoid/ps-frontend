import { Badge } from "@/components/ui/badge";
import { Rack } from "@/interfaces/rack"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<Rack>[] = [
  {
    accessorKey: "code",
    header: "Kode",
    enableSorting: true,
  },
  {
    accessorKey: "name",
    header: "Nama",
    enableSorting: true,
  },
  {
    accessorKey: "is_deleted",
    header: "Status CMT",
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