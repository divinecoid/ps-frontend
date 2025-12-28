import { Badge } from "@/components/ui/badge";
import { Product } from "@/interfaces/product"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "sku",
    header: "SKU",
    enableSorting: true,
  },
  {
    accessorKey: "color.name",
    header: "Warna",
    enableSorting: true,
  },
  {
    accessorKey: "model.name",
    header: "Model",
    enableSorting: true,
  },
  {
    accessorKey: "size.name",
    header: "Ukuran",
    enableSorting: true,
  },
  {
    accessorKey: "is_deleted",
    header: "Status produk",
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