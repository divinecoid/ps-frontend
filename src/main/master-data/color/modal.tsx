import ModalItem from "@/components/custom/modal-item";
import { BaseModalForm } from "@/interfaces/base";
import { Color } from "@/interfaces/color";
import { z } from "zod/v3";

export default function ModalColor(props: BaseModalForm) {
    return <ModalItem<Color>
        title={props.isEdit ? "Sunting Warna" : "Tambah Warna"}
        description={props.isEdit ? "Sunting warna yang sudah ada" : "Tambah warna baru"}
        {...props}
        formShape={[
            {
                key: "code",
                type: "text",
                schema: z.string().min(2, {
                    message: "Kode warna setidaknya memiliki 2 karakter.",
                }),
                label: "Kode",
                description: "Masukkan kode warna.",
                placeholder: "COL-001",
            },
            {
                key: "name",
                type: "text",
                schema: z.string(),
                label: "Nama",
                description: "Masukkan nama warna.",
                placeholder: "Nama warna",
            },
        ]}
    />
}