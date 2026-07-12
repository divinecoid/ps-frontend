import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { ScannedBarcode } from ".";

interface BarcodesProps {
    rows: ScannedBarcode[];
    removeRow?: (barcode: string) => void;
}

export const Barcodes = ({ rows, removeRow }: BarcodesProps) => {
    return (
        <div className="pb-8">
            <Table>
                {rows.length === 0 && <TableCaption>Belum ada kode batang yang discan.</TableCaption>}
                <TableHeader>
                    <TableRow>
                        <TableHead>Barcode</TableHead>
                        <TableHead>Model</TableHead>
                        <TableHead>Warna</TableHead>
                        <TableHead>Ukuran</TableHead>
                        <TableHead>Rak</TableHead>
                        {removeRow && <TableHead className="w-[50px]">Aksi</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((row: ScannedBarcode, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-mono text-xs">{row.barcode}</TableCell>
                            <TableCell>{row.model}</TableCell>
                            <TableCell>{row.color}</TableCell>
                            <TableCell>{row.size}</TableCell>
                            <TableCell>{row.rack ?? '-'}</TableCell>
                            {removeRow && (
                                <TableCell>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => removeRow(row.barcode)}
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
