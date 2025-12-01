import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import React from "react";
import Barcode from "react-barcode";

interface ModalBarcodeProps {
    id?: number,
    setId?: React.Dispatch<React.SetStateAction<number|undefined>>
}

export default function ModalBarcode({ id, setId }: ModalBarcodeProps) {
    const [open, setOpen] = React.useState<boolean>(!!id);
    React.useEffect(() => {
        setOpen(!!id)
    }, [id]);

    return <Dialog open={open} onOpenChange={(open) => { setId && setId(undefined); setOpen(open); }}>
        <DialogContent className={`flex flex-col max-h-[90vh] p-0 select-none`}>
            <DialogHeader className="px-6 pt-6">
                <DialogTitle>View Barcode</DialogTitle>
                <DialogDescription>View CMT Barcode</DialogDescription>
            </DialogHeader>

            <Barcode value={String(id)} />
        </DialogContent>
    </Dialog>
} 