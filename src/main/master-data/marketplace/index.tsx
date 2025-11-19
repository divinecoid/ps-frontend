import { columns } from "./column";
import Services from "@/services";
import ModalAddMarketplace from "./modal-add";
import OverviewPage from "@/components/custom/overview-page";

export default function MasterMarketplaces() {
    return <OverviewPage
        columns={columns}
        source={Services.MasterMarketplace.index}
        selectable
        actions={[
            <ModalAddMarketplace />,
        ]} />

}