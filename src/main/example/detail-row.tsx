
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
import Services from "@/services";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useState } from "react";
import ConfirmDetail from "./detail-confirm";

interface DetailProps {
    schema: z.ZodRawShape
    rowKey: string
}

export default function DetailRow({ schema, rowKey }: DetailProps) {
    const [deleteId, setDeleteId] = useState<number | undefined>();
    const { control } = useFormContext()
    const { append, fields, remove } = useFieldArray({
        control,
        name: rowKey
    })

    const handleAdd = () => {
        append({
            model_id: undefined,
            color_id: undefined,
            size_id: undefined,
            dozen_qty: 0,
            piece_qty: 0,
        })
    }

    return <div className={`flex flex-col h-full select-none`}>
        <ConfirmDetail id={deleteId} setId={setDeleteId} action={remove} variant="destructive" title="Apakah anda yakin untuk menghapus ini?" description="Aksi ini akan menghapus baris terpilih secara permanen!" />
        <Button type="button" className="self-end" onClick={handleAdd}><Plus />Tambah</Button>
        <Table>
            {fields.length == 0 && <TableCaption>Daftar permintaan Anda.</TableCaption>}
            <TableHeader>
                <TableRow>
                    <TableHead>Model</TableHead>
                    <TableHead>Warna</TableHead>
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
                    rowKey={rowKey}
                    handleRemove={(index) => setDeleteId(index)}
                    formShape={[
                        {
                            key: "model_id",
                            type: "combobox",
                            schema: schema.model_id,
                            source: {
                                api: Services.MasterProductModel.index,
                                id: "id",
                                label: "name"
                            },
                            placeholder: "Model",
                        },
                        {
                            key: "color_id",
                            type: "combobox",
                            schema: schema.color_id,
                            source: {
                                api: Services.MasterColor.index,
                                id: "id",
                                label: "name"
                            },
                            placeholder: "Warna",
                        },
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