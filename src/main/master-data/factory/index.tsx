import { columns } from "./column";
import Services from "@/services";
import ModalAddFactory from "./modal-add";
import OverviewPage from "@/components/custom/overview-page";

export default function MasterFactories() {
    return <OverviewPage
        columns={columns}
        source={Services.MasterFactory.index}
        selectable
        actions={({ refresh }) => [
            <ModalAddFactory onSubmit={refresh} />,
        ]} />

}