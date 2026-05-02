import { SmallInventory } from "@/interfaces/inventory-small"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<SmallInventory>[] = [
  {
    accessorKey: "code",
    header: "Kode",
    enableSorting: true,
  },
  {
    accessorKey: "name",
    header: "Nama",
    enableSorting: true,
  },
  {
    accessorKey: "warehouse.name",
    header: "Gudang",
    enableSorting: true,
  },
  {
    accessorKey: "total",
    header: "Jumlah Produk",
    enableSorting: true,
  }
]