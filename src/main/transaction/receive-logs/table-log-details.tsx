import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Detail } from "./form-receive-logs";

interface TableLogDetailProps {
    rows?: Detail[]
}
const TableLogDetails = ({rows}: TableLogDetailProps) => {
    return <Table>
        <TableCaption>
        </TableCaption>
        {rows?.length == 0 && <TableCaption>Daftar penerimaan Anda.</TableCaption>}
        <TableHeader>
            <TableRow>
                <TableHead>Barcode</TableHead>
                <TableHead>Serial Number</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Warna</TableHead>
                <TableHead className="w-[50px]">Ukuran</TableHead>
                <TableHead className="w-[50px]">Jumlah (Satuan)</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {rows?.map((row: Detail, index) => (
                <TableRow key={index}>
                    <TableCell>{row.barcode}</TableCell>
                    <TableCell>{row.serial_number}</TableCell>
                    <TableCell>{row.model}</TableCell>
                    <TableCell>{row.color}</TableCell>
                    <TableCell>{row.size}</TableCell>
                    <TableCell>{row.qty}</TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
}

export default TableLogDetails;