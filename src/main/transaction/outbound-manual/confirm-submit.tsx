import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { z } from "zod/v3";
import React, { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DynamicCombobox } from "@/components/custom/dynamic-combobox";
import Services from "@/services";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { ScannedBarcode } from ".";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface ModalConfirmSubmitProps {
    submitConfirm: boolean | undefined
    setSubmitConfirm: React.Dispatch<React.SetStateAction<boolean | undefined>>
    barcodes: ScannedBarcode[]
    onSubmit: (marketplace_id: string | undefined, notes: string | undefined) => void
}

const schema = z.object({
    marketplace_id: z.string().optional(),
    notes: z.string().optional(),
});

export default function ModalConfirmSubmit({
    submitConfirm,
    setSubmitConfirm,
    barcodes,
    onSubmit,
}: ModalConfirmSubmitProps) {
    const [open, setOpen] = React.useState<boolean>(false);

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            marketplace_id: "",
            notes: "",
        },
    });

    useEffect(() => {
        setOpen(submitConfirm != undefined && submitConfirm);
        if (!submitConfirm) {
            form.reset();
        }
    }, [submitConfirm]);

    const submitForm = async (values: FieldValues) => {
        onSubmit(
            values["marketplace_id"] || undefined,
            values["notes"] || undefined
        );
        setSubmitConfirm(undefined);
        setOpen(false);
    };

    // Group barcodes by model|color|size for summary
    const summary = barcodes.reduce<Record<string, { model: string; color: string; size: string; count: number }>>((acc, b) => {
        const key = `${b.model}|${b.color}|${b.size}`;
        if (!acc[key]) {
            acc[key] = { model: b.model, color: b.color, size: b.size, count: 0 };
        }
        acc[key].count += 1;
        return acc;
    }, {});

    return (
        <Dialog open={open} onOpenChange={(o) => { setSubmitConfirm(undefined); setOpen(o); }}>
            <DialogContent className="flex flex-col max-h-[90vh] p-0 select-none">
                <DialogHeader className="px-6 pt-6">
                    <DialogTitle>Konfirmasi Outbound Manual</DialogTitle>
                    <DialogDescription>
                        Periksa ringkasan barang keluar sebelum submit. Stok akan langsung terpotong.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(submitForm)} className="flex flex-col flex-1 h-0">
                        <ScrollArea className="flex-1 overflow-y-auto">
                            {/* Summary Table */}
                            <div className="px-6 py-3">
                                <p className="text-sm font-medium mb-2">
                                    Ringkasan{" "}
                                    <Badge variant="secondary">{barcodes.length} item</Badge>
                                </p>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Model</TableHead>
                                            <TableHead>Warna</TableHead>
                                            <TableHead>Ukuran</TableHead>
                                            <TableHead className="text-center">Qty</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {Object.values(summary).map((row, i) => (
                                            <TableRow key={i}>
                                                <TableCell>{row.model}</TableCell>
                                                <TableCell>{row.color}</TableCell>
                                                <TableCell>{row.size}</TableCell>
                                                <TableCell className="text-center font-semibold">{row.count}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Marketplace picker */}
                            <FormField
                                control={form.control}
                                name="marketplace_id"
                                render={({ field, fieldState }) => (
                                    <FormItem className="px-6 py-2">
                                        <FormLabel>Marketplace (Opsional)</FormLabel>
                                        <FormControl>
                                            <DynamicCombobox
                                                aria-invalid={fieldState.invalid}
                                                source={Services.MasterMarketplace.index}
                                                id="id"
                                                label="name"
                                                placeholder="Pilih marketplace tujuan"
                                                value={field.value ?? ""}
                                                onValueChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormDescription>Marketplace tujuan pengeluaran barang</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Notes */}
                            <FormField
                                control={form.control}
                                name="notes"
                                render={({ field }) => (
                                    <FormItem className="px-6 py-2 pb-4">
                                        <FormLabel>Catatan (Opsional)</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder="Catatan tambahan (opsional)"
                                                rows={3}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </ScrollArea>
                        <DialogFooter className="sm:justify-end px-6 pb-6 pt-3 border-t">
                            <DialogClose asChild>
                                <Button variant="outline" type="button">Batal</Button>
                            </DialogClose>
                            <Button type="submit">Submit & Potong Stok</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
