import { columns } from "./column";
import Services from "@/services";
import OverviewPage from "@/components/custom/overview-page";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import ConfirmRack from "./confirm";
import DropdownRowActions from "@/components/custom/dropdown-row-actions";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ModalRack from "./modal";
import DatatableSelectAction from "@/components/custom/datatable-select-action";

export default function MasterExample() {
    const [deleteRow, setDeleteRow] = useState<string>();
    return <OverviewPage
        columns={columns}
        source={Services.TransactionRequest}
        actions={(props) => [
            <DatatableSelectAction {...props} action={Services.MasterRack.multiDestroy} trigger="Hapus" variant="destructive" title={`Apakah anda yakin untuk menghapus ${props.selectedRows.length} contoh?`} description={`Aksi ini akan menghilangkan ${props.selectedRows.length} contoh terpilih dari daftar pilihan.`} />,
            <ModalRack {...props} />,
            <Button asChild variant="outline"><Link to={`./new`}><Plus />Tambah</Link></Button>,
            <ConfirmRack {...props} action={Services.MasterRack.destroy} id={deleteRow} setId={setDeleteRow} title="Apakah anda yakin untuk membatalkan contoh ini?" description="Contoh ini akan dibatalkan." />
        ]}
        rowActions={({ row }) => (
            <DropdownRowActions>
                <DropdownMenuItem asChild><Link to={`./edit/${row.id}`}>Sunting</Link></DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setDeleteRow(row.id)}>Hapus</DropdownMenuItem>
            </DropdownRowActions>
        )}
    />
}
