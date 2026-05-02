import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FormField } from "@/components/ui/form"
import { useFormContext } from "react-hook-form";
import { Product } from "@/interfaces/product";

interface DetailQuantityProps {
    rowKey: string
}

export default function DetailQuantity({ rowKey }: DetailQuantityProps) {
    const form = useFormContext();

    return <FormField
        control={form.control}
        name={rowKey}
        render={({ field }) => (
            <Table>
                <TableCaption>
                </TableCaption>
                {field.value?.length == 0 && <TableCaption>Daftar penerimaan Anda.</TableCaption>}
                <TableHeader>
                    <TableRow>
                        <TableHead>Series</TableHead>
                        <TableHead className="text-end">Barcode</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {field.value?.map((row: Product, index: number) => (
                        <TableRow key={index}>
                            <TableCell>{row.series}</TableCell>
                            <TableCell className="text-end">{row.barcode}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        )} />
}