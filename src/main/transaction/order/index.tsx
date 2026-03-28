import { columns } from "./column";
import Services from "@/services";
import OverviewPage from "@/components/custom/overview-page";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clipboard, Download, Eye } from "lucide-react";
import { TooltipHover } from "@/components/custom/tooltip-hover";
import { Order } from "@/interfaces/order";
import { toast } from "sonner";
import { downloadFile } from "@/lib/file";

export default function OrderPage() {

    const checkMarketplace = (data: Order) => {
        switch (data.marketplace.code) {
            case 'shopee':
                return Services.TransactionShopeeOrder.downloadShippingDocument;
            case 'tiktok':
                return;
            case 'lazada':
                return;
            default:
                return;
        }
    }
    const downloadDocument = async (data: Order) => {
        const values = {
            order_sn: data.order_sn,
            // shipping_document_type: 'NORMAL_AIR_WAYBILL'
        }
        try {
            const res = await checkMarketplace(data)?.(values);
            if (res?.ok) {
                downloadFile(res);
            } else {
                const json = await res?.json();
                //Shopee API Error: {\"error\":\"logistics.shipping_document_should_print_first\",\"message\":\"The package should print first. Detail: these orders: 260321N9H94XJ7 should print\",\"request_id\":\"e3e3e7f34e15b2d401b6e0da57c7a800:010003c503470939:000000a08e9b68b4\"}
                const test = JSON.parse(String(json.message).substring(json.message.indexOf(': ')+1));
                toast.error(test.message, { richColors: true })
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message, { richColors: true })
            }
        }
    }
    return <OverviewPage
        columns={columns}
        source={Services.TransactionOrder}
        rowActions={({ row }) => (
            <div className="flex gap-2 justify-end">
                <TooltipHover tooltip="Lihat"><Button asChild variant="outline"><Link to={`./${row.id}`}><Eye /></Link></Button></TooltipHover>
                {(row.status.toLowerCase() === 'ready_to_pickup' || row.status.toLowerCase() === 'ready_to_ship') && (
                    <TooltipHover tooltip="Unduh"><Button variant="outline" onClick={() => downloadDocument(row)}><Download /></Button></TooltipHover>
                )}
                <TooltipHover tooltip="Salin Order SN"><Button variant="outline" className="cursor-pointer" onClick={async () => await navigator.clipboard.writeText(row.order_sn)}><Clipboard /></Button></TooltipHover>
            </div>
        )}
    />
}
