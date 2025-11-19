import OverviewPage from "@/components/custom/overview-page";
import { columns } from "./column";
import Services from "@/services";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import ModalAddWarehouse from "./modal-add";

export default function MasterWarehouse() {
    return <OverviewPage
        columns={columns}
        source={Services.MasterWarehouse.index}
        selectable
        actions={[
            <ModalAddWarehouse />,
            <Button variant="outline"><RefreshCw />Refresh</Button>,
        ]} />
}