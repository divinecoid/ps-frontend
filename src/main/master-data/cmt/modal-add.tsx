import ModalAddItem from "@/components/custom/add-item";
import { z } from "zod/v3";

export default function ModalAddCMT({ id }: { id?: string }) {

    const onSubmit = (values) => {
        console.log(JSON.stringify(values))
    };

    const onError = (errors) => {
        console.log(errors);
    };
    return <ModalAddItem
        title="Add CMT"
        description="Add new CMT"
        onSubmit={onSubmit}
        onError={onError}
        formShape={[
            {
                key: "code",
                type: "text",
                schema: z.string().min(2, {
                    message: "Code must be at least 2 characters.",
                }),
                label: "Code",
                description: "Input CMT's code.",
                placeholder: "R001",
            },
            {
                key: "name",
                type: "text",
                schema: z.string(),
                label: "Name",
                description: "Input CMT's name.",
                placeholder: "Item CMT name",
            },
        ]} />
}