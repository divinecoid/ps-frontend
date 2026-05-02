import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { DeleteRowProps, Item } from ".";

interface ItemProps<T> {
    rows: T[];
    removeRow: (deleteRow: DeleteRowProps) => void;
}

export const Items = ({ rows, removeRow }: ItemProps<Item>) => {
    return <div className="pb-8">
        <Table>
            <TableCaption>
            </TableCaption>
            {rows.length == 0 && <TableCaption>Daftar penerimaan Anda.</TableCaption>}
            <TableHeader>
                <TableRow>
                    <TableHead>Rak</TableHead>
                    <TableHead>CMT</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Warna</TableHead>
                    <TableHead>Ukuran</TableHead>
                    <TableHead className="w-[50px]">Jumlah</TableHead>
                    <TableHead className="w-[50px]">Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {rows.map((row: Item, index) => (
                    <TableRow key={index}>
                        <TableCell>{row.rack.name}</TableCell>
                        <TableCell>{row.cmt}</TableCell>
                        <TableCell>{row.model}</TableCell>
                        <TableCell>{row.color}</TableCell>
                        <TableCell>{row.size}</TableCell>
                        <TableCell>{row.rec_qty}</TableCell>
                        <TableCell>
                            <Button type="button" variant="destructive" onClick={() => removeRow({ rack_id: row.rack_id, barcode: row.barcode })}><Trash /></Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
}