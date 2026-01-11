import { Badge } from "@/components/ui/badge";
import { Request } from "@/interfaces/request";
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<Request>[] = [
  {
    accessorKey: "cmt.code",
    header: "Kode CMT",
    enableSorting: true,
  },
  {
    accessorKey: "created_date",
    header: "Tanggal pengajuan",
    enableSorting: true,
    cell: (({ row }) => {
      return new Date(row.original.created_date).toLocaleString("id-ID", {
        timeZone: "Asia/Jakarta",
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });
    })
  },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: true,
    cell: (({ row }) => {
      const data = row.original;
      switch (data.status) {
        case "OPEN":
          return <Badge variant="secondary">Sedang Berlangsung</Badge>
        case "CLOSED":
          return <Badge variant="success">Selesai</Badge>
      }
    })
  }
]