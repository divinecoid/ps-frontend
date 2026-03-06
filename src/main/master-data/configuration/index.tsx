import { columns } from "./column";
import Services from "@/services";
import ModalConfiguration from "./modal";
import OverviewPage from "@/components/custom/overview-page";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import ModalConfirm from "@/components/custom/modal-confirm";
import DropdownRowActions from "@/components/custom/dropdown-row-actions";
import DatatableSelectAction from "@/components/custom/datatable-select-action";
import HistoryDialog from "./history-dialog";

export default function MasterConfigurations() {
    const [editRow, setEditRow] = useState<string | undefined>();
    const [restoreRow, setRestoreRow] = useState<string | undefined>();
    const [deleteRow, setDeleteRow] = useState<string | undefined>();
    const [historyRow, setHistoryRow] = useState<string | undefined>();
    return <>
        <OverviewPage
            columns={columns}
            source={Services.MasterConfiguration}
            selectable
            actions={(props) => [
                <DatatableSelectAction {...props} action={Services.MasterConfiguration.multiDestroy} trigger="Hapus" variant="destructive" title={`Apakah anda yakin untuk menghapus ${props.selectedRows.length} konfigurasi?`} description={`Aksi ini akan menghilangkan ${props.selectedRows.length} konfigurasi terpilih dari daftar.`} />,
                <ModalConfiguration {...props} />,
                <ModalConfiguration {...props} isEdit id={editRow} setId={setEditRow} />,
                <ModalConfirm {...props} action={Services.MasterConfiguration.restore} id={restoreRow} setId={setRestoreRow} title="Apakah anda yakin untuk mengembalikan konfigurasi ini?" description="Aksi ini akan memunculkan konfigurasi ini kembali ke dalam daftar." />,
                <ModalConfirm {...props} action={Services.MasterConfiguration.destroy} id={deleteRow} setId={setDeleteRow} title="Apakah anda yakin untuk menghapus konfigurasi ini?" description="Aksi ini akan menghilangkan konfigurasi ini dari daftar." />
            ]}
            rowActions={({ row }) => (
                <DropdownRowActions>
                    {row.deleted_at ?
                        <DropdownMenuItem onSelect={() => setRestoreRow(row.id)}>Kembalikan</DropdownMenuItem>
                        : <>
                            <DropdownMenuItem onSelect={() => setEditRow(row.id)}>Sunting</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => setHistoryRow(row.id)}>Riwayat</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => setDeleteRow(row.id)}>Hapus</DropdownMenuItem>
                        </>
                    }
                </DropdownRowActions>
            )} />
        <HistoryDialog id={historyRow} setId={setHistoryRow} />
    </>
}
