import ModalItem from "@/components/custom/modal-item";
import { BaseForm } from "@/interfaces/base";
import { ProductModel } from "@/interfaces/product-model";
import Services from "@/services";
import { z } from "zod/v3";

export default function ModalProductModel({ onSubmit, isEdit, id, setId }: BaseForm) {
    return <ModalItem<ProductModel>
        title={isEdit ? "Edit Product Model" : "Add Product Model"}
        description={isEdit ? "Edit product model" : "Add new product model"}
        services={Services.MasterProductModel}
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