import ItemForm from "@/components/custom/item-form";
import { BaseForm } from "@/interfaces/base";
import { Order } from "@/interfaces/order";
import Services from "@/services";
import { useParams } from "react-router-dom";
import z from "zod/v3";

export default function FormOrder(props: BaseForm) {
    const { id } = useParams();
    return <ItemForm<Order>
        id={id}
        {...props}
        disabled
        services={Services.TransactionOrder}
        formShape={[
            {
                key: "awb_code",
                type: "text",
                schema: z.string().nonempty("AWB wajib diisi"),
                label: "Nomor Resi (AWB)",
                description: "Kode resi pengiriman",
                placeholder: "Masukkan nomor AWB",
            },

            {
                key: "status",
                type: "select",
                schema: z.enum([
                    "pending",
                    "read",
                    "prepared",
                    "ready_to_ship",
                    "shipped",
                    "delivered",
                    "cancelled",
                    "returned",
                ]),
                label: "Status Pesanan",
                description: "Status pemrosesan order",
                options: {
                    pending: "Pending",
                    read: "Dibaca",
                    prepared: "Disiapkan",
                    ready_to_ship: "Siap Dikirim",
                    shipped: "Dikirim",
                    delivered: "Terkirim",
                    cancelled: "Dibatalkan",
                    returned: "Dikembalikan",
                },
            },

            {
                key: "read_at",
                type: "date",
                schema: z.date().optional(),
                mode: "single",
                label: "Tanggal Dibaca",
                description: "Waktu order dibaca",
                placeholder: "Pilih tanggal",
            },

            {
                key: "prepared_at",
                type: "date",
                schema: z.date().optional(),
                mode: "single",
                label: "Tanggal Disiapkan",
                description: "Waktu order selesai disiapkan",
                placeholder: "Pilih tanggal",
            },

            {
                key: "readytoship_at",
                type: "date",
                schema: z.date().optional(),
                mode: "single",
                label: "Tanggal Siap Kirim",
                description: "Waktu order siap dikirim",
                placeholder: "Pilih tanggal",
            },

            {
                key: "prepare_duration",
                type: "number",
                schema: z.coerce.number().min(0),
                label: "Durasi Persiapan (menit)",
                description: "Lama persiapan pesanan",
                placeholder: "0",
            },

            {
                key: "item_count",
                type: "number",
                schema: z.coerce.number().min(0),
                label: "Jumlah Item",
                description: "Total item dalam pesanan",
                placeholder: "0",
            },

            {
                key: "unique_item_count",
                type: "number",
                schema: z.coerce.number().min(0),
                label: "Jumlah Item Unik",
                description: "Jumlah SKU unik",
                placeholder: "0",
            },

            {
                key: "total_weight",
                type: "number",
                schema: z.coerce.number().min(0),
                label: "Total Berat (gram)",
                placeholder: "0",
            },

            {
                key: "total_price",
                type: "number",
                schema: z.coerce.number().min(0),
                label: "Total Harga",
                placeholder: "0",
            },

            {
                key: "total_shipping",
                type: "number",
                schema: z.coerce.number().min(0),
                label: "Biaya Pengiriman",
                placeholder: "0",
            },

            {
                key: "total_amount",
                type: "number",
                schema: z.coerce.number().min(0),
                label: "Total Pembayaran",
                placeholder: "0",
            },

            {
                key: "customer_name",
                type: "text",
                schema: z.string().nonempty("Nama pelanggan wajib diisi"),
                label: "Nama Pelanggan",
                placeholder: "Nama pelanggan",
            },

            {
                key: "customer_phone",
                type: "tel",
                schema: z.string().nonempty("Nomor telepon wajib diisi"),
                label: "Nomor Telepon",
                placeholder: "08xxxxxxxxxx",
            },

            {
                key: "customer_address",
                type: "textarea",
                schema: z.string().nonempty("Alamat wajib diisi"),
                label: "Alamat Pelanggan",
                placeholder: "Alamat lengkap",
            },

            {
                key: "marketplace_id",
                type: "combobox",
                schema: z.string().nonempty(),
                label: "Marketplace",
                placeholder: "Pilih marketplace",
                source: {
                    id: "id",
                    label: "name",
                    api: Services.MasterMarketplace.index,
                },
            },

            {
                key: "online_store_id",
                type: "combobox",
                schema: z.string().nonempty(),
                label: "Toko Online",
                placeholder: "Pilih toko",
                source: {
                    id: "id",
                    label: "store_name",
                    api: Services.MasterOnlineStore.index,
                },
            },

            {
                key: "preparist_user_id",
                type: "combobox",
                schema: z.string().optional(),
                label: "Petugas Persiapan",
                placeholder: "Pilih user",
                source: {
                    id: "id",
                    label: "name",
                    api: Services.MasterUser.index,
                },
            },
        ]}
    />
}