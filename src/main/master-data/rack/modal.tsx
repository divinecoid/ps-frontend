import ModalItem from "@/components/custom/modal-item";
import { BaseForm } from "@/interfaces/base";
import { Rack } from "@/interfaces/rack";
import Services from "@/services";
import { z } from "zod/v3";

export default function ModalRack(props: BaseForm) {
    return <ModalItem<Rack>
        title={props.isEdit ? "Edit Rack" : "Add Rack"}
        description={props.isEdit ? "Edit Rack" : "Add new rack"}
        {...props}
        formShape={[
            {
                key: "code",
                type: "text",
                schema: z.string().min(2, {
                    message: "Code must be at least 2 characters.",
                }),
                label: "Code",
                description: "Input rack's code.",
                placeholder: "RC-001",
            },
            {
                key: "name",
                type: "text",
                schema: z.string(),
                label: "Name",
                description: "Input rack's name.",
                placeholder: "Rack name",
            },
            {
                key: "warehouse_id",
                type: "combobox",
                schema: z.string(),
                label: "Warehouse",
                description: "The location where this rack placed.",
                placeholder: "Warehouse",
                source: {
                    id: "id",
                    label: "name",
                    api: Services.MasterWarehouse.index
                }
            },
        ]} />
}