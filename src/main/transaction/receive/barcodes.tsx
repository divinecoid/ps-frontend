import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Barcode } from ".";

interface BarcodeProps<T> {
    rows: T[];
    removeRow: (barcode: string) => void;
}

export const Barcodes = ({ rows, removeRow }: BarcodeProps<Barcode>) => {
    return <div className="pb-8">
    <Table>
        <TableCaption></TableCaption>
        {rows.length == 0 && <TableCaption>Daftar penerimaan Anda.</TableCaption>}
        <TableHeader>
            <TableRow>
                <TableHead>Barcode</TableHead>
                <TableHead>Rak</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead className="w-[50px]">Aksi</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {rows.map((row: Barcode, index) => (
                <TableRow key={index}>
                    <TableCell>{row.barcode}</TableCell>
                    <TableCell>{row.rack?.name ?? '-'}</TableCell>
                    <TableCell>{row.barcode.includes('|P|') ? 'Satuan' : `Lusin`}</TableCell>
                    <TableCell>
                        <Button type="button" variant="destructive" onClick={() => removeRow(row.barcode)}><Trash /></Button>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
    </div>
}