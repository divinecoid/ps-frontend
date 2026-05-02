import { BaseForm } from "@/interfaces/base";
import Services from "@/services";
import { useNavigate, useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState } from "react";
import { toast } from "sonner";
import { Warehouse } from "@/interfaces/warehouse";
import { User } from "@/interfaces/user";
import { CMT } from "@/interfaces/cmt";
import { formatDate, formatTime } from "@/lib/format-date";
import TableLogDetails from "./table-log-details";

interface ViewReceiveLogDetail {
    id: string
    warehouse_id: string | null
    warehouse: Warehouse
    user: User
    received_date: string
    notes: string
    request: {
        cmt: CMT
    }
    details: Detail[]
    rejected_details: Detail[]
    summary: Summary[]
}

export interface Detail {
    barcode: string
    model: string
    color: string
    size: string
    serial_number: string
    qty: number
    rack: string | null
}

export interface Summary {
    model: string
    color: string
    size: string
    serial_number: string
    total_qty: number
    is_reject: boolean
}

export default function ViewFormReceiveLog(props: BaseForm) {
    const { id } = useParams();
    const [loading, setLoading] = React.useState<boolean>(id ? true : false);
    const navigate = useNavigate();

    const [data, setData] = useState<ViewReceiveLogDetail>();

    React.useEffect(() => {
        const viewData = async () => {
            try {
                if (id) {
                    const res = await Services.TransactionInbound?.show?.(id);
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

    return <div className={`${loading ? 'cursor-progress' : undefined}`}>
        <div className="px-8 mt-4 mb-2 text-sm">
            <div className="py-2 font-bold">Informasi Penjahit</div>
            <div className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1">
                <p className="w-auto text-muted-foreground">Nama CMT</p>
                <p className="font-medium">{data?.request?.cmt?.name}</p>
                <p className="w-auto text-muted-foreground">Kode</p>
                <p className="font-medium">{data?.request?.cmt?.code}</p>
                <p className="w-auto text-muted-foreground">Nama Kontak</p>
                <p className="font-medium">{data?.request?.cmt?.contact_person}</p>
                <p className="w-auto text-muted-foreground">Telepon</p>
                <p className="font-medium">{data?.request?.cmt?.phone}</p>
                <p className="w-auto text-muted-foreground">Alamat</p>
                <p className="font-medium">{data?.request?.cmt?.address}</p>
            </div>
        </div>
        <div className="px-8 mt-4 mb-2 text-sm">
            <div className="py-2 font-bold">Informasi Penerimaan</div>
            <div className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1">
                <p className="w-auto text-muted-foreground">Tanggal</p>
                <p className="font-medium">{data?.received_date ? formatDate(new Date(data.received_date)) : '-'}</p>
                <p className="w-auto text-muted-foreground">Waktu</p>
                <p className="font-medium">{data?.received_date ? formatTime(new Date(data.received_date)) : '-'}</p>
                <p className="w-auto text-muted-foreground">Diterima Oleh</p>
                <p className="font-medium">{data?.user.name}</p>
                <p className="w-auto text-muted-foreground">Total Barang</p>
                <p className="font-medium">{data?.summary?.reduce((sum, item) => sum + item.total_qty, 0) ?? 0}</p>
            </div>
        </div>
        <Tabs defaultValue="received" className="px-7 py-2">
            <TabsList>
                <TabsTrigger value="received">Diterima</TabsTrigger>
                <TabsTrigger value="rejected">Ditolak</TabsTrigger>
            </TabsList>
            <TabsContent value="received">
                <TableLogDetails summary={data?.summary.filter(item => !item.is_reject)} detail={data?.details} />
            </TabsContent>
            <TabsContent value="rejected">
                <TableLogDetails summary={data?.summary.filter(item => item.is_reject)} detail={data?.rejected_details} />
            </TabsContent>
        </Tabs>
    </div>
}