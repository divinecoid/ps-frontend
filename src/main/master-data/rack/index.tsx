import { columns } from "./column";
import Services from "@/services";
import ModalRack from "./modal";
import OverviewPage from "@/components/custom/overview-page";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import ModalConfirm from "@/components/custom/modal-confirm";
import DropdownRowActions from "@/components/custom/dropdown-row-actions";
import DatatableSelectAction from "@/components/custom/datatable-select-action";
import { useAcm } from "@/provider/acm-provider";

export default function MasterRacks() {
    const [editRow, setEditRow] = useState<string | undefined>();
    const [restoreRow, setRestoreRow] = useState<string | undefined>();
    const [deleteRow, setDeleteRow] = useState<string | undefined>();
    const { canCreate, canUpdate, canDelete } = useAcm("master_rak");
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
        selectable={canDelete}
        actions={(props) => [
            canDelete && <DatatableSelectAction {...props} action={Services.MasterRack.multiDestroy} trigger="Hapus" variant="destructive" title={`Apakah anda yakin untuk menghapus ${props.selectedRows.length} rak?`} description={`Aksi ini akan menghilangkan ${props.selectedRows.length} rak terpilih dari daftar pilihan.`} />,
            canCreate && <ModalRack {...props} />,
            canUpdate && <ModalRack {...props} isEdit id={editRow} setId={setEditRow} />,
            canUpdate && <ModalConfirm {...props} action={Services.MasterRack.restore} id={restoreRow} setId={setRestoreRow} title="Apakah anda yakin untuk mengembalikan rak ini?" description="Aksi ini akan memunculkan rak ini kembali ke dalam daftar pilihan." />,
            canDelete && <ModalConfirm {...props} action={Services.MasterRack.destroy} id={deleteRow} setId={setDeleteRow} title="Apakah anda yakin untuk menghapus rak ini?" description="Aksi ini akan menghilangkan rak ini dari daftar pilihan." />
        ]}
        rowActions={({ row }) => {
            const hasActions = row.deleted_at ? canUpdate : true; // true because of Cetak QR
            if (!hasActions) return null;
            return (
                <DropdownRowActions>
                    {row.deleted_at ?
                        (canUpdate && <DropdownMenuItem onSelect={() => setRestoreRow(row.id)}>Kembalikan</DropdownMenuItem>)
                        : <>
                            {canUpdate && <DropdownMenuItem onSelect={() => setEditRow(row.id)}>Edit</DropdownMenuItem>}
                            <DropdownMenuItem onSelect={() => handlePrint(row.code)}>Cetak QR</DropdownMenuItem>
                            {canDelete && <DropdownMenuItem onSelect={() => setDeleteRow(row.id)}>Hapus</DropdownMenuItem>}
                        </>
                    }
                </DropdownRowActions>
            );
        }} />
}
