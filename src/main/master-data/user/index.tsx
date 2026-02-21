import { columns } from "./column";
import Services from "@/services";
import ModalUser from "./modal";
import OverviewPage from "@/components/custom/overview-page";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import ModalConfirm from "@/components/custom/modal-confirm";
import DropdownRowActions from "@/components/custom/dropdown-row-actions";

export default function MasterUsers() {
    const [editRow, setEditRow] = useState<string|undefined>();
    const [restoreRow, setRestoreRow] = useState<string|undefined>();
    const [deleteRow, setDeleteRow] = useState<string|undefined>();
    return <OverviewPage
        columns={columns}
        source={Services.MasterUser}
        selectable
        actions={(props) => [
            <ModalUser {...props} />,
            <ModalUser {...props} isEdit id={editRow} setId={setEditRow} />,
            <ModalConfirm {...props} action={Services.MasterUser.restore} id={restoreRow} setId={setRestoreRow} title="Apakah anda yakin untuk mengembalikan pengguna ini?" description="Aksi ini akan memunculkan pengguna ini kembali ke daftar pilihan." />,
            <ModalConfirm {...props} action={Services.MasterUser.destroy} id={deleteRow} setId={setDeleteRow} title="Apakah anda yakin untuk menghapus pengguna ini?" description="Aksi ini akan menghilangkan pengguna ini dari daftar pilihan." />
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