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