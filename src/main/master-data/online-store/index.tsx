import { columns } from "./column";
import Services from "@/services";
import ModalMarketplace from "./modal";
import OverviewPage from "@/components/custom/overview-page";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";

export default function MasterMarketplaces() {
    const [editRow, setEditRow] = useState<number>();
    return <OverviewPage
        columns={columns}
        source={Services.MasterMarketplace.index}
        selectable
        actions={(props) => [
            <ModalMarketplace {...props} />,
            <ModalMarketplace {...props} isEdit id={editRow} setId={setEditRow} />
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
                    <DropdownMenuItem onSelect={() => setEditRow(row.id)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )}
    />
}
