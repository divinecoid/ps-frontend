import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Control, FieldValues } from "react-hook-form";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import React from "react";
import { Combobox } from "@/components/custom/combobox";
import { TooltipHover } from "@/components/custom/tooltip-hover";

interface DetailFabricListProps {
    control: Control<FieldValues>
    rowKey: string
    index: number
    handleRemove: (index: number) => void
    disabled?: boolean
    fabrics: { id: string, name: string }[];
}
function FabricListItem({ control, index, rowKey, handleRemove, disabled, fabrics }: DetailFabricListProps) {

    return <div className="flex flex-1 gap-0">
        <FormField
            control={control}
            name={`${rowKey}.${index}.fabric_id`}
            render={({ field, fieldState }) => (
                <FormItem className="w-full h-full">
                    <TooltipHover
                        tooltip="Kain">
                        <FormControl>
                            <span className="block w-full">
                                <Combobox
                                    id="id"
                                    label="name"
                                    placeholder="Kain"
                                    type="single"
                                    variant="ghost"
                                    data={fabrics}
                                    className={cn("w-full rounded-none rounded-l-md border border-r-0 shadow-none", fieldState.error && "border-destructive")}
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    disabled={disabled} />
                            </span>
                        </FormControl>
                    </TooltipHover>
                    <FormMessage />
                </FormItem>
            )}
        />

        <FormField
            control={control}
            name={`${rowKey}.${index}.quantity`}
            render={({ field }) => (
                <FormItem className="w-full h-full">
                    <TooltipHover
                        tooltip="Jumlah">
                        <FormControl>
                            <span className="block w-full">
                                <Input
                                    placeholder="Jumlah"
                                    type="number"
                                    className={cn(`w-full border rounded-l-none shadow-none`,
                                        !disabled && 'border-r-0 rounded-none'
                                    )}
                                    value={field.value}
                                    onChange={field.onChange}
                                    disabled={disabled} />
                            </span>
                        </FormControl>
                    </TooltipHover>
                    <FormMessage />
                </FormItem>
            )
            }
        />
        < div className="h-full" >
            {!disabled && (
                <TooltipHover
                    tooltip="Hapus">
                    <Button tabIndex={-1} variant="outline" className="border rounded-none rounded-r-md" type="button" onClick={() => handleRemove(index)}><X color="red" /></Button>
                </TooltipHover>
            )}
        </div >
    </div >
}

export default React.memo(FabricListItem);