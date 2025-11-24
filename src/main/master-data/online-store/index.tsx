import { columns } from "./column";
import Services from "@/services";
import ModalOnlineStore from "./modal";
import OverviewPage from "@/components/custom/overview-page";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import ModalConfirm from "@/components/custom/modal-confirm";
import { MarketplaceViewResponse } from "@/interfaces/marketplace";

export default function MasterOnlineStores() {
    const [editRow, setEditRow] = useState<number>();
    const [restoreRow, setRestoreRow] = useState<number>();
    const [deleteRow, setDeleteRow] = useState<number>();

    const getMarketplaceAlias = async (id: number): Promise<string> => {
        try {
            if (id) {
                const res = await Services.MasterMarketplace.show(id);
                if (res.ok) {
                    const json: MarketplaceViewResponse = await res.json();
                    return json.data.alias;
                }
            }
            return undefined;
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }

    const authOnlineStore = async (id: number, successUrl: string) => {
        await window.electronAPI.startOauth(`${import.meta.env.VITE_APP_BASE_URL}/${await getMarketplaceAlias(id)}/login/${id}`, successUrl);
    }

    return <OverviewPage
        columns={columns}
        source={Services.MasterOnlineStore}
        selectable
        actions={(props) => [
            <ModalOnlineStore {...props} />,
            <ModalOnlineStore {...props} isEdit id={editRow} setId={setEditRow} />,
            <ModalConfirm {...props} action={Services.MasterOnlineStore.restore} id={restoreRow} setId={setRestoreRow} title="Are you want to restore this object?" description="This action will restore this object back to active state." />,
            <ModalConfirm {...props} action={Services.MasterOnlineStore.destroy} id={deleteRow} setId={setDeleteRow} title="Are you want to delete this object?" description="This action will set this object to inactive state." />
        ]}
        rowActions={({ row }) => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    {row.is_deleted ?
                        <DropdownMenuItem onSelect={() => setRestoreRow(row.id)}>Restore</DropdownMenuItem>
                        : <>
                            <DropdownMenuItem onSelect={() => authOnlineStore(row.id, row.store_url)}>Connect</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => setEditRow(row.id)}>Edit</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => setDeleteRow(row.id)}>Delete</DropdownMenuItem>
                        </>
                    }
                </DropdownMenuContent>
            </DropdownMenu>
        )}
    />
}
