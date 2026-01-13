import { PrintOptions } from "@/interfaces/print";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";

export default function Print() {
    const [barcodes, setBarcodes] = useState<string[]>();
    const [paper, setPaper] = useState<{ width: number, height: number }>();

    const [readyToPrint, setReadyToPrint] = useState(false);

    useEffect(() => {
        if (!readyToPrint) return;
        window.electronAPI.startPrint();
    }, [readyToPrint]);


    useEffect(() => {
        if (barcodes?.length && paper) {
            setReadyToPrint(true);
        }
    }, [barcodes, paper]);


    useEffect(() => {
        window.electronAPI.notifyPrintReady();
        const unsubscribe = window.electronAPI.onSetPrintData((data: PrintOptions) => {
            setBarcodes(data.barcodes);
            setPaper(data.paper);
        });
        return unsubscribe;
    }, []);

    return <div className="flex">
        <div className="grid grid-cols-3 gap-4 p-4 shrink-0">
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
}