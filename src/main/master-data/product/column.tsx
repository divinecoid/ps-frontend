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
]