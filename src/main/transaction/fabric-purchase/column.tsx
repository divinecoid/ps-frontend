import { Badge } from "@/components/ui/badge";
import { FabricPurchaseRequest } from "@/interfaces/fabric-purchase";
import { formatDateTime } from "@/lib/format-date";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<FabricPurchaseRequest>[] = [
  {
    accessorFn: (row) => row.factory?.name,
    id: "factory_name",
    header: "Pabrik",
    enableSorting: true,
  },
  {
    accessorFn: (row) => row.details?.length ?? 0,
    id: "summary",
    header: "Rincian",
    enableSorting: false,
    cell: ({ row }) => {
      const details = row.original.details ?? [];
      const preview = details.slice(0, 3);
      const previewText = preview
        .map((detail) => detail.color?.name ?? "Tanpa warna")
        .join(", ");

      return (
        <div className="flex flex-col gap-1.5 min-w-[280px]">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="shrink-0 whitespace-nowrap">
              {details.length} warna
            </Badge>
            <span className="min-w-0 text-sm text-muted-foreground truncate">
              {previewText || "Belum ada rincian"}
              {details.length > preview.length
                ? ` +${details.length - preview.length} lagi`
                : ""}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Tanggal",
    enableSorting: true,
    cell: ({ row }) => formatDateTime(row.original.created_at),
  },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: true,
    cell: ({ row }) => {
      switch (row.original.status) {
        case "OPEN":
          return <Badge variant="secondary">Sedang Berlangsung</Badge>;
        case "CLOSED":
          return <Badge variant="success">Selesai</Badge>;
      }
    },
  },
];
