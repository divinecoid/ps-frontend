import { columns } from "./column";
import Services from "@/services";
import ModalAddOnlineStore from "./modal-add";
import OverviewPage from "@/components/custom/overview-page";

export default function MasterOnlineStores() {
    return <OverviewPage
        columns={columns}
        source={Services.MasterOnlineStore.index}
        selectable
        actions={[
            <ModalAddOnlineStore />,
        ]} />

}