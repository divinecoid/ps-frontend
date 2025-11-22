import { ProductModel } from "@/interfaces/product-model"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<ProductModel>[] = [
  {
    accessorKey: "code",
    header: "Code",
    enableSorting: true,
  },
  {
    accessorKey: "name",
    header: "Name",
    enableSorting: true,
  },
]