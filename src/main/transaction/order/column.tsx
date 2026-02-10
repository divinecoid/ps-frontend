import { Badge } from "@/components/ui/badge";
import { Order } from "@/interfaces/order";
import { formatDate } from "@/lib/format-date";
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "awb_code",
    header: "Nomor resi",
    enableSorting: true,
  },
  {
    accessorKey: "read_at",
    header: "Waktu penyiapan",
    enableSorting: true,
    cell: (({ row }) => {
      return row.original.read_at ? formatDate(row.original.read_at) : "-";
    })
  },
  {
    accessorKey: "prepared_at",
    header: "Waktu penyiapan",
    enableSorting: true,
    cell: (({ row }) => {
      return row.original.prepared_at ? formatDate(row.original.prepared_at) : "-";
    })
  },
  {
    accessorKey: "readytoship_at",
    header: "Tanggal siap dikirim",
    enableSorting: true,
    cell: (({ row }) => {
      return row.original.readytoship_at ? formatDate(row.original.readytoship_at) : "-";
    })
  },
  {
    accessorKey: "item_count",
    header: "Jumlah barang",
    enableSorting: true,
  },
  {
    accessorKey: "unique_item_count",
    header: "Jumlah barang unik",
    enableSorting: true,
  },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: true,
    cell: (({ row }) => {
      const data = row.original;
      switch (data.status) {
        case "delivered":
          return <Badge variant="success">{data.status}</Badge>
        case "pending":
        case "prepared":
        case "read":
        case "shipped":
        case "ready_to_ship":
          return <Badge variant="secondary">{data.status}</Badge>
        case "cancelled":
        case "returned":
          return <Badge variant="destructive">{data.status}</Badge>
      }
    })
  },

]