import { BaseForm, BaseModalForm } from "@/interfaces/base";
import { Inventory } from "@/interfaces/inventory";
import Services from "@/services";
import { z } from "zod/v3";
import DetailQuantity from "./detail-quantity";
import ItemForm from "@/components/custom/item-form";
import { useParams } from "react-router-dom";

export default function FormInventory(props: BaseForm) {
    const { id } = useParams();

    return <ItemForm<Inventory>
        id={id}
        disabled
        {...props}
        services={Services.MasterInventory}
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
                key: "detail",
                type: "custom",
                schema: z.array(z.object({
                    series: z.string(),
                    quantity: z.coerce.number()
                })),
                custom: <DetailQuantity rowKey="detail" />
            }
        ]}
    />
}