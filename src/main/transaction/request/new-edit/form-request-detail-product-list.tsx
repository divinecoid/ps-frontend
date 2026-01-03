import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DynamicCombobox } from "@/components/custom/dynamic-combobox";
import { FieldValues, useFieldArray, UseFormReturn } from "react-hook-form";
import { Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import Services from "@/services";
import React from "react";
import VariantListItem from "./form-request-detail-variant-list-item";
import ConfirmDetail from "./form-request-detail-confirm";

interface DetailProductListProps<T> {
    form: UseFormReturn<FieldValues, T, FieldValues>
    index: number
    parentKey: string
    handleDelete: React.Dispatch<React.SetStateAction<number | undefined>>
    disabled?: boolean
}
export default function ProductList<T>({ form, index, parentKey, handleDelete, disabled }: DetailProductListProps<T>) {
    const [deleteIndex, setDeleteIndex] = React.useState<number | undefined>();
    const fieldName = `${parentKey}.${index}.'variant_detail'`

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: fieldName
    })
    const handleAddVariants = async (value: any) => {
        // const res = await Services.MasterProductModel.show(index);
        // const model: ProductModelViewResponse = await res.json();
        // console.log(model.data); //TODO:
        console.log(value)
        append({
            size_id: undefined,
            dozen_qty: "",
            piece_qty: "",
        })
    }

    React.useEffect(() => {
        // handleAddVariants(form.watch('model_id'));
    }, [form.watch('model_id')]);
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
                            name={`${parentKey}.${index}.color_id`}
                            render={({ field }) => (
                                <FormItem className="w-[40%]">
                                    <FormLabel>Warna</FormLabel>
                                    <FormControl>
                                        <DynamicCombobox
                                            id="id"
                                            label="name"
                                            placeholder="Warna"
                                            type={"single"}
                                            source={Services.MasterColor.index}
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            disabled={disabled} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    {!disabled && (
                        <Button tabIndex={-1} variant="destructive" type="button" onClick={() => handleDelete(index)}><Trash /></Button>
                    )}
                </div>
            </CardHeader>
            <FormLabel className="mt-2">Varian</FormLabel>
            <CardContent className="border shadow-none rounded-sm p-4 grid grid-cols-1 @xl:grid-cols-2 gap-x-8 gap-y-2 mt-4">
                <FormField
                    control={form.control}
                    name={`${parentKey}.${index}.variant_detail`}
                    render={({ field }) => (
                        <>
                            {fields.map((row, index) => (
                                <VariantListItem control={form.control} key={row.id} index={index} handleRemove={setDeleteIndex} rowKey={fieldName} disabled={disabled} />
                            ))}
                            <div className="flex items-end">
                                {!disabled && (
                                    <Button type="button" className="w-full" variant="default" onClick={() => handleAddVariants(field.value)}><Plus /> Tambah varian</Button>
                                )}
                            </div>
                            <FormMessage />
                        </>
                    )} />
            </CardContent>
        </Card>
    </>
}