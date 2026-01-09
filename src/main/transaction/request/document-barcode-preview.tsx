import { Button } from "@/components/ui/button";
import Services from "@/services";
import { useEffect, useState } from "react";
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
                width: 50,
                height: 25,
            },
        });
    };

    return <div className={`flex flex-col flex-1 h-0 select-none ${loading ? 'cursor-wait' : 'cursor-default'}`}>
        <div className={`flex-1 flex`}>
            <div className="grid grid-cols-3 flex-1">
                {barcodes?.map((item, index) => {
                    return <div key={index}>{item}</div>
                })}
            </div>
        </div>
        <div className="sticky bottom-0 border-t backdrop-blur-md bg-background/70 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end justify-end px-7 py-2">
            <>
                <Button variant="outline" type="button" onClick={(e) => { e.preventDefault(); navigate(-1) }}>Kembali</Button>
                <Button type="button" onClick={handlePrint}>Cetak</Button>
            </>
        </div>
    </div>

}