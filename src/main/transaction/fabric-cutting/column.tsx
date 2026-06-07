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
      const isCompleted = row.original.request_detail.every(
        detail =>
          detail.req_dozen_qty === detail.rec_dozen_qty &&
          detail.req_piece_qty === detail.rec_piece_qty
      );

      return isCompleted
        ? <Badge variant="success">Selesai</Badge>
        : <Badge variant="secondary">Sedang Berlangsung</Badge>
    }
  }
]