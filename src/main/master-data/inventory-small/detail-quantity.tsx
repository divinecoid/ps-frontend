import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FormField } from "@/components/ui/form"
import { useFormContext } from "react-hook-form";
import { Product } from "@/interfaces/product";
import { Products } from "@/interfaces/inventory-small";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import React from "react";
import ViewSmallInventoryItems from "./dialog-items-view";

interface DetailQuantityProps {
    rowKey: string
}

export default function DetailQuantity({ rowKey }: DetailQuantityProps) {
    const form = useFormContext();
    const [viewItems, setViewItems] = React.useState<Product[]>();
    const [open, setOpen] = React.useState<boolean>();

    return <>
        <ViewSmallInventoryItems data={viewItems} open={open} setOpen={setOpen} />
        <FormField
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
                            <TableHead className="w-0">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {field.value?.map((row: Products, index: number) => (
                            <TableRow key={index}>
                                <TableCell>{row.series}</TableCell>
                                <TableCell className="text-end">{row.count}</TableCell>
                                <TableCell className="w-0">
                                    <Button type="button" onClick={() => { setViewItems(row.items); setOpen(true) }}><Eye /></Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )} />
    </>
}