import { columns } from "./column";
import Services from "@/services";
import ModalCMT from "./modal";
import OverviewPage from "@/components/custom/overview-page";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import ModalConfirm from "@/components/custom/modal-confirm";
import DropdownRowActions from "@/components/custom/dropdown-row-actions";
import DatatableSelectAction from "@/components/custom/datatable-select-action";
import { useAcm } from "@/provider/acm-provider";

export default function MasterCMTs() {
    const [editRow, setEditRow] = useState<string | undefined>();
    const [restoreRow, setRestoreRow] = useState<string | undefined>();
    const [deleteRow, setDeleteRow] = useState<string | undefined>();
    const { canCreate, canUpdate, canDelete } = useAcm("master_cmt");

    return <OverviewPage
        columns={columns}
        source={Services.MasterCMT}
        selectable={canDelete}
        actions={(props) => [
            canDelete && <DatatableSelectAction {...props} action={Services.MasterCMT.multiDestroy} trigger="Hapus" variant="destructive" title={`Apakah anda yakin untuk menghapus ${props.selectedRows.length} CMT?`} description={`Aksi ini akan menghilangkan ${props.selectedRows.length} CMT terpilih dari daftar pilihan.`} />,
            canCreate && <ModalCMT {...props} />,
            canUpdate && <ModalCMT {...props} isEdit id={editRow} setId={setEditRow} />,
            canUpdate && <ModalConfirm {...props} action={Services.MasterCMT.restore} id={restoreRow} setId={setRestoreRow} title="Apakah anda yakin untuk mengembalikan CMT ini?" description="Aksi ini akan memunculkan CMT ini kembali ke daftar pilihan." />,
            canDelete && <ModalConfirm {...props} action={Services.MasterCMT.destroy} id={deleteRow} setId={setDeleteRow} title="Apakah anda yakin untuk menghapus CMT ini?" description="Aksi ini akan menghilangkan CMT ini dari daftar pilihan." />,
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