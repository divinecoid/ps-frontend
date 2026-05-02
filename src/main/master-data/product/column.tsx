import { Badge } from "@/components/ui/badge";
import { Product } from "@/interfaces/product"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "model.name",
    header: "Model",
    enableSorting: true,
  },
  {
    accessorKey: "rack.name",
    header: "Rak",
    enableSorting: true,
  },
  {
    accessorKey: "barcode",
    header: "Barcode",
    enableSorting: true,
  },
  {
    accessorKey: "deleted_at",
    header: "Status produk",
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