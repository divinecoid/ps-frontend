import ModalItem from "@/components/custom/modal-item";
import { BaseForm } from "@/interfaces/base";
import { Color } from "@/interfaces/color";
import { z } from "zod/v3";

export default function ModalColor(props: BaseForm) {
    return <ModalItem<Color>
        title={props.isEdit ? "Edit Color" : "Add Color"}
        description={props.isEdit ? "Edit Color" : "Add new color"}
        {...props}
        formShape={[
            {
                key: "code",
                type: "text",
                schema: z.string().min(2, {
                    message: "Code must be at least 2 characters.",
                }),
                label: "Code",
                description: "Input color's code.",
                placeholder: "COL-001",
            },
            {
                key: "name",
                type: "text",
                schema: z.string(),
                label: "Name",
                description: "Input color's name.",
                placeholder: "Color name",
            },
        ]}
    />
}