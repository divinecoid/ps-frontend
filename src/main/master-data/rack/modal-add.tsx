import ModalAddItem from "@/components/custom/add-item";
import { BaseForm } from "@/interfaces/base";
import { Rack } from "@/interfaces/rack";
import Services from "@/services";
import { z } from "zod/v3";

export default function ModalAddRack({ onSubmit, id }: BaseForm) {
    return <ModalAddItem<Rack>
        title="Add Rack"
        description="Add new rack"
        onCreate={Services.MasterRack.store}
        onUpdate={Services.MasterRack.update}
        afterSubmit={onSubmit}
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
                source: {
                    id: "id",
                    label: "name",
                    api: Services.MasterWarehouse.index
                }
            },
        ]} />
}