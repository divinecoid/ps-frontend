import ModalItem from "@/components/custom/modal-item";
import { BaseModalForm } from "@/interfaces/base";
import { Role } from "@/interfaces/role";
import { z } from "zod/v3";

export default function ModalRole(props: BaseModalForm) {
    return <ModalItem<Role>
        title={props.isEdit ? "Sunting Peran" : "Tambah Peran"}
        description={props.isEdit ? "Sunting peran yang sudah ada" : "Tambah peran baru"}
        {...props}
        formShape={[
            {
                key: "name",
                type: "text",
                schema: z.string(),
                label: "Nama",
                description: "Masukkan nama peran.",
                placeholder: "Nama peran",
            },
            {
                key: "description",
                type: "text",
                schema: z.string(),
                label: "Deskripsi",
                description: "Masukkan deskripsi peran.",
                placeholder: "Deskripsi peran",
            },
        ]} />
}