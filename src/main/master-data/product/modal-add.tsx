import ModalAddItem from "@/components/custom/add-item";
import { BaseForm } from "@/interfaces/base";
import { Product } from "@/interfaces/product";
import Services from "@/services";
import { z } from "zod/v3";

export default function ModalAddProduct({ onSubmit, id }: BaseForm) {
    return <ModalAddItem<Product>
        title="Add Product"
        description="Add new product"
        onCreate={Services.MasterProduct.store}
        onUpdate={Services.MasterProduct.update}
        afterSubmit={onSubmit}
        formShape={[
            {
                key: "color_id",
                type: "combobox",
                schema: z.string().nonempty({
                    message: "Color must be selected.",
                }),
                source: {
                    id: "id",
                    label: "name",
                    api: Services.MasterColor.index
                },
                label: "Color",
                description: "Input product's color.",
                placeholder: "Product's color",
            },
            {
                key: "model_id",
                type: "combobox",
                schema: z.string().nonempty({
                    message: "Model must be selected.",
                }),
                source: {
                    id: "id",
                    label: "name",
                    api: Services.MasterProductModel.index
                },
                label: "Model",
                description: "Input product's model.",
                placeholder: "Product's model",
            },
            {
                key: "size_id",
                type: "combobox",
                schema: z.string().nonempty({
                    message: "Size must be selected.",
                }),
                source: {
                    id: "id",
                    label: "name",
                    api: Services.MasterSize.index
                },
                label: "Size",
                description: "Input product's size.",
                placeholder: "Product's size",
            },

            {
                key: "sku",
                type: "text",
                schema: z.string().min(2, {
                    message: "Product SKU must be at least 2 characters.",
                }),
                label: "SKU",
                description: "Input product's SKU.",
                placeholder: "Product's SKU",
            },
        ]} />
}