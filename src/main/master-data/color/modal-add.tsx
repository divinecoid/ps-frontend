import ModalAddItem from "@/components/custom/add-item";
import { BaseForm } from "@/interfaces/base";
import { Color } from "@/interfaces/color";
import Services from "@/services";
import { z } from "zod/v3";

export default function ModalAddColor({ onSubmit, id }: BaseForm) {
    return <ModalAddItem<Color>
        title="Add Color"
        description="Add new color"
        onCreate={Services.MasterColor.store}
        onUpdate={Services.MasterColor.update}
        afterSubmit={onSubmit}
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
        ]} />
}