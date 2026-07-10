import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Item } from ".";

interface ItemProps<T> {
    rows: T[];
    removeRow?: (barcode: string) => void;
}

export const Items = ({ rows, removeRow }: ItemProps<Item>) => {
    return (
        <div className="pb-8">
            <Table>
                {rows.length === 0 && <TableCaption>Scan barcode untuk menambah barang keluar.</TableCaption>}
                <TableHeader>
                    <TableRow>
                        <TableHead>Model</TableHead>
                        <TableHead>Warna</TableHead>
                        <TableHead>Ukuran</TableHead>
                        <TableHead className="text-center w-[80px]">Jumlah (Satuan)</TableHead>
                        {removeRow && <TableHead className="w-[50px]">Aksi</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((row: Item, index) => (
                        <TableRow key={index}>
                            <TableCell>{row.model}</TableCell>
                            <TableCell>{row.color}</TableCell>
                            <TableCell>{row.size}</TableCell>
                            <TableCell className="text-center">{row.qty}</TableCell>
                            {removeRow && (
                                <TableCell>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => removeRow(row.key)}
                                    >
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
