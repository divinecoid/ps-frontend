import { columns } from "./column";
import Services from "@/services";
import OverviewPage from "@/components/custom/overview-page";
import { TooltipHover } from "@/components/custom/tooltip-hover";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";

export default function ReceiveLogs() {
    return <OverviewPage
        columns={columns}
        source={Services.TransactionInbound}
        rowActions={({ row }) => (
            <TooltipHover tooltip="Lihat"><Button asChild variant="outline"><Link to={`./${row.id}`}><Eye /></Link></Button></TooltipHover>
        )} />
}