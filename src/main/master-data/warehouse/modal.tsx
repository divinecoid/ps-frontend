import ModalItem from "@/components/custom/modal-item";
import { BaseForm } from "@/interfaces/base";
import { Warehouse } from "@/interfaces/warehouse";
import { z } from "zod/v3";

export default function ModalWarehouse(props: BaseForm) {
    return <ModalItem<Warehouse>
        title={props.isEdit ? "Edit Warehouse" : "Add Warehouse"}
        description={props.isEdit ? "Edit Warehouse" : "Add new warehouse"}
        {...props}
        formShape={[
            {
                key: "code",
                type: "text",
                schema: z.string().min(2, {
                    message: "Code must be at least 2 characters.",
                }),
                label: "Code",
                description: "Input warehouse's code.",
                placeholder: "WH-001",
            },
            {
                key: "name",
                type: "text",
                schema: z.string(),
                label: "Name",
                description: "Input warehouse's name.",
                placeholder: "Warehouse name",
            },
            {
                key: "priority",
                type: "number",
                schema: z.coerce.number().min(1, {
                    message: "Number must be positive"
                }),
                label: "Priority",
                description: "Warehouse's priority",
                placeholder: "1",
            },
        ]} />
}