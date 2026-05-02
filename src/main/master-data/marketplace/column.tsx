import { Badge } from "@/components/ui/badge";
import { Marketplace } from "@/interfaces/marketplace"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<Marketplace>[] = [
  {
    accessorKey: "code",
    header: "Kode",
    enableSorting: true,
  },
  {
    accessorKey: "name",
    header: "Nama",
    enableSorting: true,
  },
  {
    accessorKey: "alias",
    header: "Alias",
    enableSorting: true,
  },
  {
    accessorKey: "base_api_url",
    header: "Base API URL",
    enableSorting: true,
  },
  {
    accessorKey: "description",
    header: "Deskripsi",
    enableSorting: true,
  },
  {
    accessorKey: "is_need_checker",
    header: "Membutuhkan checker",
    enableSorting: true,
  },
  {
    accessorKey: "deleted_at",
    header: "Status marketplace",
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