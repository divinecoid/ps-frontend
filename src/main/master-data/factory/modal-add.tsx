import ModalAddItem from "@/components/custom/add-item";
import Services from "@/services";
import { z } from "zod/v3";

export default function ModalAddFactory({ id }: { id?: string }) {
    return <ModalAddItem
        title="Add Factory"
        description="Add new factory"
        onCreate={Services.MasterFactory.store}
        onUpdate={Services.MasterFactory.update}
        formShape={[
            {
                key: "code",
                type: "text",
                schema: z.string().min(2, {
                    message: "Code must be at least 2 characters.",
                }),
                label: "Code",
                description: "Input factory's code.",
                placeholder: "FCT-001",
            },
            {
                key: "name",
                type: "text",
                schema: z.string(),
                label: "Name",
                description: "Input factory's name.",
                placeholder: "Factory name",
            },
        ]} />
}