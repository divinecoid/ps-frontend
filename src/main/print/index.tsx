import { Button } from "@/components/ui/button";
import { PrintOptions } from "@/interfaces/print";
import { Printer } from "lucide-react";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { useNavigate } from "react-router-dom";

export default function Print() {
    const [barcodes, setBarcodes] = useState<string[]>();
    const [paper, setPaper] = useState<{ width: number, height: number }>();
    const navigate = useNavigate();

    const mmToPx = (mm: number) => mm * 8;
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
            console.log(data);
            setBarcodes(data.barcodes);
            setPaper(data.paper);
        });
        return unsubscribe;
    }, []);

    return <>
        <div className="sticky top-0 border-b backdrop-blur-md bg-background/70 flex gap-2 flex-row px-7 py-2 items-center">
            <h3 className="font-semibold flex-1">Barcode Preview</h3>
            <Button type="button" className="self-end"><Printer />Cetak</Button>
        </div>
        <div className="grid grid-cols-2">
            <div className="grid gap-2">
                {barcodes?.map((code, i) => (
                    <div
                        key={i}
                        className="print-page border border-black flex items-center justify-center"
                        style={{
                            width: mmToPx(paper!.width),
                            height: mmToPx(paper!.height),
                        }}
                    >
                        <QRCode value={code} />
                        {code}
                    </div>
                ))}
            </div>
        </div>

    </>
}