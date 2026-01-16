import { columns } from "./column";
import Services from "@/services";
import OverviewPage from "@/components/custom/overview-page";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import ConfirmRequest from "./confirm";
import DropdownRowActions from "@/components/custom/dropdown-row-actions";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, Import, Plus, Printer, QrCode, Trash } from "lucide-react";
import { toast } from "sonner";
import { TooltipHover } from "@/components/custom/tooltip-hover";

interface Barcodes {
    code: string,
    count: number
}

interface RequestDetail {
    barcode: string;
    req_dozen_qty: number;
    req_piece_qty: number;
}

export default function Request() {
    const [deleteRow, setDeleteRow] = useState<string>();

    const handlePrint = async (id: string) => {
        try {
            const res = await Services.Request.barcode(id);
            const json = await res.json();
            const barcodes: string[] = [];
            json.data.request_detail.map((item: RequestDetail) => {
                return {
                    code: item.barcode,
                    count: (item.req_dozen_qty * 12) + item.req_piece_qty
                }
            }).map((barcode: Barcodes) => {
                for (let i = 0; i < barcode.count; i++) {
                    barcodes.push(`${barcode.code}|${i + 1}`);
                }
            });

            if (!barcodes?.length) {
                toast.error("Tidak ada barcode untuk dicetak", { richColors: true });
                return;
            }

            await window.electronAPI.printPreview({
                barcodes: barcodes,
                paper: {
                    width: 50,
                    height: 25,
                },
            });
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message, { richColors: true })
            }
        }
    }

    return <OverviewPage
        columns={columns}
        source={Services.Request}
        actions={(props) => [
            <Button asChild variant="outline"><Link to={`./new`}><Plus />Pengajuan Baru</Link></Button>,
            <ConfirmRequest {...props} action={Services.Request.destroy} id={deleteRow} setId={setDeleteRow} title="Apakah anda yakin untuk membatalkan pengajuan ini?" description="Pengajuan ini akan dibatalkan." />
        ]}
        rowActions={({ row }) => (
            <div className="flex gap-2">
                <TooltipHover tooltip="Lihat"><Button asChild variant="outline"><Link to={`./view/${row.id}`}><Eye /></Link></Button></TooltipHover>
                <TooltipHover tooltip="Lihat QR"><Button asChild variant="outline"><Link to={`./barcode/${row.id}`}><QrCode /></Link></Button></TooltipHover>
                <TooltipHover tooltip="Cetak QR"><Button variant="outline" className="cursor-pointer" onClick={() => handlePrint(row.id)}><Printer /></Button></TooltipHover>
                <TooltipHover tooltip="Penerimaan"><Button asChild variant="outline"><Link to={`./received/${row.id}`}><Import /></Link></Button></TooltipHover>
                <TooltipHover tooltip="Hapus"><Button variant="destructive" className="cursor-pointer" onClick={() => setDeleteRow(row.id)}><Trash /></Button></TooltipHover>
            </div>
        )}
    />
}
