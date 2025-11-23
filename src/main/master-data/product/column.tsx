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
    header: "Color name",
    enableSorting: true,
  },
  {
    accessorKey: "model.name",
    header: "Model name",
    enableSorting: true,
  },
  {
    accessorKey: "size.name",
    header: "Size name",
    enableSorting: true,
  },
  {
    accessorKey: "is_deleted",
    header: "Deleted",
    enableSorting: true,
    cell: (({ row }) => {
      const data = row.original;
      switch (data.is_deleted) {
        case true:
          return <Badge variant="destructive">Deleted</Badge>
        case false:
          return <Badge variant="secondary">Active</Badge>
      }
    })
  }
]