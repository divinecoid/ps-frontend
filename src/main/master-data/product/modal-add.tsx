import ModalAddItem from "@/components/custom/add-item";
import Services from "@/services";
import { z } from "zod/v3";

export default function ModalAddProduct({ id }: { id?: string }) {
    return <ModalAddItem
        title="Add Product"
        description="Add new product"
        onCreate={Services.MasterProduct.store}
        onUpdate={Services.MasterProduct.update}
        formShape={[
            {
                key: "code",
                type: "text",
                schema: z.string().min(2, {
                    message: "Code must be at least 2 characters.",
                }),
                label: "Code",
                description: "Input product's code.",
                placeholder: "R001",
            },
            {
                key: "name",
                type: "text",
                schema: z.string(),
                label: "Name",
                description: "Input product's name.",
                placeholder: "Product name",
            },
        ]} />
}