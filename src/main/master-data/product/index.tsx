import { columns } from "./column";
import Services from "@/services";
import ModalAddProduct from "./modal-add";
import OverviewPage from "@/components/custom/overview-page";

export default function MasterProducts() {
    return <OverviewPage
        columns={columns}
        source={Services.MasterProduct.index}
        selectable
        actions={[
            <ModalAddProduct/>,
        ]} />

}