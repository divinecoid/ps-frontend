import ModalItem from "@/components/custom/modal-item";
import { BaseModalForm } from "@/interfaces/base";
import { CMT } from "@/interfaces/cmt";
import { z } from "zod/v3";

export default function ModalCMT(props: BaseModalForm) {
    return <ModalItem<CMT>
        title={props.isEdit ? "Edit CMT" : "Add CMT"}
        description={props.isEdit ? "Edit CMT" : "Add new CMT"}
        {...props}
        formShape={[
            {
                key: "code",
                type: "text",
                schema: z.string().min(2, {
                    message: "Code must be at least 2 characters.",
                }),
                label: "Code",
                description: "Input CMT's code.",
                placeholder: "CMT-001",
            },
            {
                key: "name",
                type: "text",
                schema: z.string(),
                label: "Name",
                description: "Input CMT's name.",
                placeholder: "CMT name",
            },
        ]} />
}