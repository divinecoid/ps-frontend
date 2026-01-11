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
    enableSorting: true,
    cell: (({ row }) => {
      return row.original.sizes.map(s => s.name).join(", ")
    })
  },
  {
    accessorKey: "colors",
    header: "Warna",
    enableSorting: true,
    cell: (({ row }) => {
      return row.original.colors.map(c => c.name).join(", ")
    })
  },
  {
    accessorKey: "is_deleted",
    header: "Status model",
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