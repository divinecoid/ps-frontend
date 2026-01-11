import ModalItem from "@/components/custom/modal-item";
import { BaseModalForm } from "@/interfaces/base";
import { Rack } from "@/interfaces/rack";
import Services from "@/services";
import { z } from "zod/v3";

export default function ModalRack(props: BaseModalForm) {
    return <ModalItem<Rack>
        title={props.isEdit ? "Sunting Rak" : "Tambah Rak"}
        description={props.isEdit ? "Sunting rak yang sudah ada" : "Tambah rak baru"}
        {...props}
        formShape={[
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
                label: "Nama",
                description: "Masukkan nama rak.",
                placeholder: "Nama rak",
            },
            {
                key: "warehouse_id",
                type: "combobox",
                schema: z.string().nonempty({
                    message: "Gudang dibutuhkan",
                }),
                label: "Gudang",
                description: "Gudang tempat rak ini diletakkan.",
                placeholder: "Gudang",
                source: {
                    id: "id",
                    label: "name",
                    api: Services.MasterWarehouse.index
                }
            },
        ]} />
}