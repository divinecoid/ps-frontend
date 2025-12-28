import ModalItem from "@/components/custom/modal-item";
import { BaseModalForm } from "@/interfaces/base";
import { Product } from "@/interfaces/product";
import Services from "@/services";
import { z } from "zod/v3";

export default function ModalProduct(props: BaseModalForm) {
    return <ModalItem<Product>
        title={props.isEdit ? "Sunting Produk" : "Tambah Produk"}
        description={props.isEdit ? "Sunting produk yang sudah ada" : "Tambah produk baru"}
        {...props}
        formShape={[
            {
                key: "color_id",
                type: "combobox",
                schema: z.string().nonempty({
                    message: "Warna dibutuhkan.",
                }),
                source: {
                    id: "id",
                    label: "name",
                    api: Services.MasterColor.index
                },
                label: "Warna",
                description: "Masukkan warna produk.",
                placeholder: "Warna produk",
            },
            {
                key: "model_id",
                type: "combobox",
                schema: z.string().nonempty({
                    message: "Model dibutuhkan.",
                }),
                source: {
                    id: "id",
                    label: "name",
                    api: Services.MasterProductModel.index
                },
                label: "Model",
                description: "Masukkan model produk.",
                placeholder: "Model produk",
            },
            {
                key: "size_id",
                type: "combobox",
                schema: z.string().nonempty({
                    message: "Ukuran dibutuhkan.",
                }),
                source: {
                    id: "id",
                    label: "name",
                    api: Services.MasterSize.index
                },
                label: "Ukuran",
                description: "Masukkan ukuran produk.",
                placeholder: "Ukuran produk",
            },
            {
                key: "sku",
                type: "text",
                schema: z.string().min(2, {
                    message: "SKU produk setidaknya memiliki 2 karakter.",
                }),
                label: "SKU",
                description: "Masukkan SKU produk.",
                placeholder: "SKU produk",
            },
        ]}
    />
}