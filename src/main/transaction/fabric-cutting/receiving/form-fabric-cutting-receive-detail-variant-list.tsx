import { Button } from "@/components/ui/button";
import { Card, CardDescription } from "@/components/ui/card";
import { Plus } from "lucide-react";
import React from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import ProductList from "./form-fabric-cutting-receive-detail-product-list";
import ConfirmDetail from "./form-fabric-cutting-request-detail-confirm";
import { FormDescription, FormField, FormLabel } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { prefetchModelSizes } from "@/lib/master-data-cache";

interface DetailProps {
    rowKey: string
    disabled?: boolean
}

export default function DetailList({ rowKey, disabled }: DetailProps) {
    const [deleteIndex, setDeleteIndex] = React.useState<number | undefined>();

    const form = useFormContext()
    const { fields, remove } = useFieldArray({
        control: form.control,
        name: rowKey
    })

    const fabricDetail = useWatch({ control: form.control, name: "fabric_detail" });
    const requestDetail = useWatch({ control: form.control, name: "request_detail" });
    const receiveDetail = useWatch({ control: form.control, name: rowKey });

    React.useEffect(() => {
        const modelIds = [
            ...(requestDetail ?? []).map((d: { model_id?: string }) => d.model_id),
            ...(receiveDetail ?? []).map((d: { model_id?: string }) => d.model_id),
        ].filter(Boolean) as string[];
        prefetchModelSizes(modelIds);
    }, [requestDetail, receiveDetail]);

    React.useEffect(() => {
        if (!fabricDetail?.length || !requestDetail?.length) return;

        const result = [];
        for (const fabric of fabricDetail) {
            for (const request of requestDetail) {
                result.push({
                    fabric_id: fabric.fabric_id,
                    model_id: request.model_id,
                    color_id: form.getValues("color_id"),
                    cloth_detail: request.variant_detail,
                    variant_detail: request.variant_detail.map((v: { size_id: string }) => ({
                        size_id: v.size_id,
                        dozen_qty: 0,
                        piece_qty: 0,
                    }))
                });
            }
        }

        form.setValue("receive_detail", result, {
            shouldDirty: false,
            shouldValidate: false,
        });
    }, [fabricDetail, requestDetail]);

    const handleAdd = () => {
        append({
            model_id: undefined,
            color_id: undefined,
        })
    }

    return <div className="mb-2">
        <ConfirmDetail index={deleteIndex} setIndex={setDeleteIndex} action={remove} variant="destructive" title="Apakah anda yakin untuk menghapus ini?" description="Aksi ini akan menghapus produk terpilih secara permanen!" />
        <FormField
            control={form.control}
            name="request_detail"
            render={() => (
                <div className="mb-3">
                    <div className="flex my-2">
                        <FormLabel className="flex-1 py-3">Produk</FormLabel>
                    </div>
                    <Card className={cn("shadow-none bg-secondary p-2 gap-2 grid lg:grid-cols-2 sm:grid-cols-1", (form.formState.errors[rowKey]?.message || form.formState.errors?.[rowKey]?.root?.message) && "border-destructive bg-destructive/10")}>
                        {fields.length == 0 && <CardDescription className="text-center col-span-2 h-full m-4">Daftar permintaan Anda masih kosong, silahkan tekan tambah produk yang akan dijahit!</CardDescription>}
                        {fields.map((row, index) => (
                            <ProductList key={row.id} form={form} index={index} parentKey={rowKey} handleDelete={setDeleteIndex} disabled={disabled} />
                        ))}
                    </Card>
                </div>
            )} />
        <FormDescription>Daftar produk yang akan dijahit.</FormDescription>
    </div>
}
