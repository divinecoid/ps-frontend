import { columns } from "./column";
import Services from "@/services";
import ModalAddRack from "./modal-add";
import OverviewPage from "@/components/custom/overview-page";

export default function MasterRacks() {
    return <OverviewPage
        columns={columns}
        source={Services.MasterRack.index}
        selectable
        actions={[
            <ModalAddRack/>,
        ]} />

}