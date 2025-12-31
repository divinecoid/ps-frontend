import { columns } from "./column";
import Services from "@/services";
import ModalCMT from "./modal";
import OverviewPage from "@/components/custom/overview-page";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import ModalConfirm from "@/components/custom/modal-confirm";
import DropdownRowActions from "@/components/custom/dropdown-row-actions";
import ModalBarcode from "./modal-barcode";

export default function MasterCMTs() {
    const [editRow, setEditRow] = useState<string|undefined>();
    const [restoreRow, setRestoreRow] = useState<string|undefined>();
    const [deleteRow, setDeleteRow] = useState<string|undefined>();
    // const [viewBarcode, setViewBarcode] = useState<string|undefined>();
    return <OverviewPage
        columns={columns}
        source={Services.MasterCMT}
        selectable
        actions={(props) => [
            <ModalCMT {...props} />,
            <ModalCMT {...props} isEdit id={editRow} setId={setEditRow} />,
            <ModalConfirm {...props} action={Services.MasterCMT.restore} id={restoreRow} setId={setRestoreRow} title="Apakah anda yakin untuk mengembalikan CMT ini?" description="Aksi ini akan memunculkan CMT ini kembali ke daftar pilihan." />,
            <ModalConfirm {...props} action={Services.MasterCMT.destroy} id={deleteRow} setId={setDeleteRow} title="Apakah anda yakin untuk menghapus CMT ini?" description="Aksi ini akan menghilangkan CMT ini dari daftar pilihan." />,
            // <ModalBarcode {...props} id={viewBarcode} setId={setViewBarcode} />
        ]}
        rowActions={({ row }) => (
            <DropdownRowActions>
                {row.is_deleted ?
                    <DropdownMenuItem onSelect={() => setRestoreRow(row.id)}>Kembalikan</DropdownMenuItem>
                    : <>
                        {/* <DropdownMenuItem onSelect={() => setViewBarcode(row.id)}>Lihat kode batang</DropdownMenuItem> */}
                        <DropdownMenuItem onSelect={() => setEditRow(row.id)}>Sunting</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setDeleteRow(row.id)}>Hapus</DropdownMenuItem>
                    </>
                }
            </DropdownRowActions>
        )} />
}