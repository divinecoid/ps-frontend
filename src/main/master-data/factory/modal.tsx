import ModalItem from "@/components/custom/modal-item";
import { BaseForm } from "@/interfaces/base";
import { Factory } from "@/interfaces/factory";
import { z } from "zod/v3";

export default function ModalFactory(props: BaseForm) {
    return <ModalItem<Factory>
        title={props.isEdit ? "Edit Factory" : "Add Factory"}
        description={props.isEdit ? "Edit factory" : "Add new factory"}
        {...props}
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
        ]}
    />
}