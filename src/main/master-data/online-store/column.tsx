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
    header: "Active",
    enableSorting: true,
  },
  {
    accessorKey: "redirect_uri",
    header: "Redirect URL",
    enableSorting: true,
  },
]