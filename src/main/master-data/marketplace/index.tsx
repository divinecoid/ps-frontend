import { columns } from "./column";
import Services from "@/services";
import ModalMarketplace from "./modal";
import OverviewPage from "@/components/custom/overview-page";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import ModalConfirm from "@/components/custom/modal-confirm";
import DropdownRowActions from "@/components/custom/dropdown-row-actions";
import DatatableSelectAction from "@/components/custom/datatable-select-action";
import { useAcm } from "@/provider/acm-provider";

export default function MasterMarketplaces() {
    const [editRow, setEditRow] = useState<string | undefined>();
    const [restoreRow, setRestoreRow] = useState<string | undefined>();
    const [deleteRow, setDeleteRow] = useState<string | undefined>();
    const { canCreate, canUpdate, canDelete } = useAcm("master_marketplace");

    return <OverviewPage
        columns={columns}
        source={Services.MasterMarketplace}
        selectable={canDelete}
        actions={(props) => [
            canDelete && <DatatableSelectAction {...props} action={Services.MasterMarketplace.multiDestroy} trigger="Hapus" variant="destructive" title={`Apakah anda yakin untuk menghapus ${props.selectedRows.length} marketplace?`} description={`Aksi ini akan menghilangkan ${props.selectedRows.length} marketplace terpilih dari daftar pilihan.`} />,
            canCreate && <ModalMarketplace {...props} />,
            canUpdate && <ModalMarketplace {...props} isEdit id={editRow} setId={setEditRow} />,
            canUpdate && <ModalConfirm {...props} action={Services.MasterMarketplace.restore} id={restoreRow} setId={setRestoreRow} title="Apakah anda yakin untuk mengembalikan marketplace ini?" description="Aksi ini akan memunculkan marketplace ini kembali ke dalam daftar pilihan." />,
            canDelete && <ModalConfirm {...props} action={Services.MasterMarketplace.destroy} id={deleteRow} setId={setDeleteRow} title="Apakah anda yakin untuk menghapus marketplace ini?" description="Aksi ini akan menghilangkan marketplace ini dari daftar pilihan." />
        ]}
        rowActions={(!canUpdate && !canDelete) ? undefined : ({ row }) => (
            <DropdownRowActions>
                {row.deleted_at ?
                    (canUpdate && <DropdownMenuItem onSelect={() => setRestoreRow(row.id)}>Kembalikan</DropdownMenuItem>)
                    : <>
                        {canUpdate && <DropdownMenuItem onSelect={() => setEditRow(row.id)}>Edit</DropdownMenuItem>}
                        {canDelete && <DropdownMenuItem onSelect={() => setDeleteRow(row.id)}>Hapus</DropdownMenuItem>}
                    </>
                }
            </DropdownRowActions>
        )} />
}
