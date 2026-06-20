import ModalItem from "@/components/custom/modal-item"
import { BaseModalForm } from "@/interfaces/base"
import { OnlineStore } from "@/interfaces/online-store"
import Services from "@/services"
import { z } from "zod/v3"

export default function ModalOnlineStore(props: BaseModalForm) {
    return <ModalItem<OnlineStore>
        title={props.isEdit ? "Edit Toko Online" : "Tambah Toko Online"}
        description={props.isEdit ? "Edit toko online yang sudah ada" : "Tambah toko online baru"}
        {...props}
        formShape={[
            {
                key: "marketplace_id",
                type: "combobox",
                schema: z.string().nonempty({
                    message: "Marketplace dibutuhkan.",
                }),
                source: {
                    id: "id",
                    label: "name",
                    api: Services.MasterMarketplace.index
                },
                label: "Marketplace",
                description: "Masukkan marketplace dari online store ini.",
                placeholder: "Tokopedia/Shopee/Tiktok",
            },
            {
                key: "store_code",
                type: "text",
                schema: z.string().min(2, {
                    message: "Kode toko setidaknya memiliki 2 karakter."
                }),
                label: "Kode toko",
                description: "Masukkan kode toko online.",
                placeholder: "OLS-001",
            },
            {
                key: "store_name",
                type: "text",
                schema: z.string().min(2, {
                    message: "Nama toko setidaknya memiliki 2 karakter."
                }),
                label: "Nama toko",
                description: "Masukkan nama toko online.",
                placeholder: "Nama toko online",
            },
            {
                key: "shop_id",
                type: "text",
                schema: z.string().min(2, {
                    message: "Id toko setidaknya memiliki 2 karakter."
                }),
                label: "Id toko",
                description: "Masukkan Id toko online.",
                placeholder: "1023184",
            },
            {
                key: "api_key",
                type: "text",
                schema: z.string().min(2, {
                    message: "API key setidaknya memiliki 2 karakter."
                }),
                label: "API Key",
                description: "Masukkan API key toko online.",
                placeholder: "AIzaSyDaGmWKa4JsXZ-HjGw7ISLn_3namBGewQe",
            },
            {
                key: "client_id",
                type: "text",
                schema: z.string().min(2, {
                    message: "Client ID setidaknya memiliki 2 karakter."
                }),
                label: "Client ID",
                description: "Masukkan client ID toko online.",
                placeholder: "d153e353-2a32-4763-b930-b27fbc980da5",
            },
            {
                key: "client_secret",
                type: "text",
                schema: z.string().min(2, {
                    message: "Client secret setidaknya memiliki 2 karakter."
                }),
                label: "Client secret",
                description: "Masukkan client secret toko online.",
                placeholder: "7I6uN1rjneirxiMW",
            },
            {
                key: "store_url",
                type: "text",
                schema: z.string().url({
                    message: "URL toko online tidak valid"
                }).min(2, {
                    message: "URL toko online setidaknya memiliki 2 karakter."
                }),
                label: "URL toko",
                description: "Masukkan URL toko online.",
                placeholder: "https://www.example.com/officialstore",
            },
            {
                key: "is_active",
                type: "switch",
                schema: z.coerce.boolean(),
                label: "Kondisi toko",
                description: "Kondisi toko online aktif.",
                placeholder: "Kondisi toko online",
            },
            {
                key: "redirect_uri",
                type: "text",
                schema: z.string().url({
                    message: "Redirect URL tidak valid"
                }).min(2, {
                    message: "Redirect URL setidaknya memiliki 2 karakter."
                }),
                label: "Redirect URL",
                description: "Masukkan redirect URL toko online.",
                placeholder: "https://www.example.com/callback?",
            },
        ]} />
}