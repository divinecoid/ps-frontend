import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DynamicCombobox } from "@/components/custom/dynamic-combobox";
import { FieldValues, useFieldArray, UseFormReturn, useWatch } from "react-hook-form";
import { Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import Services from "@/services";
import React from "react";
import VariantListItem from "./form-fabric-cutting-receive-detail-variant-list-item";
import ConfirmDetail from "./form-fabric-cutting-request-detail-confirm";
import { BaseApiCallIndexProps } from "@/interfaces/base";
import { TooltipHover } from "@/components/custom/tooltip-hover";
import { useModelSizes } from "@/hooks/use-model-sizes";

interface DetailProductListProps<T> {
    form: UseFormReturn<FieldValues, T, FieldValues>
    index: number
    parentKey: string
    handleDelete: React.Dispatch<React.SetStateAction<number | undefined>>
    disabled?: boolean
}
export default function ProductList<T>({ form, index, parentKey, handleDelete, disabled }: DetailProductListProps<T>) {
    const [deleteIndex, setDeleteIndex] = React.useState<number | undefined>();
    const fieldName = `${parentKey}.${index}.variant_detail`;

    const modelId = useWatch({
        control: form.control,
        name: `${parentKey}.${index}.model_id`,
    });

    const sizes = useModelSizes(modelId, Boolean(modelId));

    const sizeOptions = React.useMemo(
        () => sizes.map(s => ({ id: s.id, name: s.name })),
        [sizes]
    );

    const { fields, append, remove, replace } = useFieldArray({
        control: form.control,
        name: fieldName
    })

    const handleAddVariants = () => {
        append({
            size_id: undefined,
            dozen_qty: "",
            piece_qty: "",
        })
    }

    React.useEffect(() => {
        if (!modelId || disabled) return;

        const next = sizes.map(s => ({
            size_id: s.id,
            dozen_qty: "",
            piece_qty: "",
        }));

        const current = form.getValues(fieldName) ?? [];
        const same =
            current.length === next.length &&
            current.every((c: { size_id: string }, i: number) => c.size_id === next[i].size_id);

        if (!same && sizes.length > 0) {
            replace(next);
        }
    }, [modelId, sizes, disabled]);

    React.useEffect(() => {
        if (!modelId) return;
        form.setValue(
            `${parentKey}.${index}.cloth_id`,
            undefined,
            {
                shouldValidate: false,
                shouldDirty: false,
            }
        );
    }, [modelId]);

    const colorSource = React.useMemo((): BaseApiCallIndexProps | undefined => {
        if (!modelId) return undefined;
        return (page, limit, search) => Services.MasterProductModel.fabric_color(modelId, page, limit, search);
    }, [modelId]);

    return <>
        <ConfirmDetail index={deleteIndex} setIndex={setDeleteIndex} action={remove} variant="destructive" title="Apakah anda yakin untuk menghapus ini?" description="Aksi ini akan menghapus ukuran terpilih secara permanen!" />
        <Card className="p-4 rounded-lg flex gap-0 h-min @container">
            <CardHeader className="p-0">
                <div className="flex gap-2">
                    <div className="flex flex-1 gap-2 items-start">
                        <FormField
                            control={form.control}
                            name={`${parentKey}.${index}.model_id`}
                            render={({ field }) => (
                                <FormItem className="w-[40%]">
                                    <FormLabel>Model</FormLabel>
                                    <FormControl>
                                        <DynamicCombobox
                                            id="id"
                                            label="name"
                                            placeholder="Model"
                                            type={"single"}
                                            source={Services.MasterProductModel.index}
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            disabled={disabled} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`${parentKey}.${index}.cloth_id`}
                            render={({ field }) => (
                                <FormItem className="w-[40%]">
                                    <FormLabel>Seri Kain</FormLabel>
                                    <FormControl>
                                        <DynamicCombobox
                                            id="id"
                                            label="name"
                                            placeholder="Seri Kain"
                                            type={"single"}
                                            source={colorSource}
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            onItemChange={(item) => {
                                                const fabric = item;
                                                form.setValue(
                                                    `${parentKey}.${index}.cloth_detail`,
                                                    fabric.detail,
                                                    {
                                                        shouldValidate: false,
                                                        shouldDirty: false,
                                                    }
                                                );
                                                const next = sizes.map(size => {
                                                    const stock = (
                                                        fabric.detail as Array<{
                                                            size_id: string;
                                                            avl_qty: number;
                                                        }>
                                                    ).find(d => d.size_id === size.id);

                                                    const qty = stock?.avl_qty ?? 0;
                                                    return {
                                                        size_id: size.id,
                                                        dozen_qty: Math.floor(qty / 12),
                                                        piece_qty: qty % 12,
                                                    };
                                                });
                                                replace(next);
                                            }}
                                            disabled={disabled} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    {!disabled && (
                        <TooltipHover
                            tooltip="Hapus">
                            <Button tabIndex={-1} variant="destructive" type="button" onClick={() => handleDelete(index)}><Trash /></Button>
                        </TooltipHover>
                    )}
                </div>
            </CardHeader>
            <FormLabel className="mt-2">Varian</FormLabel>
            <CardContent className="border shadow-none rounded-sm p-4 grid grid-cols-1 @xl:grid-cols-2 gap-x-8 gap-y-2 mt-4">
                <FormField
                    control={form.control}
                    name={`${parentKey}.${index}.variant_detail`}
                    render={() => (
                        <>
                            {fields.map((row, index) => (
                                <VariantListItem control={form.control} key={row.id} index={index} handleRemove={setDeleteIndex} rowKey={fieldName} disabled={disabled} sizes={sizeOptions} />
                            ))}
                            <div className="flex items-end">
                                {!disabled && (
                                    <Button type="button" className="w-full" variant="default" onClick={() => handleAddVariants()}><Plus /> Tambah varian</Button>
                                )}
                            </div>
                            <FormMessage />
                        </>
                    )} />
            </CardContent>
        </Card>
    </>
}
