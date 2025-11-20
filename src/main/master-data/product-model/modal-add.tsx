import ModalAddItem from "@/components/custom/add-item";
import { BaseForm } from "@/interfaces/base";
import { ProductModel } from "@/interfaces/product-model";
import Services from "@/services";
import { z } from "zod/v3";

export default function ModalAddProductModel({ onSubmit, id }: BaseForm) {
    return <ModalAddItem<ProductModel>
        title="Add Product Model"
        description="Add new product model"
        onCreate={Services.MasterProductModel.store}
        onUpdate={Services.MasterProductModel.update}
        afterSubmit={onSubmit}
        formShape={[
            {
                key: "code",
                type: "text",
                schema: z.string().min(2, {
                    message: "Code must be at least 2 characters.",
                }),
                label: "Code",
                description: "Input product model's code.",
                placeholder: "PRD-001",
            },
            {
                key: "name",
                type: "text",
                schema: z.string(),
                label: "Name",
                description: "Input product model's name.",
                placeholder: "Product model name",
            },
        ]} />
}