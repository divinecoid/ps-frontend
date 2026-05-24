import { Badge } from "@/components/ui/badge";
import { Fabric } from "@/interfaces/fabric";
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<Fabric>[] = [
  {
    accessorKey: "sequence",
    header: "Series",
    enableSorting: true,
  },
  {
    accessorKey: "factory.name",
    header: "Nama Pabrik",
    enableSorting: true,
  },
  {
    accessorKey: "gram",
    header: "Grammasi",
    enableSorting: true,
  },
  {
    accessorKey: "roll_size.size",
    header: "Setting",
    enableSorting: true,
  },
  {
    accessorKey: "color.name",
    header: "Warna",
    enableSorting: true,
  },
  {
    accessorKey: "quantity",
    header: "Jumlah",
    enableSorting: true,
  },
  {
    accessorKey: "deleted_at",
    header: "Status Kain",
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