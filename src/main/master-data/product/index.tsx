import { columns } from "./column";
import Services from "@/services";
import ModalProduct from "./modal";
import OverviewPage from "@/components/custom/overview-page";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import ModalConfirm from "@/components/custom/modal-confirm";
import DropdownRowActions from "@/components/custom/dropdown-row-actions";
import DatatableSelectAction from "@/components/custom/datatable-select-action";

export default function MasterProducts() {
    const [editRow, setEditRow] = useState<string|undefined>();
    const [restoreRow, setRestoreRow] = useState<string|undefined>();
    const [deleteRow, setDeleteRow] = useState<string|undefined>();
    return <OverviewPage
        columns={columns}
        source={Services.MasterProduct}
        selectable
        actions={(props) => [
            <DatatableSelectAction {...props} action={Services.MasterProduct.multiDestroy} trigger="Hapus" variant="destructive" title={`Apakah anda yakin untuk menghapus ${props.selectedRows.length} produk?`} description={`Aksi ini akan menghilangkan ${props.selectedRows.length} produk terpilih dari daftar pilihan.`} />,
            <ModalProduct {...props} />,
            <ModalProduct {...props} isEdit id={editRow} setId={setEditRow} />,
            <ModalConfirm {...props} action={Services.MasterProduct.restore} id={restoreRow} setId={setRestoreRow} title="Apakah anda yakin untuk mengembalikan produk ini?" description="Aksi ini akan memunculkan produk ini kembali ke dalam daftar pilihan." />,
            <ModalConfirm {...props} action={Services.MasterProduct.destroy} id={deleteRow} setId={setDeleteRow} title="Apakah anda yakin untuk menghapus produk ini?" description="Aksi ini akan menghilangkan produk ini dari daftar pilihan." />
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
