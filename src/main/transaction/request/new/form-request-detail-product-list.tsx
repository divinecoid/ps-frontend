import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DynamicCombobox } from "@/components/custom/dynamic-combobox";
import { FieldValues, useFieldArray, UseFormReturn, useWatch } from "react-hook-form";
import { Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import Services from "@/services";
import React from "react";
import VariantListItem from "./form-request-detail-variant-list-item";
import ConfirmDetail from "./form-request-detail-confirm";
import { ModelSize } from "@/interfaces/model-size";
import { BaseApiCallIndexProps } from "@/interfaces/base";
import { TooltipHover } from "@/components/custom/tooltip-hover";

interface DetailProductListProps<T> {
    form: UseFormReturn<FieldValues, T, FieldValues>
    index: number
    parentKey: string
    handleDelete: React.Dispatch<React.SetStateAction<number | undefined>>
    disabled?: boolean
    sizeCache: React.RefObject<Record<string, ModelSize[]>>
}
export default function ProductList<T>({ form, index, parentKey, handleDelete, disabled, sizeCache }: DetailProductListProps<T>) {
    const [deleteIndex, setDeleteIndex] = React.useState<number | undefined>();
    const fieldName = `${parentKey}.${index}.variant_detail`;

    const [sizes, setSizes] = React.useState<ModelSize[]>([]);

    const sizeOptions = React.useMemo(
        () => sizes.map(s => ({ id: s.id, name: s.name })),
        [sizes]
    );


    const { fields, append, remove, replace } = useFieldArray({
        control: form.control,
        name: fieldName
    })

    const handleAddVariants = async () => {
        append({
            size_id: undefined,
            dozen_qty: "",
            piece_qty: "",
        })
    }

    const modelId = useWatch({
        control: form.control,
        name: `${parentKey}.${index}.model_id`,
    });

    const clothDetail = useWatch({
        control: form.control,
        name: `${parentKey}.${index}.cloth_detail`,
    });

    const previousModelId = React.useRef<string | undefined>(modelId);

    React.useEffect(() => {
        const prev = previousModelId.current;
        previousModelId.current = modelId;

        if (!modelId) {
            setSizes([]);
            return;
        }

        // Only clear cloth_id when the user explicitly changes from one model to another.
        // Do NOT clear when autofill sets model_id for the first time (prev === undefined).
        if (prev !== undefined && prev !== modelId) {
            form.setValue(
                `${parentKey}.${index}.cloth_id`,
                undefined,
                { shouldValidate: false, shouldDirty: false }
            );
        }

        const applySizes = (data: ModelSize[]) => {
            setSizes(data);

            // Preserve any quantities already in the form (e.g. from autofill)
            const current = form.getValues(fieldName) ?? [];
            const next = data.map(s => {
                const existing = current.find(
                    (c: { size_id: string }) => c.size_id === s.id
                );
                return {
                    size_id: s.id,
                    dozen_qty: existing?.dozen_qty ?? "",
                    piece_qty: existing?.piece_qty ?? "",
                };
            });

            const same =
                current.length === next.length &&
                current.every((c: { size_id: string }, i: number) => c.size_id === next[i].size_id);

            if (!same) {
                replace(next);
            }
        };

        if (sizeCache.current[modelId]) {
            applySizes(sizeCache.current[modelId]);
            return;
        }

        Services.MasterProductModel.model_size(modelId)
            .then(res => res.json())
            .then(json => {
                sizeCache.current[modelId] = json.data;
                applySizes(json.data);
            });
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
                                            disabled={true} />
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
                                            disabled={true} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    {/* {!disabled && (
                        <TooltipHover
                            tooltip="Hapus">
                            <Button tabIndex={-1} variant="destructive" type="button" onClick={() => handleDelete(index)}><Trash /></Button>
                        </TooltipHover>
                    )} */}
                </div>
            </CardHeader>
            <FormLabel className="mt-2">Varian</FormLabel>
            <CardContent className="border shadow-none rounded-sm p-4 grid grid-cols-1 @xl:grid-cols-2 gap-x-8 gap-y-2 mt-4">
                <FormField
                    control={form.control}
                    name={`${parentKey}.${index}.variant_detail`}
                    render={() => (
                        <>
                            {fields.map((row: any, index) => {
                                const dozenQty = form.getValues(`${fieldName}.${index}.dozen_qty`) ?? row.dozen_qty;
                                const pieceQty = form.getValues(`${fieldName}.${index}.piece_qty`) ?? row.piece_qty;
                                const hasValue = (dozenQty && Number(dozenQty) > 0) || (pieceQty && Number(pieceQty) > 0);
                                if (!hasValue) {
                                    return null;
                                }
                                return (
                                    <VariantListItem control={form.control} key={row.id} index={index} handleRemove={setDeleteIndex} rowKey={fieldName} disabled={disabled} sizes={sizeOptions} />
                                );
                            })}
                            <div className="flex items-end">
                                {/* {!disabled && (
                                    <Button type="button" className="w-full" variant="default" onClick={() => handleAddVariants()}><Plus /> Tambah varian</Button>
                                )} */}
                            </div>
                            <FormMessage />
                        </>
                    )} />
            </CardContent>
        </Card>
    </>
}