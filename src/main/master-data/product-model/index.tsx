import { columns } from "./column";
import Services from "@/services";
import ModalAddProductModel from "./modal-add";
import OverviewPage from "@/components/custom/overview-page";

export default function MasterProductModels() {
    return <OverviewPage
        columns={columns}
        source={Services.MasterProductModel.index}
        selectable
        actions={({ refresh }) => [
            <ModalAddProductModel onSubmit={refresh} />,
        ]} />

}