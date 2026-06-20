import { Badge } from "@/components/ui/badge";
import { Fabric } from "@/interfaces/fabric";
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<Fabric>[] = [
  {
    accessorKey: "sequence",
    header: "Series",
    enableSorting: true,
  },
  {
    accessorKey: "factory.name",
    header: "Nama Pabrik",
    enableSorting: true,
  },
  {
    accessorKey: "gram",
    header: "Grammasi",
    enableSorting: true,
  },
  {
    accessorKey: "roll_size.size",
    header: "Setting",
    enableSorting: true,
  },
  {
    accessorKey: "color.name",
    header: "Warna",
    enableSorting: true,
  },
  {
    accessorKey: "quantity",
    header: "Jumlah",
    enableSorting: true,
  }
]