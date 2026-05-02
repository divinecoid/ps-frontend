import { columns } from "./column";
import Services from "@/services";
import ModalRole from "./modal";
import OverviewPage from "@/components/custom/overview-page";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import ModalConfirm from "@/components/custom/modal-confirm";
import DropdownRowActions from "@/components/custom/dropdown-row-actions";
import DatatableSelectAction from "@/components/custom/datatable-select-action";

export default function MasterRoles() {
    const [editRow, setEditRow] = useState<string|undefined>();
    const [restoreRow, setRestoreRow] = useState<string|undefined>();
    const [deleteRow, setDeleteRow] = useState<string|undefined>();
    return <OverviewPage
        columns={columns}
        source={Services.MasterRole}
        selectable
        actions={(props) => [
            <DatatableSelectAction {...props} action={Services.MasterRole.multiDestroy} trigger="Hapus" variant="destructive" title={`Apakah anda yakin untuk menghapus ${props.selectedRows.length} peran?`} description={`Aksi ini akan menghilangkan ${props.selectedRows.length} peran terpilih dari daftar pilihan.`} />,
            <ModalRole {...props} />,
            <ModalRole {...props} isEdit id={editRow} setId={setEditRow} />,
            <ModalConfirm {...props} action={Services.MasterRole.restore} id={restoreRow} setId={setRestoreRow} title="Apakah anda yakin untuk mengembalikan peran ini?" description="Aksi ini akan memunculkan peran ini kembali ke dalam daftar pilihan." />,
            <ModalConfirm {...props} action={Services.MasterRole.destroy} id={deleteRow} setId={setDeleteRow} title="Apakah anda yakin untuk menghapus peran ini?" description="Aksi ini akan menghilangkan peran ini dari daftar pilihan." />
        ]}
        rowActions={({ row }) => (
            <DropdownRowActions>
                {row.deleted_at ?
                    <DropdownMenuItem onSelect={() => setRestoreRow(row.id)}>Kembalikan</DropdownMenuItem>
                    : <>
                        <DropdownMenuItem onSelect={() => setEditRow(row.id)}>Sunting</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setDeleteRow(row.id)}>Hapus</DropdownMenuItem>
                    </>
                }
            </DropdownRowActions>
        )} />
}