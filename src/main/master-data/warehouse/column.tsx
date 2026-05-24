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
    accessorKey: "type",
    header: "Tipe Gudang",
    enableSorting: true,
    cell: (({ row }) => {
      const data = row.original;
      switch (data.type) {
        case 'BIG':
          return <Badge variant="default">Gudang Besar</Badge>
        case 'SMALL':
        default:
          return <Badge variant="secondary">Gudang Kecil</Badge>
      }
    })
  },
  {
    accessorKey: "deleted_at",
    header: "Status gudang",
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