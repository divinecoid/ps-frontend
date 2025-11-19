import ModalAddItem from "@/components/custom/add-item";
import { z } from "zod/v3";

export default function ModalAddWarehouse({ id }: { id?: string }) {
    const onSubmit = (values) => {
        console.log(JSON.stringify(values))
    };
    const onError = (errors) => {
        console.log(errors);
    };
    return <ModalAddItem
        title="Add Rack"
        description="Add new rack"
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
                description: "Input warehouse's code.",
                placeholder: "WH001",
            },
            {
                key: "name",
                type: "text",
                schema: z.string(),
                label: "Name",
                description: "Input warehouse's name.",
                placeholder: "Warehouse name",
            },
            {
                key: "priority",
                type: "number",
                schema: z.number().min(1, {
                    message: "Number must be positive"
                }),
                label: "Priority",
                description: "Warehouse's priority",
                placeholder: "1"
            },
        ]} />
}