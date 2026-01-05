import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTheme } from "next-themes";
import React from "react";
import QRCode from "react-qr-code";

interface ModalBarcodeProps {
    id?: string,
    setId?: React.Dispatch<React.SetStateAction<string | undefined>>
}

export default function ModalBarcode({ id, setId }: ModalBarcodeProps) {
      const { resolvedTheme } = useTheme();
    const [open, setOpen] = React.useState<boolean>(!!id);
    React.useEffect(() => {
        setOpen(!!id)
    }, [id]);

    return <Dialog open={open} onOpenChange={(open) => { setId?.(undefined); setOpen(open); }}>
        <DialogContent className={`flex flex-col max-h-[90vh] p-0 select-none`}>
            <DialogHeader className="px-6 pt-6">
                <DialogTitle>Lihat Kode Batang</DialogTitle>
                <DialogDescription>Lihat Kode Batang CMT</DialogDescription>
            </DialogHeader>
            {id && (
                // <Barcode value={String(id)} className="w-full" background='transparent' lineColor={resolvedTheme === 'dark' ? 'white' : 'black'} />
                <QRCode value={id} className="w-full mb-10" fgColor={resolvedTheme === 'dark' ? "white" : "black"} bgColor={resolvedTheme === 'dark' ? "black" : "white"} />
            )}
        </DialogContent>
    </Dialog>
} 