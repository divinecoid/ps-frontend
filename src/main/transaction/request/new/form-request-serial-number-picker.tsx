import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DynamicCombobox } from "@/components/custom/dynamic-combobox";
import { useFormContext } from "react-hook-form";
import Services from "@/services";

interface SerialNumberPickerProps {
    disabled?: boolean;
}

export default function SerialNumberPicker({ disabled }: SerialNumberPickerProps) {
    const form = useFormContext();

    const handleCuttingSelect = (item: any) => {
        if (!item) return;

        // Set serial_number from the selected cutting
        form.setValue("serial_number", item.serial_number, {
            shouldValidate: true,
            shouldDirty: true,
        });

        // Auto-fill request_detail from receive_detail of the selected cutting
        if (item.receive_detail && Array.isArray(item.receive_detail)) {
            form.setValue("request_detail", item.receive_detail, {
                shouldValidate: false,
                shouldDirty: true,
            });
        }
    };

    return (
        <FormField
            control={form.control}
            name="serial_number"
            render={({ field }) => (
                <FormItem className="px-7 py-2">
                    <FormLabel>Nomor Seri (Serial Number)</FormLabel>
                    <FormControl>
                        <DynamicCombobox
                            id="serial_number"
                            label="serial_number"
                            placeholder="Pilih nomor seri pemotongan kain"
                            type="single"
                            source={Services.TransactionFabricCutting.closedIndex}
                            value={field.value}
                            onValueChange={field.onChange}
                            onItemChange={handleCuttingSelect}
                            disabled={disabled}
                        />
                    </FormControl>
                    <FormDescription>
                        Nomor seri pemotongan kain yang sudah selesai (status CLOSED).
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
