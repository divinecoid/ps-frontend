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
        ]} />
}