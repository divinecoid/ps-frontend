
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
import VariantDetailRow from "./variant-detail-row";

interface DetailProps {
    schema: z.ZodRawShape
    variantSchema: z.ZodRawShape
    rowKey: string
}

export default function DetailRow({ schema, variantSchema, rowKey }: DetailProps) {
    const [deleteIndex, setDeleteIndex] = useState<number | undefined>();
    const { control } = useFormContext()
    const { append, fields, remove } = useFieldArray({
        control,
        name: rowKey
    })

    const handleAdd = () => {
        append({
            model_id: undefined,
            color_id: undefined,
            variant_detail: [
                {
                    size_id: undefined,
                    dozen_qty: 0,
                    piece_qty: 0,
                }
            ]
        })
    }

    return <div className={`flex flex-col h-full select-none`}>
        <ConfirmDetail index={deleteIndex} setIndex={setDeleteIndex} action={remove} variant="destructive" title="Apakah anda yakin untuk menghapus ini?" description="Aksi ini akan menghapus baris terpilih secara permanen!" />
        <Button type="button" className="self-end" onClick={handleAdd}><Plus />Tambah</Button>
        <Table>
            {fields.length == 0 && <TableCaption>Daftar permintaan Anda.</TableCaption>}
            <TableHeader>
                <TableRow>
                    <TableHead>Model</TableHead>
                    <TableHead>Warna</TableHead>
                    <TableHead className="w-[50px]">Detail</TableHead>
                    <TableHead className="w-[50px]">Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRowForm
                    control={control}
                    fields={fields}
                    rowKey={rowKey}
                    handleRemove={(index) => setDeleteIndex(index)}
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
                            key: "variant_detail",
                            type: "custom",
                            schema: z.array(z.object(variantSchema)).min(1, {
                                message: "Minimal tambahkan 1 model yang akan dijahit."
                            }),
                            custom: (index: number) => (
                                <VariantDetailRow
                                    parentIndex={index}
                                    parentKey={rowKey}
                                    rowKey="variant_detail"
                                    schema={variantSchema}
                                />
                            )
                        }
                    ]} />

            </TableBody>
        </Table>
    </div>
}