import { Badge } from "@/components/ui/badge";
import { Configuration } from "@/interfaces/configuration"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<Configuration>[] = [
    {
        accessorKey: "config_key",
        header: "Config Key",
        enableSorting: true,
    },
    {
        accessorKey: "config_value",
        header: "Nilai",
        enableSorting: true,
    },
    {
        accessorKey: "data_type",
        header: "Tipe Data",
        enableSorting: true,
        cell: ({ row }) => {
            const type = row.original.data_type;
            const variantMap: Record<string, "default" | "secondary" | "outline"> = {
                boolean: "default",
                integer: "secondary",
                decimal: "secondary",
                string: "outline",
            };
            return <Badge variant={variantMap[type] ?? "outline"}>{type}</Badge>
        }
    },
    {
        accessorKey: "description",
        header: "Deskripsi",
        enableSorting: true,
    },
    {
        accessorKey: "updated_by",
        header: "Terakhir diubah oleh",
        enableSorting: false,
        cell: ({ row }) => {
            return row.original.updated_by?.name ?? "-"
        }
    },
    {
        accessorKey: "deleted_at",
        header: "Status",
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
