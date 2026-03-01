import { Inventory } from "@/interfaces/inventory"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<Inventory>[] = [
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
    accessorKey: "total",
    header: "Jumlah",
    enableSorting: true,
  }
]