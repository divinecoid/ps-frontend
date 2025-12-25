import { Button } from "@/components/ui/button";
import { Card, CardDescription } from "@/components/ui/card";
import { Plus } from "lucide-react";
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import z from "zod/v3";
import ProductList from "./form-request-detail-product-list";
import ConfirmDetail from "./form-request-detail-confirm";
import { FormDescription, FormField, FormLabel } from "@/components/ui/form";
import { cn } from "@/lib/utils";

interface DetailProps {
    variantSchema: z.ZodRawShape
    rowKey: string
}

export default function DetailList({ rowKey }: DetailProps) {
    const [deleteId, setDeleteId] = React.useState<number | undefined>();

    const form = useFormContext()
    const { append, fields, remove } = useFieldArray({
        control: form.control,
        name: rowKey
    })

    const handleAdd = () => {
        append({
            model_id: undefined,
            color_id: undefined,
        })
    }

    return <div className="mb-2">
        <div className="mb-3">
            <ConfirmDetail id={deleteId} setId={setDeleteId} action={remove} variant="destructive" title="Apakah anda yakin untuk menghapus ini?" description="Aksi ini akan menghapus produk terpilih secara permanen!" />
            <div className="flex my-2">
                <FormField control={form.control} name="request_detail" render={() => (
                    <FormLabel className="flex-1">Produk</FormLabel>
                )} />
                <Button type="button" variant="default" onClick={() => handleAdd()}><Plus />Tambah produk</Button>
            </div>
            <Card className={cn("shadow-none bg-secondary p-2 gap-2 grid lg:grid-cols-2 sm:grid-cols-1", (form.formState.errors[rowKey]?.message || form.formState.errors?.[rowKey]?.root?.message) && "border-destructive bg-destructive/10")}>
                {fields.length == 0 && <CardDescription className="text-center col-span-2 h-full m-4">Daftar permintaan Anda masih kosong, silahkan tekan tambah produk yang akan dijahit!</CardDescription>}
                {fields.map((row, index) => (
                    <ProductList key={row.id} form={form} index={index} parentKey={rowKey} handleDelete={setDeleteId} />
                ))}
            </Card>
        </div>
        <FormDescription>Daftar produk yang akan dijahit.</FormDescription>
    </div>
}