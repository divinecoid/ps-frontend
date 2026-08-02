import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import React, { useEffect } from "react";
import { ReceiveLogDetail } from "@/interfaces/request";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface ViewReceiveLogDetailProps {
    data: ReceiveLogDetail[] | undefined
    open: boolean | undefined
    setOpen: React.Dispatch<React.SetStateAction<boolean | undefined>>
}
export default function ViewReceiveLogDetail({ data, open, setOpen }: ViewReceiveLogDetailProps) {
    const [detail, setDetail] = React.useState<ReceiveLogDetail[]>();
    useEffect(() => {
        if (data != null) {
            setDetail(data);
        }
    }, [data]);

    return <Dialog open={open} onOpenChange={(open) => { setOpen(open) }}>
        <DialogContent className={`flex flex-col max-h-[90vh] p-0 select-none sm:max-w-[calc(100%-2rem)]`}>
            <DialogHeader className="px-6 pt-6">
                <DialogTitle>Detail riwayat penerimaan</DialogTitle>
                <DialogDescription>Riwayat penerimaan barang di dalam permintaan ini</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col flex-1 h-0 px-4 select-none">
                <Table>
                    <TableCaption>Daftar barang yang diterima dari penjahit.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Model</TableHead>
                            <TableHead>Warna</TableHead>
                            <TableHead>Ukuran</TableHead>
                            <TableHead>Barcode</TableHead>
                            <TableHead>Jumlah</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {(detail ?? []).map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{row.model.name}</TableCell>
                                <TableCell>{row.color.name}</TableCell>
                                <TableCell>{row.size.name}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <span>{row.barcode}</span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6"
                                            onClick={() => {
                                                navigator.clipboard.writeText(row.barcode);
                                                toast.success("Barcode berhasil disalin", { richColors: true });
                                            }}
                                        >
                                            <Copy className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </TableCell>
                                <TableCell>{row.qty}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <DialogFooter className="sm:justify-end px-6 pb-6">
                <DialogClose asChild>
                    <Button>Tutup</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog >
}