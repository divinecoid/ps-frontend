import ModalAddItem from "@/components/custom/add-item";
import Services from "@/services";
import { z } from "zod/v3";

export default function ModalAddRack({ id }: { id?: string }) {
    return <ModalAddItem
        title="Add Rack"
        description="Add new rack"
        onCreate={Services.MasterRack.store}
        onUpdate={Services.MasterRack.update}
        formShape={[
            {
                key: "code",
                type: "text",
                schema: z.string().min(2, {
                    message: "Code must be at least 2 characters.",
                }),
                label: "Code",
                description: "Input rack's code.",
                placeholder: "R001",
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
                keyId: "id",
                keyLabel: "name",
                source: Services.MasterWarehouse.index
            },
        ]} />
}