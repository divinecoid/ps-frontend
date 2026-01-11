import { columns } from "./column";
import Services from "@/services";
import OverviewPage from "@/components/custom/overview-page";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import ConfirmRequest from "./confirm";
import DropdownRowActions from "@/components/custom/dropdown-row-actions";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";

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
            }).map((barcode: Barcodes, index: number) => {
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
            <Button asChild variant="outline"><Link to={`./new`}><Plus />Tambah</Link></Button>,
            <ConfirmRequest {...props} action={Services.Request.destroy} id={deleteRow} setId={setDeleteRow} title="Apakah anda yakin untuk membatalkan pengajuan ini?" description="Pengajuan ini akan dibatalkan." />
        ]}
        rowActions={({ row }) => (
            <DropdownRowActions>
                <DropdownMenuItem asChild><Link to={`./view/${row.id}`}>Lihat</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to={`./barcode/${row.id}`}>Barcode</Link></DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handlePrint(row.id)}>Cetak Kode</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setDeleteRow(row.id)}>Hapus</DropdownMenuItem>
            </DropdownRowActions>
        )}
    />
}
