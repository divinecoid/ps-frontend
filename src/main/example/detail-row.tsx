
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

interface DetailProps {
    schema: z.ZodRawShape
    rowKey: string
}

export default function DetailRow({ schema, rowKey }: DetailProps) {
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

    const handleRemove = (index: number) => {
        remove(index);
    }

    return <div className={`flex flex-col h-full select-none`}>
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
                    handleRemove={handleRemove}
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
                        },
                        {
                            key: "piece_qty",
                            type: "number",
                            schema: schema.piece_qty,
                            placeholder: "Jumlah satuan."
                        },
                    ]} />

            </TableBody>
        </Table>
    </div>
}