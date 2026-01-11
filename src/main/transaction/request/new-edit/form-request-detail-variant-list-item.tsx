import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Control, FieldValues } from "react-hook-form";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import React from "react";
import { Combobox } from "@/components/custom/combobox";

interface DetailVariantListProps {
    control: Control<FieldValues>
    rowKey: string
    index: number
    handleRemove: (index: number) => void
    disabled?: boolean
    sizes: {id: string, name: string}[];
}
function VariantListItem({ control, index, rowKey, handleRemove, disabled, sizes }: DetailVariantListProps) {

    return <div className="flex flex-1 gap-0 items-end">
        <FormField
            control={control}
            name={`${rowKey}.${index}.size_id`}
            render={({ field, fieldState }) => (
                <FormItem className="w-full h-full">
                    <FormControl>
                        <Combobox
                            id="id"
                            label="name"
                            placeholder="Ukuran"
                            type="single"
                            variant="ghost"
                            data={sizes}
                            className={cn("w-full rounded-none rounded-l-md border border-r-0 shadow-none", fieldState.error && "border-destructive")}
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={disabled} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
        <FormField
            control={control}
            name={`${rowKey}.${index}.dozen_qty`}
            render={({ field }) => (
                <FormItem className="w-full h-full">
                    <FormControl>
                        <Input
                            placeholder="Lusin"
                            type="number"
                            className="w-full rounded-none border border-r-0 shadow-none"
                            value={field.value}
                            onChange={field.onChange}
                            disabled={disabled} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
        <FormField
            control={control}
            name={`${rowKey}.${index}.piece_qty`}
            render={({ field }) => (
                <FormItem className="w-full h-full">
                    <FormControl>
                        <Input
                            placeholder="Potongan"
                            type="number"
                            className={cn(`w-full border rounded-l-none shadow-none`,
                                !disabled && 'border-r-0 rounded-none'
                            )}
                            value={field.value}
                            onChange={field.onChange}
                            disabled={disabled} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
        <div className="h-full">
            {!disabled && (
                <Button tabIndex={-1} variant="outline" className="border rounded-none rounded-r-md" type="button" onClick={() => handleRemove(index)}><X color="red" /></Button>
            )}
        </div>
    </div>
}

export default React.memo(VariantListItem);