import ModalItem from "@/components/custom/modal-item";
import { BaseModalForm } from "@/interfaces/base";
import { CMT } from "@/interfaces/cmt";
import { z } from "zod/v3";

export default function ModalCMT(props: BaseModalForm) {
    return <ModalItem<CMT>
        title={props.isEdit ? "Sunting CMT" : "Tambah CMT"}
        description={props.isEdit ? "Sunting CMT yang sudah ada" : "Tambah CMT baru"}
        {...props}
        formShape={[
            {
                key: "code",
                type: "text",
                schema: z.string().min(2, {
                    message: "Kode setidaknya memiliki 2 karakter.",
                }),
                label: "Kode",
                description: "Masukkan kode CMT.",
                placeholder: "CMT-001",
            },
            {
                key: "name",
                type: "text",
                schema: z.string(),
                label: "Nama",
                description: "Masukkan nama CMT.",
                placeholder: "Nama CMT",
            },
            {
                key: "contact_person",
                type: "text",
                schema: z.string(),
                label: "Kontak",
                description: "Masukkan nama kontak CMT.",
                placeholder: "Nama kontak CMT",
            },
            {
                key: "phone",
                type: "tel",
                schema: z.string().regex(/^\d{10,13}$/, { message: `Telepon harus sekitar 10–13 digit`}),
                label: "Telepon",
                description: "Masukkan telepon CMT.",
                placeholder: "Telepon CMT",
            },
            {
                key: "address",
                type: "textarea",
                schema: z.string(),
                label: "Alamat",
                description: "Masukkan alamat CMT.",
                placeholder: "Alamat CMT",
            },
        ]} />
}