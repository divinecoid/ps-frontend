import { Badge } from "@/components/ui/badge";
import { ReturnReceipt } from "@/interfaces/return-receipt";
import { formatDate } from "@/lib/format-date";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<ReturnReceipt>[] = [
  {
    accessorKey: "awb_code",
    header: "No AWB.",
    enableSorting: true,
  },
  {
    accessorKey: "order.marketplace.name",
    header: "Marketplace",
    enableSorting: true,
    cell: ({ row }) => row.original.order?.marketplace?.name ?? "-",
  },
  {
    accessorKey: "order.customer_name",
    header: "Customer",
    enableSorting: true,
    cell: ({ row }) => row.original.order?.customer_name ?? "-",
  },
  {
    accessorKey: "created_at",
    header: "Tanggal Retur",
    enableSorting: true,
    cell: ({ row }) => formatDate(row.original.created_at),
  },
  {
    accessorKey: "received_at",
    header: "Tanggal Terima",
    enableSorting: true,
    cell: ({ row }) =>
      row.original.received_at ? formatDate(row.original.received_at) : "-",
  },
  {
    accessorKey: "return_status",
    header: "STATUS",
    enableSorting: true,
    cell: ({ row }) => {
      const status = row.original.return_status.toLowerCase();
      switch (status) {
        case "received":
          return <Badge variant="success">DITERIMA</Badge>;
        case "partial":
          return <Badge variant="default">PARTIAL</Badge>;
        case "pending":
        default:
          return <Badge variant="secondary">PENDING</Badge>;
      }
    },
  },
];
