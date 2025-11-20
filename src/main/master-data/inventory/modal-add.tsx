import ModalAddItem from "@/components/custom/add-item";
import Services from "@/services";
import { z } from "zod/v3";

export default function ModalAddInventory({ id }: { id?: string }) {
    return <ModalAddItem
        title="Add Inventory"
        description="Add new inventory"
        onCreate={Services.MasterInventory.store}
        onUpdate={Services.MasterInventory.update}
        formShape={[
            {
                key: "code",
                type: "text",
                schema: z.string().min(2, {
                    message: "Code must be at least 2 characters.",
                }),
                label: "Code",
                description: "Input inventory's code.",
                placeholder: "IVT-001",
            },
            {
                key: "name",
                type: "text",
                schema: z.string(),
                label: "Name",
                description: "Input inventory's name.",
                placeholder: "Inventory name",
            },
        ]} />
}