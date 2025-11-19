import { columns } from "./column";
import Services from "@/services";
import ModalAddColor from "./modal-add";
import OverviewPage from "@/components/custom/overview-page";

export default function MasterColors() {
    return <OverviewPage
        columns={columns}
        source={Services.MasterColor.index}
        selectable
        actions={[
            <ModalAddColor />,
        ]} />

}