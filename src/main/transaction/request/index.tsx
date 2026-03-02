import { columns } from "./column";
import Services from "@/services";
import OverviewPage from "@/components/custom/overview-page";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, Plus, Printer, QrCode, Trash } from "lucide-react";
import { toast } from "sonner";
import { TooltipHover } from "@/components/custom/tooltip-hover";
import ModalConfirm from "@/components/custom/modal-confirm";
import DatatableSelectAction from "@/components/custom/datatable-select-action";

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
    const paperWidthMm = 240;
    const paperHeightMm = 300;

    const handlePrint = async (id: string) => {
        try {
            const res = await Services.TransactionRequest.barcode(id);
            const json = await res.json();
            const temp: string[] = [];
            const dozenTemp: string[] = [];
            json.data.request_detail.map((item: RequestDetail) => {
                return {
                    code: item.barcode,
                    count: item.req_dozen_qty * 12 + item.req_piece_qty
                }
            }).map((barcode: Barcodes) => {
                const groupCount = Math.floor(barcode.count / 12);
                for (let i = 0; i < groupCount; i++) {
                    dozenTemp.push(`${barcode.code}|D|${i + 1}`);
                }
                for (let i = 0; i < barcode.count; i++) {
                    temp.push(`${barcode.code}|P|${i + 1}`);
                }
            });
            if (!temp?.length) {
                toast.error("Tidak ada barcode untuk dicetak", { richColors: true });
                return;
            }

            await window.electronAPI.printPreview({
                barcodes: temp,
                dozenBarcodes: dozenTemp,
                paper: {
                    width: paperWidthMm,
                    height: paperHeightMm,
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
        source={Services.TransactionRequest}
        actions={(props) => [
            <DatatableSelectAction {...props} action={Services.TransactionRequest.multiDestroy} trigger="Hapus" variant="destructive" title={`Apakah anda yakin untuk menghapus ${props.selectedRows.length} pengajuan?`} description={`Aksi ini akan menghilangkan ${props.selectedRows.length} pengajuan terpilih dari daftar pilihan.`} />,
            <Button asChild variant="outline"><Link to={`./new`}><Plus />Pengajuan Baru</Link></Button>,
            <ModalConfirm {...props} action={Services.TransactionRequest.destroy} id={deleteRow} setId={setDeleteRow} variant="destructive" title="Apakah anda yakin untuk membatalkan pengajuan ini?" description="Pengajuan ini akan dibatalkan." />
        ]}
        rowActions={({ row }) => (
            <div className="flex gap-2 justify-end">
                <TooltipHover tooltip="Lihat"><Button asChild variant="outline"><Link to={`./${row.id}`}><Eye /></Link></Button></TooltipHover>
                <TooltipHover tooltip="Lihat QR"><Button asChild variant="outline"><Link to={`./${row.id}/barcode`}><QrCode /></Link></Button></TooltipHover>
                {row.status == 'OPEN' && <>
                    <TooltipHover tooltip="Cetak QR"><Button variant="outline" className="cursor-pointer" onClick={() => handlePrint(row.id)}><Printer /></Button></TooltipHover>
                    <TooltipHover tooltip="Hapus"><Button variant="destructive" className="cursor-pointer" onClick={() => setDeleteRow(row.id)}><Trash /></Button></TooltipHover>
                </>
                }
            </div>
        )}
    />
}
