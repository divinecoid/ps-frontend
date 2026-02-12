import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Item } from ".";

interface ItemProps<T> {
    rows: T[];
    removeRow: (barcode: string) => void;
}

export const Items = ({ rows, removeRow }: ItemProps<Item>) => {
    return <div className="pb-8">
    <Table>
        <TableCaption>
        </TableCaption>
        {rows.length == 0 && <TableCaption>Daftar penerimaan Anda.</TableCaption>}
        <TableHeader>
            <TableRow>
                <TableHead>CMT</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Warna</TableHead>
                <TableHead>Ukuran</TableHead>
                <TableHead className="w-[50px]">Jumlah (Lusin)</TableHead>
                <TableHead className="w-[50px]">Jumlah (Satuan)</TableHead>
                <TableHead className="w-[50px]">Aksi</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {rows.map((row: Item, index) => (
                <TableRow key={index}>
                    <TableCell>{row.cmt}</TableCell>
                    <TableCell>{row.model}</TableCell>
                    <TableCell>{row.color}</TableCell>
                    <TableCell>{row.size}</TableCell>
                    <TableCell>{row.rec_dozen_qty}</TableCell>
                    <TableCell>{row.rec_piece_qty}</TableCell>
                    <TableCell>
                        <Button type="button" variant="destructive" onClick={() => removeRow(row.barcode)}><Trash /></Button>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
    </div>
}