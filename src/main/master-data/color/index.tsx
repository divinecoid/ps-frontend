import { columns } from "./column";
import Services from "@/services";
import ModalColor from "./modal";
import OverviewPage from "@/components/custom/overview-page";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import ModalConfirm from "@/components/custom/modal-confirm";
import DropdownRowActions from "@/components/custom/dropdown-row-actions";

export default function MasterColors() {
    const [editRow, setEditRow] = useState<string|undefined>();
    const [restoreRow, setRestoreRow] = useState<string|undefined>();
    const [deleteRow, setDeleteRow] = useState<string|undefined>();
    return <OverviewPage
        columns={columns}
        source={Services.MasterColor}
        selectable
        actions={(props) => [
            <ModalColor {...props} />,
            <ModalColor {...props} isEdit id={editRow} setId={setEditRow} />,
            <ModalConfirm {...props} action={Services.MasterColor.restore} id={restoreRow} setId={setRestoreRow} title="Apakah anda yakin untuk mengembalikan warna ini?" description="Aksi ini akan memunculkan warna ini kembali ke dalam daftar pilihan." />,
            <ModalConfirm {...props} action={Services.MasterColor.destroy} id={deleteRow} setId={setDeleteRow} title="Apakah anda yakin untuk menghapus warna ini?" description="Aksi ini akan menghilangkan warna ini dari daftar pilihan." />
        ]}
        rowActions={({ row }) => (
            <DropdownRowActions>
                {row.is_deleted ?
                    <DropdownMenuItem onSelect={() => setRestoreRow(row.id)}>Kembalikan</DropdownMenuItem>
                    : <>
                        <DropdownMenuItem onSelect={() => setEditRow(row.id)}>Sunting</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setDeleteRow(row.id)}>Hapus</DropdownMenuItem>
                    </>
                }
            </DropdownRowActions>
        )} />
}
