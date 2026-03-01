import { columns } from "./column";
import Services from "@/services";
import OverviewPage from "@/components/custom/overview-page";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import ModalConfirm from "@/components/custom/modal-confirm";
import DropdownRowActions from "@/components/custom/dropdown-row-actions";
import DatatableSelectAction from "@/components/custom/datatable-select-action";
import { Link } from "react-router-dom";

export default function MasterInventories() {
    const [restoreRow, setRestoreRow] = useState<string | undefined>();
    const [deleteRow, setDeleteRow] = useState<string | undefined>();
    return <OverviewPage
        columns={columns}
        source={Services.MasterInventory}
        selectable
        actions={(props) => [
            <DatatableSelectAction {...props} action={Services.MasterCMT.multiDestroy} trigger="Hapus" variant="destructive" title={`Apakah anda yakin untuk menghapus ${props.selectedRows.length} pabrik?`} description={`Aksi ini akan menghilangkan ${props.selectedRows.length} pabrik terpilih dari daftar pilihan.`} />,
            <ModalConfirm {...props} action={Services.MasterInventory.restore} id={restoreRow} setId={setRestoreRow} title="Apakah anda yakin untuk mengembalikan pabrik ini?" description="Aksi ini akan memunculkan pabrik ini kembali ke daftar pilihan." />,
            <ModalConfirm {...props} action={Services.MasterInventory.destroy} id={deleteRow} setId={setDeleteRow} title="Apakah anda yakin untuk menghapus pabrik ini?" description="Aksi ini akan menghilangkan pabrik ini dari daftar pilihan." />
        ]}
        rowActions={({ row }) => (
            <DropdownRowActions>
                {row.deleted_at ?
                    <DropdownMenuItem onSelect={() => setRestoreRow(row.id)}>Kembalikan</DropdownMenuItem>
                    : <>
                        <DropdownMenuItem asChild><Link to={`./${row.id}`}>Sunting</Link></DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setDeleteRow(row.id)}>Hapus</DropdownMenuItem>
                    </>
                }
            </DropdownRowActions>
        )} />
}
