import { Card, CardDescription } from "@/components/ui/card";
import React from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import ProductList from "./form-fabric-cutting-receive-detail-product-list";
import { FormDescription, FormField, FormLabel } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { prefetchModelSizes } from "@/lib/master-data-cache";

interface DetailProps {
    rowKey: string
    disabled?: boolean
}

export default function DetailList({ rowKey, disabled }: DetailProps) {
    const form = useFormContext();

    const { fields, replace } = useFieldArray({
        control: form.control,
        name: rowKey,
    });

    const fabricDetail = useWatch({
        control: form.control,
        name: "fabric_detail",
    });

    const requestDetail = useWatch({
        control: form.control,
        name: "request_detail",
    });

    React.useEffect(() => {
        const currentReceive = form.getValues(rowKey) ?? [];

        const modelIds = [
            ...(requestDetail ?? []).map((d: { model_id?: string }) => d.model_id),
            ...currentReceive.map((d: { model_id?: string }) => d.model_id),
        ].filter(Boolean) as string[];

        prefetchModelSizes(modelIds);
    }, [requestDetail, rowKey, form]);

    React.useEffect(() => {
        if (!fabricDetail?.length || !requestDetail?.length) return;

        const currentReceive = form.getValues(rowKey) ?? [];

        const existing = new Map(
            currentReceive.map((item: any) => [
                `${item.cloth_id}-${item.model_id}`,
                item,
            ])
        );

        const result = [];

        for (const fabric of fabricDetail) {
            for (const request of requestDetail) {
                const key = `${fabric.fabric_id}-${request.model_id}`;

                const old = existing.get(key);

                result.push(
                    old ?? {
                        model_id: request.model_id,
                        cloth_id: fabric.fabric_id,
                        cloth_detail: request.variant_detail.map((v: any) => ({
                            ...v,
                        })),
                        variant_detail: request.variant_detail.map((v: { size_id: string }) => ({
                            size_id: v.size_id,
                            dozen_qty: "",
                            piece_qty: "",
                        })),
                    }
                );
            }
        }

        const currentKeys = currentReceive.map(
            (x: any) => `${x.cloth_id}-${x.model_id}`
        );

        const nextKeys = result.map(
            (x: any) => `${x.cloth_id}-${x.model_id}`
        );

        const same =
            currentKeys.length === nextKeys.length &&
            currentKeys.every((key: string, index: number) => key === nextKeys[index]);

        if (!same) {
            replace(result);
        }
    }, [fabricDetail, requestDetail, rowKey, form]);


    return (
        <div className="mb-2">

            <FormField
                control={form.control}
                name="request_detail"
                render={() => (
                    <div className="mb-3">
                        <div className="flex my-2">
                            <FormLabel className="flex-1 py-3">Hasil Potong</FormLabel>
                        </div>

                        <Card
                            className={cn(
                                "shadow-none bg-secondary p-2 gap-2 grid lg:grid-cols-2 sm:grid-cols-1",
                                (form.formState.errors[rowKey]?.message ||
                                    form.formState.errors?.[rowKey]?.root?.message) &&
                                "border-destructive bg-destructive/10"
                            )}
                        >
                            {fields.length === 0 && (
                                <CardDescription className="text-center col-span-2 h-full m-4">
                                    Daftar permintaan Anda masih kosong, silahkan tekan tambah
                                    produk yang akan dijahit!
                                </CardDescription>
                            )}

                            {fields.map((row, index) => (
                                <ProductList
                                    key={row.id}
                                    form={form}
                                    index={index}
                                    parentKey={rowKey}
                                    disabled={disabled}
                                />
                            ))}
                        </Card>
                    </div>
                )}
            />

            <FormDescription>
                Daftar produk yang akan dijahit.
            </FormDescription>
        </div>
    );
}
