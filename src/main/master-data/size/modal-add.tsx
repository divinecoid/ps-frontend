import ModalAddItem from "@/components/custom/add-item";
import { BaseForm } from "@/interfaces/base";
import { Size } from "@/interfaces/size";
import Services from "@/services";
import { z } from "zod/v3";

export default function ModalAddSize({ onSubmit, id }: BaseForm) {
    return <ModalAddItem<Size>
        title="Add Size"
        description="Add new size"
        onCreate={Services.MasterSize.store}
        onUpdate={Services.MasterSize.update}
        afterSubmit={onSubmit}
        formShape={[
            {
                key: "code",
                type: "text",
                schema: z.string().min(2, {
                    message: "Code must be at least 2 characters.",
                }),
                label: "Code",
                description: "Input size's code.",
                placeholder: "SZ-001",
            },
            {
                key: "name",
                type: "text",
                schema: z.string(),
                label: "Name",
                description: "Input size's name.",
                placeholder: "Size name",
            },
        ]} />
}