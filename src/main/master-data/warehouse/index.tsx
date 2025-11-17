import OverviewPage from "@/components/custom/overview-page";
import { columns } from "./column";
import Services from "@/services";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";

export default function MasterWarehouse() {
    return <OverviewPage
    columns={columns}
    source={Services.MasterWarehouse.index}
    selectable
    actions={[
        <Button variant="outline"><Plus />Create</Button>,
        <Button variant="outline"><RefreshCw />Refresh</Button>,
    ]} />
}