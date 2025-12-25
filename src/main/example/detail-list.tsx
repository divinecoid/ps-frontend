import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import z from "zod/v3";
import VariantList from "./model-list";
import ConfirmDetail from "./detail-confirm";
import { FormLabel } from "@/components/ui/form";

interface DetailProps {
    schema: z.ZodRawShape
    variantSchema: z.ZodRawShape
    rowKey: string
}

export default function DetailList({ schema, rowKey }: DetailProps) {
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
            // variant_detail: [
                // {
                //     size_id: undefined,
                //     dozen_qty: 0,
                //     piece_qty: 0,
                // }
            // ]
        })
    }

    return <>
        <ConfirmDetail id={deleteId} setId={setDeleteId} action={remove} variant="destructive" title="Apakah anda yakin untuk menghapus ini?" description="Aksi ini akan menghapus model terpilih secara permanen!" />
        <div className="flex my-2">
            <FormLabel className="flex-1">Model</FormLabel>
            <Button type="button" variant="default" onClick={() => handleAdd()}><Plus />Tambah model</Button>
        </div>
        <Card className="shadow-none bg-secondary p-2 gap-2 grid lg:grid-cols-2 sm:grid-cols-1">
            {fields.map((row, index) => (
                <VariantList key={row.id} form={form} index={index} parentKey={rowKey} handleDelete={setDeleteId} />
            ))}
        </Card>
    </>
}