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

interface ModalConfirmItemProps {
    barcode: string | undefined
    setBarcode: React.Dispatch<React.SetStateAction<string | undefined>>
    onSubmit: (barcode: string, rack_id: string) => void
}

const schema = z.object({
    rack_id: z.string()
})

export default function ModalConfirmItemPiece({ barcode, setBarcode, onSubmit }: ModalConfirmItemProps) {
    const [open, setOpen] = React.useState<boolean>(barcode != undefined);

    useEffect(() => {
        setOpen(barcode != undefined);
        form.reset();
    }, [barcode]);

    const form = useForm({
        resolver: zodResolver(schema)
    });

    const submitForm = async (values: FieldValues) => {
        if (values !== undefined && barcode) {
            onSubmit(barcode, values['rack_id'])
            setBarcode(undefined)
            setOpen(false)
        }
    }

    return <Dialog open={open} onOpenChange={(open) => { setBarcode?.(undefined); setOpen(open) }}>
        <DialogContent className={`flex flex-col max-h-[90vh] p-0 select-none`}>
            <DialogHeader className="px-6 pt-6">
                <DialogTitle>Tentukan Tempat Penyimpanan Produk Satuan</DialogTitle>
                <DialogDescription>Barang dengan jumlah satuan akan diletakkan di rak bawah</DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(submitForm)}
                    className="flex flex-col flex-1 h-0 select-none">
                    <ScrollArea className="flex-1 space-y-8 overflow-y-auto">
                        <FormField
                            control={form.control}
                            name={"rack_id"}
                            render={({ field, fieldState }) => (
                                <FormItem className="px-7 py-2">
                                    <FormLabel>Rak</FormLabel>
                                    <FormControl>
                                        <DynamicCombobox
                                            aria-invalid={fieldState.invalid}
                                            source={Services.MasterRack.index}
                                            id="id"
                                            label="name"
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormDescription>Rak</FormDescription>
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