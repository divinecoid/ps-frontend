import ModalAddItem from "@/components/custom/add-item";
import { Warehouse } from "@/interfaces/warehouse";
import Services from "@/services";
import { z } from "zod/v3";

export default function ModalAddWarehouse({ id }: { id?: string }) {
    return <ModalAddItem<Warehouse>
        title="Add Rack"
        description="Add new rack"
        onCreate={Services.MasterWarehouse.store}
        onUpdate={Services.MasterWarehouse.update}
        formShape={[
            {
                key: "code",
                type: "text",
                schema: z.string().min(2, {
                    message: "Code must be at least 2 characters.",
                }),
                label: "Code",
                description: "Input warehouse's code.",
                placeholder: "WH001",
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
                schema: z.number().min(1, {
                    message: "Number must be positive"
                }),
                label: "Priority",
                description: "Warehouse's priority",
                placeholder: "1"
            },
        ]} />
}