import { columns } from "./column";
import Services from "@/services";
import ModalAddCMT from "./modal-add";
import OverviewPage from "@/components/custom/overview-page";

export default function MasterCMTs() {
    return <OverviewPage
        columns={columns}
        source={Services.MasterCMT.index}
        selectable
        actions={({ refresh }) => [
            <ModalAddCMT onSubmit={refresh} />,
        ]} />

}