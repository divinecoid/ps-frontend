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
import { Product } from "@/interfaces/product";

interface ViewSmallInventoryItemProps {
    data: Product[] | undefined
    open: boolean | undefined
    setOpen: React.Dispatch<React.SetStateAction<boolean | undefined>>
}
export default function ViewSmallInventoryItems({ data, open, setOpen }: ViewSmallInventoryItemProps) {
    const [detail, setDetail] = React.useState<Product[]>();
    useEffect(() => {
        if (data != null) {
            setDetail(data);
        }
    }, [data]);

    return <Dialog open={open} onOpenChange={(open) => { setOpen(open) }}>
        <DialogContent className={`flex flex-col max-h-[90vh] p-0 select-none sm:max-w-[calc(100%-2rem)]`}>
            <DialogHeader className="px-6 pt-6">
                <DialogTitle>Detail seri</DialogTitle>
                <DialogDescription>Detail barang dengan seri ini</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col flex-1 h-0 px-4 select-none">
                <Table>
                    <TableCaption>Daftar barang yang ada di rak ini.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-0">Model</TableHead>
                            <TableHead className="w-0">Warna</TableHead>
                            <TableHead className="w-0">Ukuran</TableHead>
                            <TableHead className="w-0">Series</TableHead>
                            <TableHead className="w-0">Barcode</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {(detail ?? []).map((row, index) => (
                            <TableRow key={index}>
                                <TableCell className="w-0">{row.model.name}</TableCell>
                                <TableCell className="w-0">{row.color.name}</TableCell>
                                <TableCell className="w-0">{row.size.name}</TableCell>
                                <TableCell>{row.series}</TableCell>
                                <TableCell className="w-0">{row.barcode}</TableCell>
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