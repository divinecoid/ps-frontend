import { Badge } from "@/components/ui/badge";
import { Warehouse } from "@/interfaces/warehouse"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<Warehouse>[] = [
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
    accessorKey: "priority",
    header: "Prioritas",
    enableSorting: true,
  },
  {
    accessorKey: "is_deleted",
    header: "Status gudang",
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