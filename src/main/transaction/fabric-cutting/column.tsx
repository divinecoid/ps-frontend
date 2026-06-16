import { Badge } from "@/components/ui/badge";
import { FabricCutting } from "@/interfaces/fabric-cutting";
import { formatDateTime } from "@/lib/format-date";
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<FabricCutting>[] = [
  {
    accessorKey: "serial_number",
    header: "Nomor Seri",
    enableSorting: true,
  },
  {
    accessorKey: "fabric.sequence",
    header: "Kode Kain",
    enableSorting: true,
  },
  {
    accessorKey: "created_at",
    header: "Tanggal pengajuan",
    enableSorting: true,
    cell: (({ row }) => {
      return formatDateTime(row.original.created_at)
    })
  },
  {
    accessorKey: "quantity",
    header: "Jumlah Roll",
    enableSorting: true,
  },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: false,
    cell: ({ row }) => {
      const data = row.original;
      switch (data.status) {
        case "OPEN":
          return <Badge variant="secondary">Sedang Berlangsung</Badge>
        case "CLOSED":
          return <Badge variant="success">Selesai</Badge>
      }
    }
  }
]