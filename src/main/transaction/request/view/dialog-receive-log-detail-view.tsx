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
                <DialogTitle>Tentukan Tempat Penyimpanan Produk Satuan</DialogTitle>
                <DialogDescription>Barang dengan jumlah satuan akan diletakkan di rak bawah</DialogDescription>
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
                                <TableCell>{row.barcode}</TableCell>
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