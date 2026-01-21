import { Inbound } from "@/interfaces/inbound";
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<Inbound>[] = [
  {
    accessorKey: "received_date",
    header: "Tanggal",
    enableSorting: true,
    cell: ({ row }) => {
      return row.original.received_date && new Date(row.original.received_date).toLocaleString("id-ID", {
        timeZone: "Asia/Jakarta",
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });
    }
  },
  {
    accessorKey: "user.name",
    header: "Penerima",
    enableSorting: true,
  },
  {
    accessorKey: "request.cmt.name",
    header: "CMT",
    enableSorting: true,
  },
  {
    accessorKey: "warehouse.name",
    header: "Gudang",
    enableSorting: true,
    cell: ({ row }) => {
      return row.original.warehouse?.name ?? '-'
    }
  },
  {
    accessorKey: "notes",
    header: "Catatan",
    enableSorting: true,
  }
]