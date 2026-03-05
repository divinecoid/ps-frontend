import { Inbound } from "@/interfaces/inbound";
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<Inbound>[] = [
  {
    accessorKey: "cmt.code",
    header: "Kode CMT",
    enableSorting: true,
  },
  {
    accessorKey: "cmt.name",
    header: "Nama CMT",
    enableSorting: true,
  },
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
    accessorKey: "name",
    header: "Penerima",
    enableSorting: true,
  },
  {
    accessorKey: "items",
    header: "Jumlah barang",
    enableSorting: true,
  }
]