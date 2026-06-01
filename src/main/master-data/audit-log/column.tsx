import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/format-date";
import { ColumnDef } from "@tanstack/react-table";

export interface AuditLog {
  id: string;
  created_at: Date;
  user_id?: string;
  user?: {
    id: string;
    name: string;
    username: string;
  };
  module: string;
  action: string;
  details?: string;
  ip_address?: string;
  user_agent?: string;
}

const moduleLabels: Record<string, string> = {
  gudang_kain: "Gudang Kain",
  gudang_kecil: "Gudang Kecil",
  gudang_besar: "Gudang Besar",
  pembelian_kain: "Pembelian Kain",
  permintaan: "Permintaan CMT",
  penerimaan: "Penerimaan CMT",
  riwayat_penerimaan: "Riwayat Penerimaan",
  mutasi: "Mutasi Gudang",
  pesanan: "Pesanan Toko Online",
  master_gudang: "Master Gudang",
  master_rak: "Master Rak",
  master_cmt: "Master CMT",
  master_product: "Master Product",
  master_ukuran: "Master Ukuran",
  master_warna: "Master Warna",
  master_model: "Master Model",
  master_pabrik: "Master Pabrik",
  master_roll_size: "Master Ukuran Roll",
  master_toko: "Master Toko Online",
  master_marketplace: "Master Marketplace",
  master_konfigurasi: "Konfigurasi",
  audit_log: "Audit Log",
  auth: "Autentikasi",
  user: "Pengguna",
  role: "Peran",
  acm: "Access Control Matrix"
};

const actionColors: Record<string, string> = {
  CREATE: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50",
  UPDATE: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50",
  DELETE: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50",
  "FORCE DELETE": "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50",
  RESTORE: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/30 dark:text-teal-400 dark:border-teal-900/50",
  LOGIN: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/50",
  LOGOUT: "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-950/30 dark:text-slate-400 dark:border-slate-900/50",
};

export const columns: ColumnDef<AuditLog>[] = [
  {
    accessorKey: "created_at",
    header: "Waktu Aktivitas",
    enableSorting: true,
    cell: ({ row }) => formatDateTime(row.original.created_at),
  },
  {
    header: "Pengguna",
    cell: ({ row }) => {
      const user = row.original.user;
      if (!user) return <span className="text-muted-foreground italic">Sistem / Unknown</span>;
      return (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{user.name}</span>
          <span className="text-xs text-muted-foreground">@{user.username}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "module",
    header: "Modul",
    enableSorting: true,
    cell: ({ row }) => {
      const mod = row.original.module;
      return <span className="font-semibold">{moduleLabels[mod] || mod}</span>;
    },
  },
  {
    accessorKey: "action",
    header: "Aksi",
    enableSorting: true,
    cell: ({ row }) => {
      const action = row.original.action;
      const customClass = actionColors[action] || "bg-secondary text-secondary-foreground border-transparent";
      return (
        <Badge variant="outline" className={customClass}>
          {action}
        </Badge>
      );
    },
  },
  {
    accessorKey: "details",
    header: "Detail Aktivitas",
    enableSorting: true,
    cell: ({ row }) => {
      return <span className="text-sm font-normal text-muted-foreground break-all">{row.original.details || "-"}</span>;
    },
  },
  {
    accessorKey: "ip_address",
    header: "IP Address",
    enableSorting: true,
    cell: ({ row }) => {
      return <span className="text-xs font-mono text-muted-foreground">{row.original.ip_address || "-"}</span>;
    },
  }
];
