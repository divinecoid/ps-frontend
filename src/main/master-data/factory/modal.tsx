import ModalItem from "@/components/custom/modal-item";
import { BaseForm } from "@/interfaces/base";
import { Factory } from "@/interfaces/factory";
import Services from "@/services";
import { z } from "zod/v3";

export default function ModalFactory({ onSubmit, isEdit, id, setId }: BaseForm) {
    return <ModalItem<Factory>
        title={isEdit ? "Edit Factory" : "Add Factory"}
        description={isEdit ? "Edit factory" : "Add new factory"}
        onCreate={Services.MasterFactory.store}
        onUpdate={Services.MasterFactory.update}
        onView={Services.MasterFactory.show}
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