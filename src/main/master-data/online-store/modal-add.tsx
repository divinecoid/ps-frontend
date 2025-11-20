import ModalAddItem from "@/components/custom/add-item";
import Services from "@/services";
import { z } from "zod/v3";

export default function ModalAddOnlineStore({ id }: { id?: string }) {
    return <ModalAddItem
        title="Add Online Store"
        description="Add new online store"
        onCreate={Services.MasterOnlineStore.store}
        onUpdate={Services.MasterOnlineStore.update}
        formShape={[
            {
                key: "code",
                type: "text",
                schema: z.string().min(2, {
                    message: "Code must be at least 2 characters.",
                }),
                label: "Code",
                description: "Input online store's code.",
                placeholder: "R001",
            },
            {
                key: "name",
                type: "text",
                schema: z.string(),
                label: "Name",
                description: "Input online store's name.",
                placeholder: "Online store name",
            },
        ]} />
}