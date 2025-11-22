import { Marketplace } from "@/interfaces/marketplace"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<Marketplace>[] = [
  {
    accessorKey: "code",
    header: "Code",
    enableSorting: true,
  },
  {
    accessorKey: "name",
    header: "Name",
    enableSorting: true,
  },
  {
    accessorKey: "base_api_url",
    header: "Base API URL",
    enableSorting: true,
  },
  {
    accessorKey: "description",
    header: "Description",
    enableSorting: true,
  },
  {
    accessorKey: "is_need_checker",
    header: "Need checker",
    enableSorting: true,
  },
]