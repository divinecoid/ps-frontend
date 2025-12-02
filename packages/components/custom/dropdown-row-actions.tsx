import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

interface DropdownRowActionProps {
    children?: React.ReactNode;
}

export default function DropdownRowActions({ children }: DropdownRowActionProps) {
    return <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel className="select-none">Actions</DropdownMenuLabel>
                {children}
            </DropdownMenuContent>
        </DropdownMenu>
}