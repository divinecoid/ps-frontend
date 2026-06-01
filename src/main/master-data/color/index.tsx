import { columns } from "./column";
import Services from "@/services";
import ModalColor from "./modal";
import OverviewPage from "@/components/custom/overview-page";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import ModalConfirm from "@/components/custom/modal-confirm";
import DropdownRowActions from "@/components/custom/dropdown-row-actions";
import DatatableSelectAction from "@/components/custom/datatable-select-action";
import { useAcm } from "@/provider/acm-provider";

export default function MasterColors() {
    const [editRow, setEditRow] = useState<string | undefined>();
    const [restoreRow, setRestoreRow] = useState<string | undefined>();
    const [deleteRow, setDeleteRow] = useState<string | undefined>();
    const [forceDeleteRow, setForceDeleteRow] = useState<string | undefined>();
    const { canCreate, canUpdate, canDelete, canForceDelete } = useAcm("master_warna");

    return <OverviewPage
        columns={columns}
        source={Services.MasterColor}
        selectable={canDelete}
        actions={(props) => [
            canDelete && <DatatableSelectAction {...props} action={Services.MasterColor.multiDestroy} trigger="Hapus" variant="destructive" title={`Apakah anda yakin untuk menghapus ${props.selectedRows.length} warna?`} description={`Aksi ini akan menghilangkan ${props.selectedRows.length} warna terpilih dari daftar pilihan.`} />,
            canForceDelete && <DatatableSelectAction {...props} action={Services.MasterColor.multiForceDestroy} trigger="Hapus Permanen" variant="destructive" title={`Apakah anda yakin untuk menghapus permanen ${props.selectedRows.length} warna?`} description={`Aksi ini akan menghapus ${props.selectedRows.length} warna terpilih secara permanen dari database.`} />,
            canCreate && <ModalColor {...props} />,
            canUpdate && <ModalColor {...props} isEdit id={editRow} setId={setEditRow} />,
            canUpdate && <ModalConfirm {...props} action={Services.MasterColor.restore} id={restoreRow} setId={setRestoreRow} title="Apakah anda yakin untuk mengembalikan warna ini?" description="Aksi ini akan memunculkan warna ini kembali ke dalam daftar pilihan." />,
            canDelete && <ModalConfirm {...props} action={Services.MasterColor.destroy} id={deleteRow} setId={setDeleteRow} title="Apakah anda yakin untuk menghapus warna ini?" description="Aksi ini akan menghilangkan warna ini dari daftar pilihan." />,
            canForceDelete && <ModalConfirm {...props} action={Services.MasterColor.forceDestroy} id={forceDeleteRow} setId={setForceDeleteRow} title="Apakah anda yakin untuk menghapus permanen warna ini?" description="Aksi ini akan menghapus warna ini secara permanen dari database." />
        ]}
        rowActions={(!canUpdate && !canDelete && !canForceDelete) ? undefined : ({ row }) => (
            <DropdownRowActions>
                {row.deleted_at ?
                    <>
                        {canUpdate && <DropdownMenuItem onSelect={() => setRestoreRow(row.id)}>Kembalikan</DropdownMenuItem>}
                        {canForceDelete && <DropdownMenuItem onSelect={() => setForceDeleteRow(row.id)}>Hapus Permanen</DropdownMenuItem>}
                    </>
                    : <>
                        {canUpdate && <DropdownMenuItem onSelect={() => setEditRow(row.id)}>Edit</DropdownMenuItem>}
                        {canDelete && <DropdownMenuItem onSelect={() => setDeleteRow(row.id)}>Hapus</DropdownMenuItem>}
                    </>
                }
            </DropdownRowActions>
        )} />
}
