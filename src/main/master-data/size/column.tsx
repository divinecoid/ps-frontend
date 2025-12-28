import { Badge } from "@/components/ui/badge";
import { Size } from "@/interfaces/size"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<Size>[] = [
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
    header: "Status ukuran",
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