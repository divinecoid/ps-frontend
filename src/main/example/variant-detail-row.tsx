
import {
    Table,
    TableBody,
    TableCaption,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import TableRowForm from "@/components/custom/table-row-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import z from "zod/v3";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useState } from "react";
import ConfirmDetail from "./detail-confirm";
import Services from "@/services";

interface DetailProps {
    schema: z.ZodRawShape
    parentKey: string
    parentIndex: number
    rowKey: string
}

export default function VariantDetailRow({
    schema,
    parentKey,
    parentIndex,
    rowKey
}: DetailProps) {
    const [deleteIndex, setDeleteIndex] = useState<number | undefined>();
    const { control } = useFormContext()
    const fieldName = `${parentKey}.${parentIndex}.${rowKey}` as const

    const { fields, append, remove } = useFieldArray({
        control,
        name: fieldName
    })

    const handleAdd = () => {
        append({
            size_id: undefined,
            dozen_qty: 0,
            piece_qty: 0,
        })
    }

    return <div className={`flex flex-col h-full select-none`}>
        <ConfirmDetail index={deleteIndex} setIndex={setDeleteIndex} action={remove} variant="destructive" title="Apakah anda yakin untuk menghapus ini?" description="Aksi ini akan menghapus baris terpilih secara permanen!" />
        <Table>
            <TableCaption>
                <Button type="button" className="self-end" onClick={handleAdd}><Plus />Tambah</Button>
            </TableCaption>
            {fields.length == 0 && <TableCaption>Daftar permintaan Anda.</TableCaption>}
            <TableHeader>
                <TableRow>
                    <TableHead>Ukuran</TableHead>
                    <TableHead className="w-[50px]">Jumlah (Lusin)</TableHead>
                    <TableHead className="w-[50px]">Jumlah (Satuan)</TableHead>
                    <TableHead className="w-[50px]">Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRowForm
                    control={control}
                    fields={fields}
                    rowKey={fieldName}
                    handleRemove={(index) => setDeleteIndex(index)}
                    formShape={[
                        {
                            key: "size_id",
                            type: "combobox",
                            schema: schema.size_id,
                            source: {
                                api: Services.MasterSize.index,
                                id: "id",
                                label: "name"
                            },
                            placeholder: "Ukuran",
                        },
                        {
                            key: "dozen_qty",
                            type: "number",
                            schema: schema.dozen_qty,
                            placeholder: "Jumlah lusin.",
                            defaultValue: 0
                        },
                        {
                            key: "piece_qty",
                            type: "number",
                            schema: schema.piece_qty,
                            placeholder: "Jumlah satuan.",
                            defaultValue: 0
                        },
                    ]} />

            </TableBody>
        </Table>
    </div>
}