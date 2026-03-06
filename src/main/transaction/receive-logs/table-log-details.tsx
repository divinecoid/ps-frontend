import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Detail, Summary } from "./form-receive-logs";
import { Label } from "@/components/ui/label";

interface TableLogDetailProps {
    summary?: Summary[]
    detail?: Detail[]
}
const TableLogDetails = ({ summary, detail }: TableLogDetailProps) => {
    return <div className="flex flex-col gap-2 my-4">
        <div>
            <Label>Ringkasan</Label>
            <Table>
                <TableCaption>
                </TableCaption>
                {summary?.length == 0 && <TableCaption>Daftar penerimaan Anda.</TableCaption>}
                <TableHeader>
                    <TableRow>
                        <TableHead>Serial Number</TableHead>
                        <TableHead className="w-[250px]">Model</TableHead>
                        <TableHead className="w-[250px]">Warna</TableHead>
                        <TableHead className="w-[250px]">Ukuran</TableHead>
                        <TableHead className="w-[50px]">Jumlah (Satuan)</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {summary?.map((row, index) => (
                        <TableRow key={index}>
                            <TableCell>{row.serial_number}</TableCell>
                            <TableCell>{row.model}</TableCell>
                            <TableCell>{row.color}</TableCell>
                            <TableCell>{row.size}</TableCell>
                            <TableCell>{row.total_qty}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
        <div>

            <Label>Detail</Label>
            <Table>
                <TableCaption>
                </TableCaption>
                {detail?.length == 0 && <TableCaption>Daftar penerimaan Anda.</TableCaption>}
                <TableHeader>
                    <TableRow>
                        <TableHead>Barcode</TableHead>
                        <TableHead className="w-[250px]">Model</TableHead>
                        <TableHead className="w-[250px]">Serial Number</TableHead>
                        <TableHead className="w-[250px]">Warna</TableHead>
                        <TableHead className="w-[250px]">Ukuran</TableHead>
                        <TableHead className="w-[50px]">Jumlah (Satuan)</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {detail?.map((row, index) => (
                        <TableRow key={index}>
                            <TableCell>{row.serial_number}</TableCell>
                            <TableCell>{row.barcode}</TableCell>
                            <TableCell>{row.model}</TableCell>
                            <TableCell>{row.color}</TableCell>
                            <TableCell>{row.size}</TableCell>
                            <TableCell>{row.qty}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    </div>
}

export default TableLogDetails;