import ModalItem from "@/components/custom/modal-item";
import { BaseModalForm } from "@/interfaces/base";
import { Warehouse } from "@/interfaces/warehouse";
import { z } from "zod/v3";

export default function ModalWarehouse(props: BaseModalForm) {
    return <ModalItem<Warehouse>
        title={props.isEdit ? "Sunting Gudang" : "Tambah Gudang"}
        description={props.isEdit ? "Sunting gudang yang sudah ada" : "Tambah gudang baru"}
        {...props}
        formShape={[
            {
                key: "code",
                type: "text",
                schema: z.string().min(2, {
                    message: "Kode setidaknya memiliki 2 karakter.",
                }),
                label: "Kode",
                description: "Masukkan kode gudang.",
                placeholder: "WH-001",
            },
            {
                key: "name",
                type: "text",
                schema: z.string(),
                label: "Nama",
                description: "Masukkan nama gudang.",
                placeholder: "Nama gudang",
            },
            {
                key: "priority",
                type: "number",
                schema: z.coerce.number().min(1, {
                    message: "Prioritas harus positif"
                }),
                label: "Prioritas",
                description: "Prioritas gudang",
                placeholder: "1",
            },
        ]} />
}