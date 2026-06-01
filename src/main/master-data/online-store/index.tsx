import { columns } from "./column";
import Services from "@/services";
import ModalOnlineStore from "./modal";
import OverviewPage from "@/components/custom/overview-page";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useEffect, useRef, useState } from "react";
import ModalConfirm from "@/components/custom/modal-confirm";
import { MarketplaceRefreshTokenResponse, MarketplaceViewResponse } from "@/interfaces/marketplace";
import { toast } from "sonner";
import DropdownRowActions from "@/components/custom/dropdown-row-actions";
import DatatableSelectAction from "@/components/custom/datatable-select-action";
import { useAcm } from "@/provider/acm-provider";

export default function MasterOnlineStores() {
    const [editRow, setEditRow] = useState<string|undefined>();
    const [restoreRow, setRestoreRow] = useState<string|undefined>();
    const [deleteRow, setDeleteRow] = useState<string|undefined>();
    const { canCreate, canUpdate, canDelete } = useAcm("master_toko");
    const refreshTableRef = useRef<() => void>(() => { });

    useEffect(() => {
        const handler = () => {
            refreshTableRef.current();
        };
        window.electronAPI.onOauthDone(handler);
        return () => window.electronAPI.removeOauthListener();
    }, []);

    const getMarketplaceAlias = async (id: string): Promise<string|undefined> => {
        try {
            if (id != undefined) {
                const res = await Services.MasterMarketplace.show(id);
                const json: MarketplaceViewResponse = await res.json();
                if (res.ok) {
                    return json.data.alias;
                } else {
                    toast.error(json.message, { richColors: true })
                }
            }
            return undefined;
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message, { richColors: true })
                return undefined;
            }
        }
    }

    const authOnlineStore = async (id: string, marketplace_id: string, successUrl: string) => {
        const baseUrl = typeof window !== "undefined" && !window.electronAPI && window.location.origin
            ? window.location.origin
            : (import.meta.env.VITE_APP_BASE_URL || "");
        const url = `${baseUrl}/${await getMarketplaceAlias(marketplace_id)}/login/${id}`;
        await window.electronAPI.startOauth(url, successUrl);
    }
    const refreshOnlineStore = async (id: string) => {
        try {
            if (id != undefined) {
                const res = await Services.MasterOnlineStore.refreshToken(id);
                const json: MarketplaceRefreshTokenResponse = await res.json();
                if (res.ok) {
                    toast.success(json.message, {richColors: true});
                } else {
                    toast.error(json.message, { richColors: true })
                }
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message, { richColors: true })
            }
        }
    }

    return <OverviewPage
        columns={columns}
        source={Services.MasterOnlineStore}
        selectable={canDelete}
        onLoadedRef={(fn) => (refreshTableRef.current = fn)}
        actions={(props) => [
            canDelete && <DatatableSelectAction {...props} action={Services.MasterOnlineStore.multiDestroy} trigger="Hapus" variant="destructive" title={`Apakah anda yakin untuk menghapus ${props.selectedRows.length} toko online?`} description={`Aksi ini akan menghilangkan ${props.selectedRows.length} toko online terpilih dari daftar pilihan.`} />,
            canCreate && <ModalOnlineStore {...props} />,
            canUpdate && <ModalOnlineStore {...props} isEdit id={editRow} setId={setEditRow} />,
            canUpdate && <ModalConfirm {...props} action={Services.MasterOnlineStore.restore} id={restoreRow} setId={setRestoreRow} title="Apakah anda yakin untuk mengembalikan toko online ini?" description="Aksi ini akan memunculkan toko online ini kembali ke dalam daftar pilihan." />,
            canDelete && <ModalConfirm {...props} action={Services.MasterOnlineStore.destroy} id={deleteRow} setId={setDeleteRow} title="Apakah anda yakin untuk menghapus toko online ini?" description="Aksi ini akan menghilangkan toko online ini dari daftar pilihan." />
        ]}
        rowActions={({ row }) => {
            const hasActions = row.deleted_at ? canUpdate : true; // true because of Sambungkan and Refresh Token
            if (!hasActions) return null;
            return (
                <DropdownRowActions>
                    {row.deleted_at ?
                        (canUpdate && <DropdownMenuItem onSelect={() => setRestoreRow(row.id)}>Kembalikan</DropdownMenuItem>)
                        : <>
                            <DropdownMenuItem onSelect={() => authOnlineStore(row.id, row.marketplace_id, row.redirect_uri)}>Connect</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => refreshOnlineStore(row.id)}>Refresh Token</DropdownMenuItem>
                            {canUpdate && <DropdownMenuItem onSelect={() => setEditRow(row.id)}>Edit</DropdownMenuItem>}
                            {canDelete && <DropdownMenuItem onSelect={() => setDeleteRow(row.id)}>Hapus</DropdownMenuItem>}
                        </>
                    }
                </DropdownRowActions>
            );
        }} />
}
