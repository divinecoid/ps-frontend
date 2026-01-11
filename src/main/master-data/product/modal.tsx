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
                key: "rack_id",
                type: "combobox",
                schema: z.string().nonempty({
                    message: "Rak dibutuhkan.",
                }),
                source: {
                    id: "id",
                    label: "name",
                    api: Services.MasterRack.index
                },
                label: "Rak",
                description: "Masukkan rak produk.",
                placeholder: "Rak produk",
            },
            
            {
                key: "barcode",
                type: "text",
                schema: z.string().min(2, {
                    message: "Barcode produk setidaknya memiliki 2 karakter.",
                }),
                label: "Barcode",
                description: "Masukkan barcode produk.",
                placeholder: "Barcode produk",
            },
        ]}
    />
}