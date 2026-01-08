import { columns } from "./column";
import Services from "@/services";
import ModalOnlineStore from "./modal";
import OverviewPage from "@/components/custom/overview-page";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useEffect, useRef, useState } from "react";
import ModalConfirm from "@/components/custom/modal-confirm";
import { MarketplaceViewResponse } from "@/interfaces/marketplace";
import { toast } from "sonner";
import DropdownRowActions from "@/components/custom/dropdown-row-actions";

export default function MasterOnlineStores() {
    const [editRow, setEditRow] = useState<string|undefined>();
    const [restoreRow, setRestoreRow] = useState<string|undefined>();
    const [deleteRow, setDeleteRow] = useState<string|undefined>();
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
        const url = `${import.meta.env.VITE_APP_BASE_URL}/${await getMarketplaceAlias(marketplace_id)}/login/${id}`;
        await window.electronAPI.startOauth(url, successUrl);
    }

    return <OverviewPage
        columns={columns}
        source={Services.MasterOnlineStore}
        selectable
        onLoadedRef={(fn) => (refreshTableRef.current = fn)}
        actions={(props) => [
            <ModalOnlineStore {...props} />,
            <ModalOnlineStore {...props} isEdit id={editRow} setId={setEditRow} />,
            <ModalConfirm {...props} action={Services.MasterOnlineStore.restore} id={restoreRow} setId={setRestoreRow} title="Apakah anda yakin untuk mengembalikan toko online ini?" description="Aksi ini akan memunculkan toko online ini kembali ke dalam daftar pilihan." />,
            <ModalConfirm {...props} action={Services.MasterOnlineStore.destroy} id={deleteRow} setId={setDeleteRow} title="Apakah anda yakin untuk menghapus toko online ini?" description="Aksi ini akan menghilangkan toko online ini dari daftar pilihan." />
        ]}
        rowActions={({ row }) => (
            <DropdownRowActions>
                {row.is_deleted ?
                    <DropdownMenuItem onSelect={() => setRestoreRow(row.id)}>Kembalikan</DropdownMenuItem>
                    : <>
                        <DropdownMenuItem onSelect={() => authOnlineStore(row.id, row.marketplace_id, row.redirect_uri)}>Sambungkan</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setEditRow(row.id)}>Sunting</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setDeleteRow(row.id)}>Hapus</DropdownMenuItem>
                    </>
                }
            </DropdownRowActions>
        )} />
}
