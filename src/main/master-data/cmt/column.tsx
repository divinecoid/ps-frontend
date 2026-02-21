import { Badge } from "@/components/ui/badge";
import { CMT } from "@/interfaces/cmt";
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<CMT>[] = [
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
    accessorKey: "contact_person",
    header: "Kontak",
    enableSorting: true,
  },
  {
    accessorKey: "phone",
    header: "Telepon",
    enableSorting: true,
  },
  {
    accessorKey: "address",
    header: "Alamat",
    enableSorting: true,
  },
  {
    accessorKey: "deleted_at",
    header: "Status CMT",
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