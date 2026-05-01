import { columns } from "./column";
import Services from "@/services";
import OverviewPage from "@/components/custom/overview-page";
import { Link } from "react-router-dom";
import { TooltipHover } from "@/components/custom/tooltip-hover";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export default function MasterLargeInventories() {
    return <OverviewPage
        columns={columns}
        source={Services.MasterLargeInventory}
        rowActions={({ row }) => (
            <TooltipHover tooltip="Lihat"><Button asChild variant="outline"><Link to={`./${row.id}`}><Eye /></Link></Button></TooltipHover>
        )} />
}
