import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { OnlineStore } from "@/interfaces/online-store"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

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
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const data = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(data.id.toString())}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]