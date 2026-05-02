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

interface ModalConfirmItemProps {
    hasDozen: boolean
    submitConfirm: boolean | undefined
    setSubmitConfirm: React.Dispatch<React.SetStateAction<boolean | undefined>>
    onSubmit: (notes: string, warehouse_id?: string) => void
}

export default function ModalConfirmSubmit({ hasDozen, submitConfirm, setSubmitConfirm, onSubmit }: ModalConfirmItemProps) {
    const [open, setOpen] = React.useState<boolean>(submitConfirm != undefined);

    const schema = z.object({
        warehouse_id: z.string().optional(),
        notes: z.string().nonempty({ message: "Catatan diperlukan" })
    }).superRefine((data, ctx) => {
        if (hasDozen) {
            if (!data.warehouse_id) {
                ctx.addIssue({
                    path: ["warehouse_id"],
                    message: "Warehouse dibutuhkan",
                    code: z.ZodIssueCode.custom,
                });
            }
        }
    });

    useEffect(() => {
        setOpen(submitConfirm != undefined);
        form.reset();
    }, [submitConfirm]);

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            warehouse_id: "",
            notes: ""
        }
    });

    const submitForm = async (values: FieldValues) => {
        if (values !== undefined && submitConfirm) {
            onSubmit(values['notes'], values['warehouse_id']);
            setSubmitConfirm(undefined)
            setOpen(false)
        }
    }

    return <Dialog open={open} onOpenChange={(open) => { setSubmitConfirm?.(undefined); setOpen(open) }}>
        <DialogContent className={`flex flex-col max-h-[90vh] p-0 select-none`}>
            <DialogHeader className="px-6 pt-6">
                <DialogTitle>Tentukan Tempat Penyimpanan Produk Satuan</DialogTitle>
                <DialogDescription>Barang dengan jumlah satuan akan diletakkan di rak bawah</DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(submitForm)}
                    className="flex flex-col flex-1 h-0 select-none">
                    <ScrollArea className="flex-1 space-y-8 overflow-y-auto">
                        {hasDozen && (
                            <FormField
                                control={form.control}
                                name={"warehouse_id"}
                                render={({ field, fieldState }) => (
                                    <FormItem className="px-7 py-2">
                                        <FormLabel>Gudang</FormLabel>
                                        <FormControl>
                                            <DynamicCombobox
                                                aria-invalid={fieldState.invalid}
                                                source={Services.MasterWarehouse.index}
                                                id="id"
                                                label="name"
                                                placeholder="Nama gudang"
                                                value={field.value ?? ""}
                                                onValueChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormDescription>Gudang penyimpanan barang lusinan</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        <FormField
                            control={form.control}
                            name={"notes"}
                            render={({ field, fieldState }) => (
                                <FormItem className="px-7 py-2">
                                    <FormLabel>Catatan</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            aria-invalid={fieldState.invalid}
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Catatan tambahan"
                                        />
                                    </FormControl>
                                    <FormDescription>Catatan tambahan</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </ScrollArea>
                    <DialogFooter className="sm:justify-end px-6 pb-6">
                        <DialogClose asChild>
                            <Button variant="outline">Batal</Button>
                        </DialogClose>
                        <Button type="submit">Simpan</Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    </Dialog >
}