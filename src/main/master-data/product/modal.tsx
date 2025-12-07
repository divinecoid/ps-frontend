import ModalItem from "@/components/custom/modal-item";
import { BaseModalForm } from "@/interfaces/base";
import { Product } from "@/interfaces/product";
import Services from "@/services";
import { z } from "zod/v3";

export default function ModalProduct(props: BaseModalForm) {
    return <ModalItem<Product>
        title={props.isEdit ? "Edit Product" : "Add Product"}
        description={props.isEdit ? "Edit Product" : "Add new product"}
        {...props}
        formShape={[
            {
                key: "color_id",
                type: "combobox",
                schema: z.number().positive({
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
                schema: z.number().positive({
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
                schema: z.number().positive({
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
        ]}
    />
}