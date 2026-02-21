import { Badge } from "@/components/ui/badge";
import { OnlineStore } from "@/interfaces/online-store"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<OnlineStore>[] = [
  {
    accessorKey: "marketplace.name",
    header: "Marketplace",
    enableSorting: true,
  },
  {
    accessorKey: "store_code",
    header: "Store code",
    enableSorting: true,
  },
  {
    accessorKey: "store_name",
    header: "Store name",
    enableSorting: true,
  },
  {
    accessorKey: "api_key",
    header: "API key",
    enableSorting: true,
  },
  {
    accessorKey: "client_id",
    header: "Client id",
    enableSorting: true,
  },
  {
    accessorKey: "client_secret",
    header: "Client secret",
    enableSorting: true,
  },
  {
    accessorKey: "store_url",
    header: "Store URL",
    enableSorting: true,
  },
  {
    accessorKey: "is_active",
    header: "Aktif",
    enableSorting: true,
  },
  {
    accessorKey: "redirect_uri",
    header: "URL pengalihan",
    enableSorting: true,
  },
  {
    accessorKey: "access_token",
    header: "Token akses",
    enableSorting: true,
  },
  {
    accessorKey: "refresh_token",
    header: "Token refresh",
    enableSorting: true,
  },
  {
    accessorKey: "access_token_expires_at",
    header: "Tanggal kadaluarsa token akses",
    enableSorting: true,
  },
  {
    accessorKey: "refresh_token_expires_at",
    header: "Tanggal kadaluarsa token refresh",
    enableSorting: true,
  },
  {
    accessorKey: "deleted_at",
    header: "Status toko online",
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