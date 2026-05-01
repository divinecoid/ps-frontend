import { BaseForm } from "@/interfaces/base";
import { SmallInventory } from "@/interfaces/inventory-small";
import Services from "@/services";
import { z } from "zod/v3";
import DetailQuantity from "./detail-quantity";
import ItemForm from "@/components/custom/item-form";
import { useParams } from "react-router-dom";

export default function FormSmallInventory(props: BaseForm) {
    const { id } = useParams();

    return <ItemForm<SmallInventory>
        id={id}
        disabled
        {...props}
        services={Services.MasterSmallInventory}
        formShape={[
            {
                key: "warehouse_id",
                type: "combobox",
                schema: z.string().nonempty({
                    message: "Gudang dibutuhkan.",
                }),
                source: {
                    id: "id",
                    label: "name",
                    api: Services.MasterWarehouse.index
                },
                label: "Gudang",
                description: "Masukkan gudang.",
                placeholder: "Gudang",
            },
            {
                key: "code",
                type: "text",
                schema: z.string().min(2, {
                    message: "Code setidaknya memiliki 2 karakter.",
                }),
                label: "Kode",
                description: "Masukkan kode rak.",
                placeholder: "RC-001",
            },
            {
                key: "name",
                type: "text",
                schema: z.string(),
                label: "Rak",
                description: "Masukkan nama rak.",
                placeholder: "Nama rak",
            },
            {
                key: "products",
                type: "custom",
                schema: z.array(z.object({
                    series: z.string(),
                    quantity: z.coerce.number()
                })),
                custom: <DetailQuantity rowKey="products" />
            }
        ]}
    />
}