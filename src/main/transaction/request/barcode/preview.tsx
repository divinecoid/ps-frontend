import { Button } from "@/components/ui/button";
import { Barcodes } from "@/interfaces/print";
import { RequestViewResponse } from "@/interfaces/request";
import Services from "@/services";
import { useEffect, useState } from "react";
import QRCode from "react-qrcode-logo";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";


interface RequestDetail {
    barcode: string;
    serial_number: string;
    cutting: string;
    sizes: string;
    req_dozen_qty: number;
    req_piece_qty: number;
}

export default function DocumentBarcodePreview() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [barcodes, setBarcodes] = useState<Barcodes[]>();
    const [dozenBarcodes, setDozenBarcodes] = useState<Barcodes[]>();
    const [loading, setLoading] = useState(id ? true : false);
    const [isClosed, setClosed] = useState(true);

    const paperWidthMm = 240;
    const paperHeightMm = 300;

    useEffect(() => {
        const getStatus = async () => {
            try {
                const res = await Services.TransactionRequest.show(String(id));
                const json: RequestViewResponse = await res.json();
                setClosed(json.data.status == 'CLOSED')
            } catch (error) {
                if (error instanceof Error) {
                    toast.error(error.message, { richColors: true })
                }
            }
        }
        const getData = async () => {
            try {
                const res = await Services.TransactionRequest.barcode(String(id));
                const json = await res.json();
                const temp: Barcodes[] = [];
                const dozenTemp: Barcodes[] = [];
                json.data.request_detail.map((item: RequestDetail) => {
                    return {
                        ...item,
                        code: item.barcode,
                        count: item.req_dozen_qty * 12 + item.req_piece_qty
                    }
                }).map((barcode: Barcodes) => {
                    const groupCount = Math.floor(barcode.count / 12);
                    for (let i = 0; i < groupCount; i++) {
                        dozenTemp.push({ ...barcode, code: `${barcode.code}|D|${i + 1}` });
                    }
                    for (let i = 0; i < barcode.count; i++) {
                        temp.push({ ...barcode, code: `${barcode.code}|P|${i + 1}` });
                    }
                });
                setBarcodes(temp);
                setDozenBarcodes(dozenTemp);
            } catch (error) {
                if (error instanceof Error) {
                    toast.error(error.message, { richColors: true })
                }
            } finally {
                setLoading(false);
            }
        }
        getStatus();
        getData();
    }, []);

    const handlePrint = async () => {
        if (!barcodes?.length) {
            toast.error("Tidak ada barcode untuk dicetak", { richColors: true });
            return;
        }

        await window.electronAPI.printPreview({
            barcodes: barcodes,
            dozenBarcodes: dozenBarcodes,
            paper: {
                width: paperWidthMm,
                height: paperHeightMm,
            },
        });
    };

    return <div className={`flex flex-col flex-1 h-0 ${loading ? 'cursor-progress' : undefined} bg-black/20 dark:bg-white/20`}>
        {!loading && (
            <div className={`flex justify-center p-4 overflow-auto`}>
                <div className={`grid grid-cols-5 gap-1 bg-white p-4 drop-shadow-xl drop-shadow-black/50 mb-16 shrink-0`}>
                    {dozenBarcodes?.map((code, i) => (
                        <div
                            key={i}
                            className="print-page flex h-min flex-col items-center shrink-0 justify-center bg-green-50 border-green-200 border-2 rounded-2xl pb-6 pt-6 px-4 text-xs text-center text-black"
                        >
                            <QRCode value={code.code} size={120} bgColor="transparent" fgColor="black" removeQrCodeBehindLogo />
                            <div className="text-nowrap w-22">{code.serial_number} - {code.cutting} - {code.sizes}</div>
                        </div>
                    ))}
                    {barcodes?.map((code, i) => (
                        <div
                            key={i}
                            className="print-page flex flex-col items-center shrink-0 justify-center bg-blue-50 border-blue-200 border-2 rounded-2xl pb-6 pt-60 px-4 text-xs text-center text-black"
                        >
                            <QRCode value={code.code} size={120} bgColor="transparent" fgColor="black" />
                            <div className="text-nowrap w-22">{code.serial_number} - {code.cutting} - {code.sizes}</div>
                        </div>
                    ))}
                </div>
            </div>
        )}
        <div className="select-none fixed bottom-0 right-0 w-full border-t backdrop-blur-md bg-background/70 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end justify-end px-7 py-2">
            <Button variant="outline" type="button" onClick={(e) => { e.preventDefault(); navigate(-1) }}>Kembali</Button>
            {!isClosed &&
                <Button type="button" onClick={handlePrint}>Cetak</Button>
            }
        </div>
    </div>

}