import { columns } from "./column";
import Services from "@/services";
import ModalFactory from "./modal";
import OverviewPage from "@/components/custom/overview-page";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import ModalConfirm from "@/components/custom/modal-confirm";
import DropdownRowActions from "@/components/custom/dropdown-row-actions";

export default function MasterFactories() {
    const [editRow, setEditRow] = useState<string|undefined>();
    const [restoreRow, setRestoreRow] = useState<string|undefined>();
    const [deleteRow, setDeleteRow] = useState<string|undefined>();
    return <OverviewPage
        columns={columns}
        source={Services.MasterFactory}
        selectable
        actions={(props) => [
            <ModalFactory {...props} />,
            <ModalFactory {...props} isEdit id={editRow} setId={setEditRow} />,
            <ModalConfirm {...props} action={Services.MasterFactory.restore} id={restoreRow} setId={setRestoreRow} title="Apakah anda yakin untuk mengembalikan pabrik ini?" description="Aksi ini akan memunculkan pabrik ini kembali ke daftar pilihan." />,
            <ModalConfirm {...props} action={Services.MasterFactory.destroy} id={deleteRow} setId={setDeleteRow} title="Apakah anda yakin untuk menghapus gudang ini?" description="Aksi ini akan menghilangkan gudang ini dari daftar pilihan." />
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
