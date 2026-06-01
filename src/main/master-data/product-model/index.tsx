import { columns } from "./column";
import Services from "@/services";
import ModalProductModel from "./modal";
import OverviewPage from "@/components/custom/overview-page";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import ModalConfirm from "@/components/custom/modal-confirm";
import DropdownRowActions from "@/components/custom/dropdown-row-actions";
import DatatableSelectAction from "@/components/custom/datatable-select-action";
import { useAcm } from "@/provider/acm-provider";

export default function MasterProductModels() {
    const [editRow, setEditRow] = useState<string|undefined>();
    const [restoreRow, setRestoreRow] = useState<string|undefined>();
    const [deleteRow, setDeleteRow] = useState<string|undefined>();
    const { canCreate, canUpdate, canDelete } = useAcm("master_model");

    return <OverviewPage
        columns={columns}
        source={Services.MasterProductModel}
        selectable={canDelete}
        actions={(props) => [
            canDelete && <DatatableSelectAction {...props} action={Services.MasterProductModel.multiDestroy} trigger="Hapus" variant="destructive" title={`Apakah anda yakin untuk menghapus ${props.selectedRows.length} model?`} description={`Aksi ini akan menghilangkan ${props.selectedRows.length} model terpilih dari daftar pilihan.`} />,
            canCreate && <ModalProductModel {...props} />,
            canUpdate && <ModalProductModel {...props} isEdit id={editRow} setId={setEditRow} />,
            canUpdate && <ModalConfirm {...props} action={Services.MasterProductModel.restore} id={restoreRow} setId={setRestoreRow} title="Apakah anda yakin untuk mengembalikan model ini?" description="Aksi ini akan memunculkan model ini kembali ke dalam daftar pilihan." />,
            canDelete && <ModalConfirm {...props} action={Services.MasterProductModel.destroy} id={deleteRow} setId={setDeleteRow} title="Apakah anda yakin untuk menghapus model ini?" description="Aksi ini akan menghilangkan model ini dari daftar pilihan." />
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
