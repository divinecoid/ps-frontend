import ModalItem from "@/components/custom/modal-item";
import { BaseModalForm } from "@/interfaces/base";
import { Size } from "@/interfaces/size";
import { z } from "zod/v3";

export default function ModalSize(props: BaseModalForm) {
    return <ModalItem<Size>
        title={props.isEdit ? "Sunting Ukuran" : "Tambah Ukuran"}
        description={props.isEdit ? "Sunting ukuran yang sudah ada" : "Tambah ukuran baru"}
        {...props}
        formShape={[
            {
                key: "code",
                type: "text",
                schema: z.string().min(2, {
                    message: "Kode setidaknya memiliki 2 karakter.",
                }),
                label: "Kode",
                description: "Masukkan kode ukuran.",
                placeholder: "SZ-001",
            },
            {
                key: "name",
                type: "text",
                schema: z.string(),
                label: "Nama",
                description: "Masukkan nama ukuran.",
                placeholder: "Nama ukuran",
            },
        ]} />
}
