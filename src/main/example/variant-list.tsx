import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Control, FieldValues } from "react-hook-form";
import { DynamicCombobox } from "@/components/custom/dynamic-combobox";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Services from "@/services";
import { cn } from "@/lib/utils";

export default function VariantListItem<T>({ control, index, rowKey, handleRemove }: { control: Control<FieldValues, T, FieldValues>, rowKey: string, index: number, handleRemove: (index: number) => void }) {

    return <div className="flex flex-1 gap-0 items-end">
        <FormField
            control={control}
            name={`${rowKey}.${index}.size_id`}
            render={({ field, fieldState }) => (
                <FormItem className="w-full h-full">
                    <FormControl>
                        <DynamicCombobox
                            id="id"
                            label="name"
                            placeholder="Ukuran"
                            type="single"
                            variant="ghost"
                            className={cn("w-full rounded-none rounded-l-md border border-r-0 shadow-none")}
                            source={Services.MasterSize.index}
                            value={field.value}
                            onValueChange={field.onChange} />
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
                            onChange={field.onChange} />
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
                            className="w-full rounded-none border border-r-0 shadow-none"
                            value={field.value}
                            onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
        <div className="h-full">
            <Button tabIndex={-1} variant="outline" className="border rounded-none rounded-r-md" type="button" onClick={() => handleRemove(index)}><X color="red" /></Button>
        </div>
    </div>
}