import ModalItem from "@/components/custom/modal-item";
import { BaseModalForm } from "@/interfaces/base";
import { Configuration } from "@/interfaces/configuration";
import { z } from "zod/v3";

export default function ModalConfiguration(props: BaseModalForm) {
    return <ModalItem<Configuration>
        title={props.isEdit ? "Sunting Konfigurasi" : "Tambah Konfigurasi"}
        description={props.isEdit ? "Sunting konfigurasi yang sudah ada" : "Tambah konfigurasi baru"}
        {...props}
        formShape={[
            {
                key: "config_key",
                type: "text",
                schema: z.string().min(1, {
                    message: "Config key wajib diisi.",
                }).max(100, {
                    message: "Config key maksimal 100 karakter.",
                }),
                label: "Config Key",
                description: "Key unik untuk konfigurasi ini.",
                placeholder: "contoh: is_need_checker",
            },
            {
                key: "data_type",
                type: "select",
                schema: z.string().min(1, {
                    message: "Tipe data wajib dipilih.",
                }),
                label: "Tipe Data",
                description: "Pilih tipe data untuk konfigurasi ini.",
                placeholder: "Pilih tipe data",
                options: {
                    "boolean": "Boolean",
                    "integer": "Integer",
                    "decimal": "Decimal",
                    "string": "String",
                },
            },
            {
                key: "config_value",
                type: "text",
                schema: z.string().optional(),
                label: "Nilai",
                description: "Nilai konfigurasi (selalu dikirim sebagai string).",
                placeholder: "contoh: true, 10, Gudang Utama",
            },
            {
                key: "description",
                type: "textarea",
                schema: z.string().optional(),
                label: "Deskripsi",
                description: "Deskripsi mengenai konfigurasi ini.",
                placeholder: "Deskripsi konfigurasi",
            },
        ]}
    />
}
