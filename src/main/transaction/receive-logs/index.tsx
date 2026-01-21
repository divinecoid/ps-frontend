import { columns } from "./column";
import Services from "@/services";
import OverviewPage from "@/components/custom/overview-page";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import DropdownRowActions from "@/components/custom/dropdown-row-actions";
import { Link } from "react-router-dom";

export default function ReceiveLogs() {
    return <OverviewPage
        columns={columns}
        source={Services.TransactionInbound}
        selectable
        rowActions={({ row }) => (
            <DropdownRowActions>
                <DropdownMenuItem asChild><Link to={`./${row.id}`}>Lihat</Link></DropdownMenuItem>
            </DropdownRowActions>
        )} />
}