import { Badge } from "@/components/ui/badge";
import { Inventory } from "@/interfaces/inventory"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<Inventory>[] = [
  {
    accessorKey: "serial_number",
    header: "Serial number",
    enableSorting: true,
  },
  {
    accessorKey: "product.sku",
    header: "Product SKU",
    enableSorting: true,
  },
  {
    accessorKey: "factory.name",
    header: "Factory name",
    enableSorting: true,
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    enableSorting: true,
  },
  {
    accessorKey: "cmt.name",
    header: "CMT name",
    enableSorting: true,
  },
  {
    accessorKey: "rack.name",
    header: "Rack name",
    enableSorting: true,
  },
  {
    accessorKey: "barcode_group",
    header: "Barcode group",
    enableSorting: true,
  },
  {
    accessorKey: "is_deleted",
    header: "Deleted",
    enableSorting: true,
    cell: (({ row }) => {
      const data = row.original;
      switch (data.is_deleted) {
        case true:
          return <Badge variant="destructive">Deleted</Badge>
        case false:
          return <Badge variant="secondary">Active</Badge>
      }
    })
  }
]