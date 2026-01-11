import { Button } from "@/components/ui/button";
import Services from "@/services";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { useNavigate, useParams } from "react-router-dom";
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

export default function DocumentBarcodePreview() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [barcodes, setBarcodes] = useState<string[]>();
    const [loading, setLoading] = useState(id ? true : false);

    const paperWidthMm = 240;
    const paperHeightMm = 300;

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await Services.Request.barcode(String(id));
                const json = await res.json();
                const temp: string[] = [];
                json.data.request_detail.map((item: RequestDetail) => {
                    return {
                        code: item.barcode,
                        count: (item.req_dozen_qty * 12) + item.req_piece_qty
                    }
                }).map((barcode: Barcodes, index: number) => {
                    for (let i = 0; i < barcode.count; i++) {
                        temp.push(`${barcode.code}|${i + 1}`);
                    }
                });
                setBarcodes(temp);
            } catch (error) {
                if (error instanceof Error) {
                    toast.error(error.message, { richColors: true })
                }
            } finally {
                setLoading(false);
            }
        }
        getData();
    }, []);

    const handlePrint = async () => {
        if (!barcodes?.length) {
            toast.error("Tidak ada barcode untuk dicetak", { richColors: true });
            return;
        }

        await window.electronAPI.printPreview({
            barcodes: barcodes,
            paper: {
                width: paperWidthMm,
                height: paperHeightMm,
            },
        });
    };

    return <div className={`flex flex-col flex-1 h-0 ${loading ? 'cursor-wait' : undefined} bg-black/20 dark:bg-white/20`}>
        {!loading && (
            <div className={`flex-1 flex justify-center p-4 overflow-auto`}>
                <div className={`grid grid-cols-3 gap-4 bg-white p-4 drop-shadow-xl drop-shadow-black/50 mb-16 shrink-0`}>
                    {barcodes?.map((code, i) => (
                        <div
                            key={i}
                            className="print-page flex flex-col items-center shrink-0 justify-center bg-blue-50 border-blue-200 border-2 rounded-2xl p-8 text-xs text-center text-black line-clamp-1 gap-2"
                        >
                            <QRCode value={code} size={200} bgColor="transparent" fgColor="black" />
                            {code}
                        </div>
                    ))}
                </div>
            </div>
        )}
        <div className="select-none fixed bottom-0 right-0 w-full border-t backdrop-blur-md bg-background/70 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end justify-end px-7 py-2">
            <>
                <Button variant="outline" type="button" onClick={(e) => { e.preventDefault(); navigate(-1) }}>Kembali</Button>
                <Button type="button" onClick={handlePrint}>Cetak</Button>
            </>
        </div>
    </div>

}