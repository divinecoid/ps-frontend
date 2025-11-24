import { columns } from "./column";
import Services from "@/services";
import ModalColor from "./modal";
import OverviewPage from "@/components/custom/overview-page";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import ModalConfirm from "@/components/custom/modal-confirm";

export default function MasterColors() {
    const [editRow, setEditRow] = useState<number>();
    const [restoreRow, setRestoreRow] = useState<number>();
    const [deleteRow, setDeleteRow] = useState<number>();
    return <OverviewPage
        columns={columns}
        source={Services.MasterColor}
        selectable
        actions={(props) => [
            <ModalColor {...props} />,
            <ModalColor {...props} isEdit id={editRow} setId={setEditRow} />,
            <ModalConfirm {...props} action={Services.MasterColor.restore} id={restoreRow} setId={setRestoreRow} title="Are you want to restore this object?" description="This action will restore this object back to active state." />,
            <ModalConfirm {...props} action={Services.MasterColor.destroy} id={deleteRow} setId={setDeleteRow} title="Are you want to delete this object?" description="This action will set this object to inactive state." />
        ]}
        rowActions={({ row }) => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    {row.is_deleted ?
                        <DropdownMenuItem onSelect={() => setRestoreRow(row.id)}>Restore</DropdownMenuItem>
                        : <>
                            <DropdownMenuItem onSelect={() => setEditRow(row.id)}>Edit</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => setDeleteRow(row.id)}>Delete</DropdownMenuItem>
                        </>
                    }
                </DropdownMenuContent>
            </DropdownMenu>
        )}
    />
}
