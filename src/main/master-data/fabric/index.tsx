import { columns } from "./column";
import Services from "@/services";
import ModalFabric from "./modal";
import OverviewPage from "@/components/custom/overview-page";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import ModalConfirm from "@/components/custom/modal-confirm";
import DropdownRowActions from "@/components/custom/dropdown-row-actions";
import DatatableSelectAction from "@/components/custom/datatable-select-action";

export default function MasterFabrics() {
    const [editRow, setEditRow] = useState<string | undefined>();
    const [restoreRow, setRestoreRow] = useState<string | undefined>();
    const [deleteRow, setDeleteRow] = useState<string | undefined>();
    return <OverviewPage
        columns={columns}
        source={Services.MasterFabric}
        selectable
        actions={(props) => [
            <DatatableSelectAction {...props} action={Services.MasterFabric.multiDestroy} trigger="Hapus" variant="destructive" title={`Apakah anda yakin untuk menghapus ${props.selectedRows.length} Fabric?`} description={`Aksi ini akan menghilangkan ${props.selectedRows.length} Fabric terpilih dari daftar pilihan.`} />,
            <ModalFabric {...props} />,
            <ModalFabric {...props} isEdit id={editRow} setId={setEditRow} />,
            <ModalConfirm {...props} action={Services.MasterFabric.restore} id={restoreRow} setId={setRestoreRow} title="Apakah anda yakin untuk mengembalikan Fabric ini?" description="Aksi ini akan memunculkan Fabric ini kembali ke daftar pilihan." />,
            <ModalConfirm {...props} action={Services.MasterFabric.destroy} id={deleteRow} setId={setDeleteRow} title="Apakah anda yakin untuk menghapus Fabric ini?" description="Aksi ini akan menghilangkan Fabric ini dari daftar pilihan." />,
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