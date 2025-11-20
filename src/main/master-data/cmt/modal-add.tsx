import ModalAddItem from "@/components/custom/add-item";
import { BaseForm } from "@/interfaces/base";
import { CMT } from "@/interfaces/cmt";
import Services from "@/services";
import { z } from "zod/v3";

export default function ModalAddCMT({ onSubmit, id }: BaseForm ) {
    return <ModalAddItem<CMT>
        title="Add CMT"
        description="Add new CMT"
        onCreate={Services.MasterCMT.store}
        onUpdate={Services.MasterCMT.update}
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