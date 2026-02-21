import { columns } from "./column";
import Services from "@/services";
import ModalSize from "./modal";
import OverviewPage from "@/components/custom/overview-page";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import ModalConfirm from "@/components/custom/modal-confirm";
import DropdownRowActions from "@/components/custom/dropdown-row-actions";

export default function MasterSizes() {
    const [editRow, setEditRow] = useState<string|undefined>();
    const [restoreRow, setRestoreRow] = useState<string|undefined>();
    const [deleteRow, setDeleteRow] = useState<string|undefined>();
    return <OverviewPage
        columns={columns}
        source={Services.MasterSize}
        selectable
        actions={(props) => [
            <ModalSize {...props} />,
            <ModalSize {...props} isEdit id={editRow} setId={setEditRow} />,
            <ModalConfirm {...props} action={Services.MasterSize.restore} id={restoreRow} setId={setRestoreRow} title="Apakah anda yakin untuk mengembalikan ukuran ini?" description="Aksi ini akan memunculkan ukuran ini kembali ke dalam daftar pilihan." />,
            <ModalConfirm {...props} action={Services.MasterSize.destroy} id={deleteRow} setId={setDeleteRow} title="Apakah anda yakin untuk menghapus ukuran ini?" description="Aksi ini akan menghilangkan ukuran ini dari daftar pilihan." />
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
