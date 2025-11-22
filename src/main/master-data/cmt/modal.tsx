import ModalItem from "@/components/custom/modal-item";
import { BaseForm } from "@/interfaces/base";
import { CMT } from "@/interfaces/cmt";
import Services from "@/services";
import { z } from "zod/v3";

export default function ModalCMT({ onSubmit, isEdit, id, setId }: BaseForm) {
    return <ModalItem<CMT>
        title={isEdit ? "Edit CMT" : "Add CMT"}
        description={isEdit ? "Edit CMT" : "Add new CMT"}
        services={Services.MasterCMT}
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