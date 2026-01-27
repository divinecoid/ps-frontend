import { Badge } from "@/components/ui/badge";
import { Request } from "@/interfaces/request";
import { formatDate } from "@/lib/format-date";
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
      return formatDate(row.original.created_date)
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