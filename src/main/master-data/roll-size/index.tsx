import { columns } from "./column";
import Services from "@/services";
import ModalRollSize from "./modal";
import OverviewPage from "@/components/custom/overview-page";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import ModalConfirm from "@/components/custom/modal-confirm";
import DropdownRowActions from "@/components/custom/dropdown-row-actions";
import DatatableSelectAction from "@/components/custom/datatable-select-action";

export default function MasterRollSizes() {
    const [editRow, setEditRow] = useState<string | undefined>();
    const [restoreRow, setRestoreRow] = useState<string | undefined>();
    const [deleteRow, setDeleteRow] = useState<string | undefined>();
    return <OverviewPage
        columns={columns}
        source={Services.MasterRollSize}
        selectable
        actions={(props) => [
            <DatatableSelectAction {...props} action={Services.MasterRollSize.multiDestroy} trigger="Hapus" variant="destructive" title={`Apakah anda yakin untuk menghapus ${props.selectedRows.length} RollSize?`} description={`Aksi ini akan menghilangkan ${props.selectedRows.length} RollSize terpilih dari daftar pilihan.`} />,
            <ModalRollSize {...props} />,
            <ModalRollSize {...props} isEdit id={editRow} setId={setEditRow} />,
            <ModalConfirm {...props} action={Services.MasterRollSize.restore} id={restoreRow} setId={setRestoreRow} title="Apakah anda yakin untuk mengembalikan RollSize ini?" description="Aksi ini akan memunculkan RollSize ini kembali ke daftar pilihan." />,
            <ModalConfirm {...props} action={Services.MasterRollSize.destroy} id={deleteRow} setId={setDeleteRow} title="Apakah anda yakin untuk menghapus RollSize ini?" description="Aksi ini akan menghilangkan RollSize ini dari daftar pilihan." />,
        ]}
        rowActions={({ row }) => (
            <DropdownRowActions>
                {row.deleted_at ?
                    <DropdownMenuItem onSelect={() => setRestoreRow(row.id)}>Kembalikan</DropdownMenuItem>
                    : <>
                        <DropdownMenuItem onSelect={() => setEditRow(row.id)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setDeleteRow(row.id)}>Hapus</DropdownMenuItem>
                    </>
                }
            </DropdownRowActions>
        )} />
}