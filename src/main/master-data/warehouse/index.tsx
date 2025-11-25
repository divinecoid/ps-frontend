import OverviewPage from "@/components/custom/overview-page";
import { columns } from "./column";
import Services from "@/services";
import ModalWarehouse from "./modal";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import ModalConfirm from "@/components/custom/modal-confirm";
import DropdownRowActions from "@/components/custom/dropdown-row-actions";

export default function MasterWarehouse() {
    const [editRow, setEditRow] = useState<number>();
    const [restoreRow, setRestoreRow] = useState<number>();
    const [deleteRow, setDeleteRow] = useState<number>();
    return <OverviewPage
        columns={columns}
        source={Services.MasterWarehouse}
        selectable
        actions={(props) => [
            <ModalWarehouse {...props} />,
            <ModalWarehouse {...props} isEdit id={editRow} setId={setEditRow} />,
            <ModalConfirm {...props} action={Services.MasterWarehouse.restore} id={restoreRow} setId={setRestoreRow} title="Are you want to restore this object?" description="This action will restore this object back to active state." />,
            <ModalConfirm {...props} action={Services.MasterWarehouse.destroy} id={deleteRow} setId={setDeleteRow} title="Are you want to delete this object?" description="This action will set this object to inactive state." />
        ]}
        rowActions={({ row }) => (
            <DropdownRowActions>
                {row.is_deleted ?
                    <DropdownMenuItem onSelect={() => setRestoreRow(row.id)}>Restore</DropdownMenuItem>
                    : <>
                        <DropdownMenuItem onSelect={() => setEditRow(row.id)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setDeleteRow(row.id)}>Delete</DropdownMenuItem>
                    </>
                }
            </DropdownRowActions>
        )} />
}
