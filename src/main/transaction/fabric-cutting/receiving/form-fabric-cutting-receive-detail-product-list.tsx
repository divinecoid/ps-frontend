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
import { TooltipHover } from "@/components/custom/tooltip-hover";
import { useModelSizes } from "@/hooks/use-model-sizes";
import { Combobox } from "@/components/custom/combobox";

interface DetailProductListProps<T> {
    form: UseFormReturn<FieldValues, T, FieldValues>
    index: number
    parentKey: string
    disabled?: boolean
}
export default function ProductList<T>({ form, index, parentKey, disabled }: DetailProductListProps<T>) {
    const [deleteIndex, setDeleteIndex] = React.useState<number | undefined>();
    const fieldName = `${parentKey}.${index}.variant_detail`;

    const modelId = useWatch({
        control: form.control,
        name: `${parentKey}.${index}.model_id`,
    });
    const previousModelId = React.useRef(modelId);

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

        const current = form.getValues(fieldName) ?? [];

        const next = sizes.map(s => {
            const existing = current.find((c: any) => c.size_id === s.id);
            return {
                size_id: s.id,
                dozen_qty: existing?.dozen_qty ?? "",
                piece_qty: existing?.piece_qty ?? "",
            };
        });
        const same =
            current.length === next.length &&
            current.every((c: { size_id: string }, i: number) => c.size_id === next[i].size_id);

        if (!same && sizes.length > 0) {
            replace(next);
        }
    }, [modelId, sizes, disabled]);

    React.useEffect(() => {
        if (!modelId || previousModelId.current === modelId) return;

        previousModelId.current = modelId;
        form.setValue(
            `${parentKey}.${index}.cloth_id`,
            undefined,
            {
                shouldValidate: false,
                shouldDirty: false,
            }
        );
    }, [modelId, form, parentKey, index]);

    const fabrics = useWatch({
        control: form.control,
        name: "fabric_detail",
    }) ?? [];

    const fabricOptions = React.useMemo(() => {
        return fabrics.map((item: any) => ({
            id: item.fabric_id,
            name: item.sequence,
        }));
    }, [fabrics]);

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
                                        <Combobox
                                            data={fabricOptions}
                                            id="id"
                                            label="name"
                                            placeholder="Seri Kain"
                                            value={field.value}
                                            disabled={true}
                                            onValueChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
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
