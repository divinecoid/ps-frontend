import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Product } from "@/interfaces/product"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "sku",
    header: "SKU",
    enableSorting: true,
  },
  {
    accessorKey: "color.name",
    header: "Color name",
    enableSorting: true,
  },
  {
    accessorKey: "model.name",
    header: "Model name",
    enableSorting: true,
  },
  {
    accessorKey: "size.name",
    header: "Size name",
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