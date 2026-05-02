import { columns } from "./column";
import Services from "@/services";
import ModalRack from "./modal";
import OverviewPage from "@/components/custom/overview-page";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import ModalConfirm from "@/components/custom/modal-confirm";
import DropdownRowActions from "@/components/custom/dropdown-row-actions";
import DatatableSelectAction from "@/components/custom/datatable-select-action";

export default function MasterRacks() {
    const [editRow, setEditRow] = useState<string | undefined>();
    const [restoreRow, setRestoreRow] = useState<string | undefined>();
    const [deleteRow, setDeleteRow] = useState<string | undefined>();
    const paperWidthMm = 240;
    const paperHeightMm = 300;

    const handlePrint = async (code: string) => {
        await window.electronAPI.printPreview({
            barcodes: [code],
            dozenBarcodes: [],
            paper: {
                width: paperWidthMm,
                height: paperHeightMm,
            },
        });
    }

    return <OverviewPage
        columns={columns}
        source={Services.MasterRack}
        selectable
        actions={(props) => [
            <DatatableSelectAction {...props} action={Services.MasterRack.multiDestroy} trigger="Hapus" variant="destructive" title={`Apakah anda yakin untuk menghapus ${props.selectedRows.length} rak?`} description={`Aksi ini akan menghilangkan ${props.selectedRows.length} rak terpilih dari daftar pilihan.`} />,
            <ModalRack {...props} />,
            <ModalRack {...props} isEdit id={editRow} setId={setEditRow} />,
            <ModalConfirm {...props} action={Services.MasterRack.restore} id={restoreRow} setId={setRestoreRow} title="Apakah anda yakin untuk mengembalikan rak ini?" description="Aksi ini akan memunculkan rak ini kembali ke dalam daftar pilihan." />,
            <ModalConfirm {...props} action={Services.MasterRack.destroy} id={deleteRow} setId={setDeleteRow} title="Apakah anda yakin untuk menghapus rak ini?" description="Aksi ini akan menghilangkan rak ini dari daftar pilihan." />
        ]}
        rowActions={({ row }) => (
            <DropdownRowActions>
                {row.deleted_at ?
                    <DropdownMenuItem onSelect={() => setRestoreRow(row.id)}>Kembalikan</DropdownMenuItem>
                    : <>
                        <DropdownMenuItem onSelect={() => setEditRow(row.id)}>Sunting</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handlePrint(row.id)}>Cetak QR</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setDeleteRow(row.id)}>Hapus</DropdownMenuItem>
                    </>
                }
            </DropdownRowActions>
        )} />
}
