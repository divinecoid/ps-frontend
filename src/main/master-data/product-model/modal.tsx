import ModalItem from "@/components/custom/modal-item";
import { BaseModalForm } from "@/interfaces/base";
import { ProductModel } from "@/interfaces/product-model";
import Services from "@/services";
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
            {
                key: "size_id",
                type: "multi-combobox",
                schema: z.array(z.string()).nonempty({
                    message: "Ukuran dibutuhkan"
                }),
                source: {
                    api: Services.MasterSize.index,
                    id: "id",
                    label: "name"
                },
                label: "Ukuran",
                description: "Masukkan ukuran model.",
                placeholder: "Ukuran model",
            },
            {
                key: "color_id",
                type: "multi-combobox",
                schema: z.array(z.string()).nonempty({
                    message: "Warna dibutuhkan"
                }),
                source: {
                    api: Services.MasterColor.index,
                    id: "id",
                    label: "name"
                },
                label: "Warna",
                description: "Masukkan warna model.",
                placeholder: "Warna model",
            },
        ]} />
}