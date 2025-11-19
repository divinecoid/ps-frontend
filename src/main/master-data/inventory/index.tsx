import { columns } from "./column";
import Services from "@/services";
import ModalAddInventory from "./modal-add";
import OverviewPage from "@/components/custom/overview-page";

export default function MasterInventories() {
    return <OverviewPage
        columns={columns}
        source={Services.MasterInventory.index}
        selectable
        actions={[
            <ModalAddInventory />,
        ]} />

}