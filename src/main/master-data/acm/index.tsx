import { useEffect, useState, useCallback } from "react";
import Services from "@/services";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ShieldCheck, Save } from "lucide-react";

interface Role {
    id: string;
    name: string;
}

interface PermissionRow {
    menu_key: string;
    label: string;
    can_create: boolean;
    can_read: boolean;
    can_update: boolean;
    can_delete: boolean;
    can_force_delete: boolean;
}

type CrudField = 'can_create' | 'can_read' | 'can_update' | 'can_delete' | 'can_force_delete';

const COLUMNS: { field: CrudField; label: string }[] = [
    { field: 'can_create', label: 'Create' },
    { field: 'can_read',   label: 'Read' },
    { field: 'can_update', label: 'Update' },
    { field: 'can_delete', label: 'Soft Delete' },
    { field: 'can_force_delete', label: 'Force Delete' },
];

const GROUPS: { label: string; keys: string[] }[] = [
    { label: "Gudang",                keys: ["gudang_kain", "gudang_kecil", "gudang_besar"] },
    { label: "Transaksi Kain",        keys: ["pembelian_kain"] },
    { label: "Transaksi CMT",         keys: ["permintaan", "penerimaan", "riwayat_penerimaan"] },
    { label: "Mutasi Gudang",         keys: ["mutasi"] },
    { label: "Transaksi Toko Online", keys: ["pesanan"] },
    {
        label: "Master Data",
        keys: [
            "master_gudang", "master_rak", "master_cmt", "master_product",
            "master_ukuran", "master_warna", "master_model", "master_pabrik",
            "master_roll_size", "master_toko", "master_marketplace", "master_konfigurasi",
        ],
    },
    {
        label: "Administrasi",
        keys: ["audit_log"],
    },
];

export default function AcmPage() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [selectedRoleId, setSelectedRoleId] = useState<string>("");
    const [permissions, setPermissions] = useState<PermissionRow[]>([]);
    const [loadingRoles, setLoadingRoles] = useState(true);
    const [loadingPerms, setLoadingPerms] = useState(false);
    const [saving, setSaving] = useState(false);

    // Load roles
    useEffect(() => {
        const fetchRoles = async () => {
            setLoadingRoles(true);
            try {
                const res = await Services.MasterRole.master(1, 999, "", "");
                if (res.ok) {
                    const json = await res.json();
                    setRoles(json.data ?? []);
                }
            } finally {
                setLoadingRoles(false);
            }
        };
        fetchRoles();
    }, []);

    // Load permissions when role changes
    useEffect(() => {
        if (!selectedRoleId) return;
        const fetchPerms = async () => {
            setLoadingPerms(true);
            try {
                const res = await Services.Acm.getByRole(selectedRoleId);
                if (res.ok) {
                    const json = await res.json();
                    if (json.success) {
                        setPermissions(json.data.permissions);
                    }
                }
            } finally {
                setLoadingPerms(false);
            }
        };
        fetchPerms();
    }, [selectedRoleId]);

    // Toggle a single cell
    const toggleCell = useCallback((menuKey: string, field: CrudField) => {
        setPermissions(prev =>
            prev.map(p => p.menu_key === menuKey ? { ...p, [field]: !p[field] } : p)
        );
    }, []);

    // Compute whether all rows are checked for a given column
    const isAllChecked = useCallback((field: CrudField) => {
        return permissions.length > 0 && permissions.every(p => p[field]);
    }, [permissions]);

    const isIndeterminate = useCallback((field: CrudField) => {
        const checkedCount = permissions.filter(p => p[field]).length;
        return checkedCount > 0 && checkedCount < permissions.length;
    }, [permissions]);

    // Select-all toggle for a column
    const toggleAll = useCallback((field: CrudField) => {
        const allChecked = isAllChecked(field);
        setPermissions(prev =>
            prev.map(p => ({ ...p, [field]: !allChecked }))
        );
    }, [isAllChecked]);

    const handleSave = async () => {
        if (!selectedRoleId) return;
        setSaving(true);
        try {
            const payload = permissions.map(({ menu_key, can_create, can_read, can_update, can_delete, can_force_delete }) => ({
                menu_key, can_create, can_read, can_update, can_delete, can_force_delete,
            }));
            const res = await Services.Acm.upsert(selectedRoleId, payload);
            if (res.ok) {
                const json = await res.json();
                if (json.success) {
                    toast.success("Permission berhasil disimpan", { richColors: true });
                } else {
                    toast.error(json.message ?? "Gagal menyimpan", { richColors: true });
                }
            } else {
                toast.error("Gagal menyimpan permission", { richColors: true });
            }
        } catch {
            toast.error("Terjadi kesalahan", { richColors: true });
        } finally {
            setSaving(false);
        }
    };

    const permMap = new Map(permissions.map(p => [p.menu_key, p]));

    return (
        <div className="flex-1 p-8 pt-6 space-y-6 bg-zinc-50 dark:bg-zinc-950 min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-zinc-900 dark:bg-zinc-800 rounded-lg">
                        <ShieldCheck className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">Access Control Matrix</h1>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">Atur izin akses CRUD per role untuk setiap menu</p>
                    </div>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={!selectedRoleId || saving || loadingPerms}
                    className="bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-700 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 gap-2"
                >
                    <Save className="w-4 h-4" />
                    {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
            </div>

            {/* Role Selector */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-6">
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Pilih Role</label>
                {loadingRoles ? (
                    <Skeleton className="h-10 w-[240px]" />
                ) : (
                    <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
                        <SelectTrigger className="w-[240px] bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
                            <SelectValue placeholder="Pilih role..." />
                        </SelectTrigger>
                        <SelectContent>
                            {roles.map(r => (
                                <SelectItem key={r.id} value={r.id}>
                                    {r.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
                {!selectedRoleId && !loadingRoles && (
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-2">Pilih role untuk melihat dan mengatur permission-nya.</p>
                )}
            </div>

            {/* Permission Matrix */}
            {selectedRoleId && (
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden">

                    {/* Table Header with Select-All checkboxes */}
                    <div className="grid grid-cols-[1fr_100px_100px_100px_100px_100px] border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/40">
                        <div className="px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                            Menu
                        </div>
                        {COLUMNS.map(({ field, label }) => (
                            <div key={field} className="px-4 py-4 flex flex-col items-center justify-between text-center h-full gap-2">
                                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block min-h-[32px] flex items-center justify-center">{label}</span>
                                {!loadingPerms && permissions.length > 0 && (
                                    <div className="flex flex-col items-center gap-1 mt-auto">
                                        <Checkbox
                                            id={`select-all-${field}`}
                                            checked={isAllChecked(field)}
                                            data-state={isIndeterminate(field) ? "indeterminate" : isAllChecked(field) ? "checked" : "unchecked"}
                                            onCheckedChange={() => toggleAll(field)}
                                            className="border-zinc-300 dark:border-zinc-700 data-[state=checked]:bg-zinc-900 dark:data-[state=checked]:bg-zinc-100 dark:data-[state=checked]:text-zinc-900 data-[state=checked]:border-zinc-900 dark:data-[state=checked]:border-zinc-100 data-[state=indeterminate]:bg-zinc-400 dark:data-[state=indeterminate]:bg-zinc-500 data-[state=indeterminate]:border-zinc-400 dark:data-[state=indeterminate]:border-zinc-500"
                                        />
                                        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">Semua</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {loadingPerms ? (
                        <div className="p-6 space-y-3">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <Skeleton key={i} className="h-12 w-full rounded-lg" />
                            ))}
                        </div>
                    ) : (
                        <div>
                            {GROUPS.map((group) => {
                                const groupPerms = group.keys
                                    .map(key => permMap.get(key))
                                    .filter(Boolean) as PermissionRow[];
                                if (groupPerms.length === 0) return null;

                                return (
                                    <div key={group.label}>
                                        {/* Group Header */}
                                        <div className="px-6 py-2.5 bg-zinc-50 dark:bg-zinc-900/30 border-t border-b border-zinc-100 dark:border-zinc-800">
                                            <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                                                {group.label}
                                            </span>
                                        </div>

                                        {groupPerms.map((perm, pi) => (
                                            <div
                                                key={perm.menu_key}
                                                className={`grid grid-cols-[1fr_100px_100px_100px_100px_100px] items-center hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40 transition-colors ${pi < groupPerms.length - 1 ? 'border-b border-zinc-100 dark:border-zinc-800' : ''}`}
                                            >
                                                <div className="px-6 py-4">
                                                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{perm.label}</span>
                                                </div>
                                                {COLUMNS.map(({ field }) => (
                                                    <div key={field} className="flex items-center justify-center px-4 py-4">
                                                        <Checkbox
                                                            id={`${perm.menu_key}-${field}`}
                                                            checked={perm[field]}
                                                            onCheckedChange={() => toggleCell(perm.menu_key, field)}
                                                            className="border-zinc-300 dark:border-zinc-700 data-[state=checked]:bg-zinc-900 dark:data-[state=checked]:bg-zinc-100 dark:data-[state=checked]:text-zinc-900 data-[state=checked]:border-zinc-900 dark:data-[state=checked]:border-zinc-100"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
