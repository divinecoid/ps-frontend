import { columns } from "./column";
import Services from "@/services";
import ModalAddSize from "./modal-add";
import OverviewPage from "@/components/custom/overview-page";

export default function MasterSizes() {
    return <OverviewPage
        columns={columns}
        source={Services.MasterSize.index}
        selectable
        actions={[
            <ModalAddSize />,
        ]} />

}