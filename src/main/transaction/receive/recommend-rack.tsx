import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import React, { useEffect, useRef } from "react";
import { Item } from "./index";

interface ModalRecommendRackProps {
    data: {
        barcode: string;
        item: Item;
        rack: {
            id: string;
            code: string;
            name: string;
            warehouse: {
                id: string;
                name: string;
            }
        }
    } | undefined;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ModalRecommendRack({ data, onConfirm, onCancel }: ModalRecommendRackProps) {
    const [open, setOpen] = React.useState<boolean>(data != undefined);
    const confirmButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        setOpen(data != undefined);
        if (data != undefined) {
            // Auto focus on the confirm button after a brief timeout so that the user can press Enter immediately
            setTimeout(() => {
                confirmButtonRef.current?.focus();
            }, 100);
        }
    }, [data]);

    if (!data) return null;

    return (
        <Dialog open={open} onOpenChange={(open) => { if (!open) onCancel(); }}>
            <DialogContent className="max-w-md p-6 select-none border border-border bg-background shadow-lg rounded-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-primary flex items-center gap-2">
                        📦 Letakkan di Rak
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground text-sm">
                        Sistem telah mendeteksi lokasi penyimpanan optimal untuk barang ini.
                    </DialogDescription>
                </DialogHeader>

                <div className="my-4 p-4 rounded-lg bg-accent/40 border border-accent/60 flex flex-col gap-3">
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Lokasi Rak</span>
                        <span className="text-2xl font-black text-foreground mt-0.5">
                            {data.rack.code}
                        </span>
                        <span className="text-sm font-semibold text-primary/95">
                            {data.rack.name}
                        </span>
                    </div>

                    <div className="h-px bg-border my-1" />

                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">Gudang</span>
                            <span className="font-semibold">{data.rack.warehouse.name}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">Model</span>
                            <span className="font-semibold">{data.item.model}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">Warna</span>
                            <span className="font-semibold">{data.item.color}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">Ukuran</span>
                            <span className="font-semibold">{data.item.size}</span>
                        </div>
                    </div>
                </div>

                <DialogFooter className="sm:justify-end gap-2 mt-2">
                    <Button variant="outline" onClick={onCancel}>
                        Batal
                    </Button>
                    <Button 
                        ref={confirmButtonRef} 
                        onClick={onConfirm} 
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 shadow-md transition-all active:scale-95"
                    >
                        Oke (Enter)
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
