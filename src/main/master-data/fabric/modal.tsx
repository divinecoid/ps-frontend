import ModalItem from "@/components/custom/modal-item";
import { BaseModalForm } from "@/interfaces/base";
import { Fabric } from "@/interfaces/fabric";
import Services from "@/services";
import { z } from "zod/v3";

export default function ModalFabric(props: BaseModalForm) {
    return <ModalItem<Fabric>
        title={props.isEdit ? "Sunting Kain" : "Tambah Kain"}
        description={props.isEdit ? "Sunting Kain yang sudah ada" : "Tambah Kain baru"}
        {...props}
        formShape={[
            {
                key: "sequence",
                type: "text",
                schema: z.string().min(2, {
                    message: "Sequence setidaknya memiliki 2 karakter.",
                }),
                label: "Series",
                description: "Masukkan series.",
                placeholder: "FCT001-RED.0001",
            },
            {
                key: "factory_id",
                type: "combobox",
                schema: z.string().nonempty({
                    message: "Pabrik dibutuhkan",
                }),
                label: "Pabrik",
                description: "Pabrik",
                placeholder: "Pabrik",
                source: {
                    id: "id",
                    label: "name",
                    api: Services.MasterFactory.index
                }
            },
            {
                key: "gram",
                type: "text",
                schema: z.string().min(2, {
                    message: "Grammasi setidaknya memiliki 2 karakter.",
                }),
                label: "Grammasi",
                description: "Masukkan grammasi.",
                placeholder: "200-210/210-240",
            },
            {
                key: "roll_size_id",
                type: "combobox",
                schema: z.string().nonempty({
                    message: "Pabrik dibutuhkan",
                }),
                label: "Setting",
                description: "Ukuran setting roll kain",
                placeholder: "36/38/42 inch",
                source: {
                    id: "id",
                    label: "size",
                    api: Services.MasterRollSize.index
                }
            },
            {
                key: "color_id",
                type: "combobox",
                schema: z.string().nonempty({
                    message: "Warna dibutuhkan",
                }),
                label: "Warna",
                description: "Warna kain",
                placeholder: "Warna",
                source: {
                    id: "id",
                    label: "name",
                    api: Services.MasterColor.index
                }
            },
            {
                key: "quantity",
                type: "number",
                schema: z.coerce.number(),
                label: "Jumlah",
                description: "Masukkan jumlah.",
                placeholder: "12",
            },
        ]} />
}