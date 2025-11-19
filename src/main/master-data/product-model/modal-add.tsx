import ModalAddItem from "@/components/custom/add-item";
import { z } from "zod/v3";

export default function ModalAddProductModel({ id }: { id?: string }) {

    const onSubmit = (values) => {
        console.log(JSON.stringify(values))
    };

    const onError = (errors) => {
        console.log(errors);
    };
    return <ModalAddItem
        title="Add Product Model"
        description="Add new product model"
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
                description: "Input product model's code.",
                placeholder: "R001",
            },
            {
                key: "name",
                type: "text",
                schema: z.string(),
                label: "Name",
                description: "Input product model's name.",
                placeholder: "Item product model name",
            },
        ]} />
}