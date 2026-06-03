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
    accessorKey: "warehouse.name",
    header: "Gudang",
    enableSorting: true,
  },
  {
    accessorKey: "model.name",
    header: "Model",
    enableSorting: true,
    cell: (({ row }) => {
      const model = row.original.model;
      return model ? model.name : '-';
    })
  },
  {
    accessorKey: "color.name",
    header: "Warna",
    enableSorting: true,
    cell: (({ row }) => {
      const color = row.original.color;
      return color ? color.name : '-';
    })
  },
  {
    accessorKey: "deleted_at",
    header: "Status rak",
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