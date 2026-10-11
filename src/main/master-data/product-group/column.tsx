import { ProductGroup } from "@/interfaces/product-group"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<ProductGroup>[] = [
  {
    accessorKey: "model.name",
    header: "Model",
    enableSorting: true,
  },
  {
    accessorKey: "color.name",
    header: "Warna",
    enableSorting: true,
  },
  {
    accessorKey: "size.name",
    header: "Ukuran",
    enableSorting: true,
  },
  {
    accessorKey: "series",
    header: "Series",
    enableSorting: true,
  },
  {
    accessorKey: "qty",
    header: "Jumlah",
    enableSorting: true,
  },
]
