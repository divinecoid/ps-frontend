import ModalItem from "@/components/custom/modal-item";
import { BaseForm } from "@/interfaces/base";
import { Size } from "@/interfaces/size";
import Services from "@/services";
import { z } from "zod/v3";

export default function ModalSize({ onSubmit, isEdit, id, setId }: BaseForm) {
    return <ModalItem<Size>
        title={isEdit ? "Edit Size" : "Add Size"}
        description={isEdit ? "Edit size" : "Add new size"}
        services={Services.MasterSize}
        isEdit={isEdit}
        id={id}
        setId={setId}
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
