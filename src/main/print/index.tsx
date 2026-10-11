import { Barcodes, PrintOptions } from "@/interfaces/print";
import { useEffect, useState } from "react";
import QRCode from "react-qrcode-logo";

export default function Print() {
    const [barcodes, setBarcodes] = useState<Barcodes[]>();
    const [dozenBarcodes, setDozenBarcodes] = useState<Barcodes[]>();
    const [compact, setCompact] = useState(false);

    const [paper, setPaper] = useState<{ width: number, height: number }>();

    const [readyToPrint, setReadyToPrint] = useState(false);

    useEffect(() => {
        if (!readyToPrint) return;
        window.electronAPI.startPrint();
    }, [readyToPrint]);


    useEffect(() => {
        if ((barcodes?.length || dozenBarcodes?.length) && paper) {
            setReadyToPrint(true);
        }
    }, [barcodes, dozenBarcodes, paper]);


    useEffect(() => {
        window.electronAPI.notifyPrintReady();
        const unsubscribe = window.electronAPI.onSetPrintData((data: PrintOptions) => {
            setBarcodes(data.barcodes);
            setDozenBarcodes(data.dozenBarcodes);
            setCompact(!!data.compact);

            setPaper(data.paper);
        });
        return unsubscribe;
    }, []);

    const dozenClass = compact
        ? "break-inside-avoid print-page flex h-min flex-col items-center shrink-0 justify-center border border-gray-300 py-1 px-1 text-[10px] leading-tight text-center text-black"
        : "break-inside-avoid print-page flex h-min flex-col items-center shrink-0 justify-center bg-green-50 border-green-200 border-2 rounded-2xl pb-6 pt-6 px-4 text-xs text-center text-black";
    const pieceClass = compact
        ? "break-inside-avoid print-page flex flex-col items-center shrink-0 justify-center border border-gray-300 py-1 px-1 text-[10px] leading-tight text-center text-black"
        : "break-inside-avoid print-page flex flex-col items-center shrink-0 justify-center bg-blue-50 border-blue-200 border-2 rounded-2xl pb-6 pt-60 px-4 text-xs text-center text-black";
    const qrSize = compact ? 84 : 120;

    return <div className="flex">
        <div className={`grid grid-cols-5 ${compact ? "gap-0" : "gap-1"} p-0 shrink-0`}>
            {dozenBarcodes?.map((code, i) => (
                <div key={i} className={dozenClass}>
                    <QRCode value={code.code} size={qrSize} bgColor="transparent" fgColor="black" removeQrCodeBehindLogo />
                    <div className="text-nowrap">{code.serial_number} - {code.cutting} - {code.sizes}</div>
                </div>
            ))}
            {barcodes?.map((code, i) => (
                <div key={i} className={pieceClass}>
                    <QRCode value={code.code} size={qrSize} bgColor="transparent" fgColor="black" />
                    <div className="text-nowrap">{code.serial_number} - {code.cutting} - {code.sizes}</div>
                </div>
            ))}
        </div>
    </div>
}
