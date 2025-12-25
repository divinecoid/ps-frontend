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
  },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: true,
    cell: (({ row }) => {
      const data = row.original;
      switch (data.status) {
        case "OPEN":
          return <Badge variant="secondary">Aktif</Badge>
        case "CLOSED":
          return <Badge variant="success">Selesai</Badge>
      }
    })
  }
]