import { Badge } from "@/components/ui/badge";
import { ProductModel } from "@/interfaces/product-model"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<ProductModel>[] = [
  {
    accessorKey: "sku",
    header: "SKU",
    enableSorting: true,
  },
  {
    accessorKey: "name",
    header: "Model",
    enableSorting: true,
  },
  {
    accessorKey: "sizes",
    header: "Ukuran",
    cell: (({ row }) => {
      return row.original.sizes.map(s => s.name).join(", ")
    })
  },
  {
    accessorKey: "colors",
    header: "Warna",
    cell: (({ row }) => {
      return row.original.colors.map(c => c.name).join(", ")
    })
  },
  {
    accessorKey: "deleted_at",
    header: "Status model",
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