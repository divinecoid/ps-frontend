import { Badge } from "@/components/ui/badge";
import { RollSize } from "@/interfaces/roll-size";
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<RollSize>[] = [
  {
    accessorKey: "size",
    header: "Ukuran",
    enableSorting: true,
  },
  {
    accessorKey: "deleted_at",
    header: "Status Kain",
    enableSorting: true,
    cell: (({ row }) => {
      const data = row.original;
      switch (data.deleted_at) {
        case true:
          return <Badge variant="destructive">Nonaktif</Badge>
        case false:
          return <Badge variant="success">Aktif</Badge>
      }
    })
  }
]