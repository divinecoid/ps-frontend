import ModalItem from "@/components/custom/modal-item";
import { BaseModalForm } from "@/interfaces/base";
import { Factory } from "@/interfaces/factory";
import { z } from "zod/v3";

export default function ModalFactory(props: BaseModalForm) {
    return <ModalItem<Factory>
        title={props.isEdit ? "Sunting Pabrik" : "Tambah Pabrik"}
        description={props.isEdit ? "Sunting pabrik yang sudah ada" : "Tambah pabrik baru"}
        {...props}
        formShape={[
            {
                key: "code",
                type: "text",
                schema: z.string().min(2, {
                    message: "Kode pabrik setidaknya memiliki 2 karakter.",
                }),
                label: "Kode",
                description: "Masukkan kode pabrik.",
                placeholder: "FCT-001",
            },
            {
                key: "name",
                type: "text",
                schema: z.string(),
                label: "Nama",
                description: "Masukkan nama pabrik.",
                placeholder: "Nama pabrik",
            },
        ]}
    />
}