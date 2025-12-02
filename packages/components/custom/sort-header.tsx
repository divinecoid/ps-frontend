import { Column } from "@tanstack/react-table"
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { ReactNode } from "react";

const SortHeader = <TData, TValue>({
    column,
    children,
}: {
    column: Column<TData, TValue>;
    children: ReactNode;
}) => {
    const changeOrder = () => {
        switch (column.getIsSorted()) {
            case "asc":
                column.toggleSorting(true);
                break;
            case "desc":
                column.clearSorting();
                break;
            default:
                column.toggleSorting(false);
                break;
        }
    }

    return <Button
        variant="ghost"
        onClick={changeOrder}
    >
        {children}
        {column.getIsSorted() === 'asc' ? (
            <ArrowUp />
        ) : column.getIsSorted() === 'desc' ? (
            <ArrowDown />
        ) : (
            <ArrowUpDown />
        )}
    </Button>
}

export default SortHeader;