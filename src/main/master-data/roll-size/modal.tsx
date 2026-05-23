import ModalItem from "@/components/custom/modal-item";
import { BaseModalForm } from "@/interfaces/base";
import { RollSize } from "@/interfaces/roll-size";
import { z } from "zod/v3";

export default function ModalFabric(props: BaseModalForm) {
    return <ModalItem<RollSize>
        title={props.isEdit ? "Sunting Kain" : "Tambah Kain"}
        description={props.isEdit ? "Sunting Kain yang sudah ada" : "Tambah Kain baru"}
        {...props}
        formShape={[
            {
                key: "size",
                type: "text",
                schema: z.string().min(2, {
                    message: "Nama ukuran setidaknya memiliki 2 karakter.",
                }),
                label: "Ukuran",
                description: "Masukkan nama ukuran.",
                placeholder: "36 inch",
            },
        ]} />
}