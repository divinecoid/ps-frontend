import ModalItem from "@/components/custom/modal-item";
import { BaseModalForm } from "@/interfaces/base";
import { User } from "@/interfaces/user";
import Services from "@/services";
import { z } from "zod/v3";

export default function ModalUser(props: BaseModalForm) {
    return <ModalItem<User>
        title={props.isEdit ? "Sunting Pengguna" : "Tambah pengguna"}
        description={props.isEdit ? "Sunting pengguna yang sudah ada" : "Tambah pengguna baru"}
        {...props}
        formShape={[
            {
                key: "name",
                type: "text",
                schema: z.string().nonempty("Nama lengkap dibutuhkan"),
                label: "Nama lengkap",
                description: "Masukkan nama lengkap.",
                placeholder: "Nama lengkap",
            },
            {
                key: "username",
                type: "text",
                schema: z.string().nonempty("Nama pengguna dibutuhkan"),
                label: "Nama pengguna",
                description: "Masukkan nama pengguna.",
                placeholder: "Nama pengguna",
            },
            {
                key: "email",
                type: "text",
                schema: z.string().nonempty("Email dibutuhkan"),
                label: "Email",
                description: "Masukkan email.",
                placeholder: "Email pengguna",
            },
            {
                key: "password",
                type: "password",
                passwordEdit: props.isEdit,
                schema: props.isEdit ? z.string().optional() : z.string().nonempty("Kata sandi dibutuhkan"),
                label: "Kata sandi",
                description: "Masukkan kata sandi pengguna.",
                placeholder: "Kata sandi pengguna",
            },
            {
                key: "role_id",
                type: "multi-combobox",
                schema: z.array(z.string()).nonempty({
                    message: "Peran dibutuhkan"
                }),
                source: {
                    api: Services.MasterRole.index,
                    id: "id",
                    label: "name"
                },
                label: "Peran",
                description: "Masukkan peran pengguna.",
                placeholder: "Peran pengguna",
            },
        ]} />
}