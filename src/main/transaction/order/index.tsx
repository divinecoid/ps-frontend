import { columns } from "./column";
import Services from "@/services";
import OverviewPage from "@/components/custom/overview-page";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, Plus } from "lucide-react";
import { TooltipHover } from "@/components/custom/tooltip-hover";

export default function Order() {

    return <OverviewPage
        columns={columns}
        source={Services.TransactionOrder}
        actions={() => [
            <Button asChild variant="outline"><Link to={`./new`}><Plus />Pengajuan Baru</Link></Button>,
        ]}
        rowActions={({ row }) => (
            <div className="flex gap-2 justify-end">
                <TooltipHover tooltip="Lihat"><Button asChild variant="outline"><Link to={`./${row.id}`}><Eye /></Link></Button></TooltipHover>
            </div>
        )}
    />
}
