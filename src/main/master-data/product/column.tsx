import { Badge } from "@/components/ui/badge";
import { Product } from "@/interfaces/product"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "model.name",
    header: "Model",
    enableSorting: true,
  },
  {
    accessorKey: "rack.name",
    header: "Rak",
    enableSorting: true,
  },
  {
    accessorKey: "series",
    header: "Series",
    enableSorting: true,
  },
  {
    accessorKey: "barcode",
    header: "Barcode",
    enableSorting: true,
    cell: (({ row }) => {
      const barcode = row.original.barcode;
      return (
        <div className="flex items-center gap-2">
          <span>{barcode}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => {
              navigator.clipboard.writeText(barcode);
              toast.success("Barcode berhasil disalin", { richColors: true });
            }}
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      );
    })
  },
  {
    accessorKey: "deleted_at",
    header: "Status produk",
    enableSorting: true,
    cell: (({ row }) => {
      const data = row.original;
      switch (data.deleted_at) {
        case true:
          return <Badge variant="destructive">Nonaktif</Badge>
        case false:
          return <Badge variant="success">Aktif</Badge>
      }
    })
  }
]