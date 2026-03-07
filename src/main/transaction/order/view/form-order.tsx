import { BaseForm } from "@/interfaces/base";
import Services from "@/services";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import z from "zod/v3";
import { User } from "@/interfaces/user";
import { formatDateTime } from "@/lib/format-date";
import { OnlineStore } from "@/interfaces/online-store";
import { Marketplace } from "@/interfaces/marketplace";


interface ViewOrderDetail {
    //store detail
    online_store_id: string
    online_store: OnlineStore
    marketplace_id: string
    marketplace: Marketplace
    //order detail
    order_sn: string
    awb_code: string
    read_at: Date
    prepared_at: Date
    prepare_duration: number
    readytoship_at: Date
    readytoship_marketplace: string
    status: "pending" | "read" | "prepared" | "ready_to_ship" | "shipped" | "delivered" | "cancelled" | "returned"
    //product details
    item_count: number
    unique_item_count: number
    total_weight: number
    total_price: number
    total_shipping: number
    //preparist
    preparist_user_id: string
    preparist_user: User
    //customer
    customer_name: string
    customer_phone: string
    customer_address: string

}

export default function FormOrder(props: BaseForm) {
    const { id } = useParams();
    const [loading, setLoading] = React.useState<boolean>(id ? true : false);
    const navigate = useNavigate();

    const [data, setData] = useState<ViewOrderDetail>();

    React.useEffect(() => {
        const viewData = async () => {
            try {
                if (id) {
                    const res = await Services.TransactionOrder?.show?.(id);
                    const json = await res?.json();
                    if (res?.ok) {
                        setData(json.data);
                    } else {
                        toast.error(json.message, { richColors: true });
                        navigate(-1);
                    }
                }
            } catch (error) {
                if (error instanceof Error) {
                    toast.error(error.message, { richColors: true });
                    navigate(-1);
                }
            } finally {
                setLoading(false);
            }
        }
        viewData();
    }, [id]);

    return <div className={`${loading ? 'cursor-progress' : undefined} grid grid-cols-1 lg:grid-cols-2`}>
        <div className="px-8 mt-4 mb-2 text-sm">
            <div className="py-2 font-bold">Informasi Pemesanan</div>
            <div className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1">
                <p className="w-[200px] text-muted-foreground">Nomor Seri Pesanan</p>
                <p className="font-medium">{data?.order_sn}</p>
                <p className="w-[200px] text-muted-foreground">Nomor AWB</p>
                <p className="font-medium">{data?.awb_code}</p>
                <p className="w-[200px] text-muted-foreground">Waktu Baca</p>
                <p className="font-medium">{data?.read_at ? formatDateTime(data.read_at) : '-'}</p>
                <p className="w-[200px] text-muted-foreground">Waktu Persiapan</p>
                <p className="font-medium">{data?.prepared_at ? formatDateTime(data?.prepared_at) : '-'}</p>
                <p className="w-[200px] text-muted-foreground">Durasi Persiapan</p>
                <p className="font-medium">{data?.prepare_duration}</p>
            </div>
        </div>
        <div className="px-8 mt-4 mb-2 text-sm">
            <div className="py-2 font-bold">Informasi Pemesanan</div>
            <div className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1">
                <p className="w-[200px] text-muted-foreground">Nomor Seri Pesanan</p>
                <p className="font-medium">{data?.order_sn}</p>
                <p className="w-[200px] text-muted-foreground">Nomor AWB</p>
                <p className="font-medium">{data?.awb_code}</p>
                <p className="w-[200px] text-muted-foreground">Status</p>
                <p className="font-medium">{data?.status}</p>
                <p className="w-[200px] text-muted-foreground">Waktu Baca</p>
                <p className="font-medium">{data?.read_at ? formatDateTime(data.read_at) : '-'}</p>
                <p className="w-[200px] text-muted-foreground">Waktu Persiapan</p>
                <p className="font-medium">{data?.prepared_at ? formatDateTime(data?.prepared_at) : '-'}</p>
                <p className="w-[200px] text-muted-foreground">Durasi Persiapan</p>
                <p className="font-medium">{data?.prepare_duration ?? '-'}</p>
                <p className="w-[200px] text-muted-foreground">Ready To Ship</p>
                <p className="font-medium">{data?.readytoship_at ? formatDateTime(data.readytoship_at) : '-'}</p>
                <p className="w-[200px] text-muted-foreground">Ready To Ship Marketplace</p>
                <p className="font-medium">{data?.readytoship_marketplace ?? '-'}</p>
            </div>
        </div>
        <div className="px-8 mt-4 mb-2 text-sm">
            <div className="py-2 font-bold">Informasi Produk</div>
            <div className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1">
                <p className="w-[200px] text-muted-foreground">Jumlah Item</p>
                <p className="font-medium">{data?.item_count}</p>
                <p className="w-[200px] text-muted-foreground">Jumlah Produk Unik</p>
                <p className="font-medium">{data?.unique_item_count}</p>
                <p className="w-[200px] text-muted-foreground">Total Berat</p>
                <p className="font-medium">{data?.total_weight}</p>
                <p className="w-[200px] text-muted-foreground">Total Harga</p>
                <p className="font-medium">{data?.total_price}</p>
                <p className="w-[200px] text-muted-foreground">Total Ongkir</p>
                <p className="font-medium">{data?.total_shipping}</p>
            </div>
        </div>
        <div className="px-8 mt-4 mb-2 text-sm">
            <div className="py-2 font-bold">Preparist</div>
            <div className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1">
                <p className="w-[200px] text-muted-foreground">Nama</p>
                <p className="font-medium">{data?.preparist_user?.name}</p>
                <p className="w-[200px] text-muted-foreground">User ID</p>
                <p className="font-medium">{data?.preparist_user_id}</p>
            </div>
        </div>
        <div className="px-8 mt-4 mb-2 text-sm">
            <div className="py-2 font-bold">Informasi Customer</div>
            <div className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1">
                <p className="w-[200px] text-muted-foreground">Nama</p>
                <p className="font-medium">{data?.customer_name}</p>
                <p className="w-[200px] text-muted-foreground">Telepon</p>
                <p className="font-medium">{data?.customer_phone}</p>
                <p className="w-[200px] text-muted-foreground">Alamat</p>
                <p className="font-medium">{data?.customer_address}</p>
            </div>
        </div>
    </div>
}