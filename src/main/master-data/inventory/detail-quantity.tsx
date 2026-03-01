import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FormField } from "@/components/ui/form"
import { InventoryDetail } from "@/interfaces/inventory";
import { useFormContext } from "react-hook-form";

interface DetailQuantityProps {
    rowKey: string
    disabled: boolean
}

export default function DetailQuantity({ rowKey, disabled }: DetailQuantityProps) {
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
                        <TableHead className="text-end">Jumlah</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {field.value?.map((row: InventoryDetail, index: number) => (
                        <TableRow key={index}>
                            <TableCell>{row.series}</TableCell>
                            <TableCell className="text-end">{row.quantity}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        )} />
}