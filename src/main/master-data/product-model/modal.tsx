import ModalItem from "@/components/custom/modal-item";
import { BaseModalForm } from "@/interfaces/base";
import { ProductModel } from "@/interfaces/product-model";
import { z } from "zod/v3";

export default function ModalProductModel(props: BaseModalForm) {
    return <ModalItem<ProductModel>
        title={props.isEdit ? "Sunting Model Produk" : "Tambah Model Produk"}
        description={props.isEdit ? "Sunting model produk yang sudah ada" : "Tambah model produk baru"}
        {...props}
        formShape={[
            {
                key: "sku",
                type: "text",
                schema: z.string().min(2, {
                    message: "SKU setidaknya memiliki 2 karakter.",
                }),
                label: "SKU",
                description: "Masukkan SKU model produk.",
                placeholder: "PRD-001",
            },
            {
                key: "name",
                type: "text",
                schema: z.string(),
                label: "Nama",
                description: "Masukkan nama model produk.",
                placeholder: "Nama model produk",
            },
        ]} />
}