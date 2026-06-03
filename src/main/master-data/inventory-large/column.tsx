import { LargeInventory } from "@/interfaces/inventory-large"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<LargeInventory>[] = [
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
    accessorKey: "rack.code",
    header: "Rak",
    enableSorting: true,
    cell: (({ row }) => {
      const rack = row.original.rack;
      return rack ? `${rack.code} - ${rack.name}` : '-';
    })
  },
  {
    accessorKey: "total",
    header: "Jumlah",
    enableSorting: true,
  }
]