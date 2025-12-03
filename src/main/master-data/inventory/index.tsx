import { columns } from "./column";
import Services from "@/services";
import ModalInventory from "./modal";
import OverviewPage from "@/components/custom/overview-page";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import ModalConfirm from "@/components/custom/modal-confirm";
import DropdownRowActions from "@/components/custom/dropdown-row-actions";
import { Link } from "react-router-dom";

export default function MasterInventories() {
    const [restoreRow, setRestoreRow] = useState<number>();
    const [deleteRow, setDeleteRow] = useState<number>();
    return <OverviewPage
        columns={columns}
        source={Services.MasterInventory}
        selectable
        actions={(props) => [
            <ModalInventory {...props} />,
            <ModalConfirm {...props} action={Services.MasterInventory.restore} id={restoreRow} setId={setRestoreRow} title="Are you want to restore this object?" description="This action will restore this object back to active state." />,
            <ModalConfirm {...props} action={Services.MasterInventory.destroy} id={deleteRow} setId={setDeleteRow} title="Are you want to delete this object?" description="This action will set this object to inactive state." />
        ]}
        rowActions={({ row }) => (
            <DropdownRowActions>
                {row.is_deleted ?
                    <DropdownMenuItem onSelect={() => setRestoreRow(row.id)}>Restore</DropdownMenuItem>
                    : <>
                        <DropdownMenuItem asChild><Link to={`./edit/${row.id}`}>Edit</Link></DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setDeleteRow(row.id)}>Delete</DropdownMenuItem>
                    </>
                }
            </DropdownRowActions>
        )} />
}
