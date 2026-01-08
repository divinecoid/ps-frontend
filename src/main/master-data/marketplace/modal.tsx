import ModalItem from "@/components/custom/modal-item";
import { BaseModalForm } from "@/interfaces/base";
import { Marketplace } from "@/interfaces/marketplace";
import { z } from "zod/v3";

export default function ModalMarketplace(props: BaseModalForm) {
    return <ModalItem<Marketplace>
        title={props.isEdit ? "Sunting Marketplace" : "Tambah Marketplace"}
        description={props.isEdit ? "Sunting marketplace yang sudah ada" : "Tambah marketplace baru"}
        {...props}
        formShape={[
            {
                key: "code",
                type: "text",
                schema: z.string().min(2, {
                    message: "Kode setidaknya memiliki 2 karakter.",
                }),
                label: "Kode",
                description: "Masukkan kode marketplace.",
                placeholder: "MKP-001",
            },
            {
                key: "name",
                type: "text",
                schema: z.string(),
                label: "Nama",
                description: "Masukkan nama marketplace.",
                placeholder: "Nama marketplace",
            },
            {
                key: "alias",
                type: "text",
                schema: z.string(),
                label: "Alias",
                description: "Masukkan alias marketplace.",
                placeholder: "nama-toko",
            },
            {
                key: "base_api_url",
                type: "text",
                schema: z.string().url({
                    message: "Base API URL tidak valid"
                }).min(2, {
                    message: "Base API URL setidaknya memiliki 2 karakter."
                }),
                label: "Base API URL",
                description: "Masukkan base API URL marketplace.",
                placeholder: "https://api.example.com/rest",
            },
            {
                key: "description",
                type: "textarea",
                schema: z.string(),
                label: "Deskripsi",
                description: "Masukkan deskripsi marketplace.",
                placeholder: "Deskripsi marketplace",
            },
            {
                key: "is_need_checker",
                type: "switch",
                schema: z.coerce.boolean(),
                label: "Membutuhkan pemeriksa",
                description: "Tentukan apakah marketplace membutuhkan pemeriksa atau tidak.",
                placeholder: "Status kebutuhan checker pada marketplace",
            },
        ]} />
}