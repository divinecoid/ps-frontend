import {
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from "@/components/ui/form";
import { Control, FieldValues, Path } from "react-hook-form";
import DynamicInput from "@/components/custom/dynamic-input";
import { FormShape } from "@/interfaces/base";
import generateSchema from "@/lib/generate-schema";
import { TableCell, TableRow } from "@/components/ui/table"
import { Button } from "../ui/button";

interface ItemProps<T extends FieldValues> {
    isEdit?: boolean,
    formShape: FormShape<T>[];
    rowKey: string;
    fields: Record<"id", string>[]
    control: Control<FieldValues, T, FieldValues>
    handleRemove: (index: number) => void
}
export default function TableRowForm<T extends FieldValues>({
    control,
    formShape,
    rowKey,
    fields,
    handleRemove
}: ItemProps<T>) {
    const { meta, api, component } = generateSchema<T>(formShape)

    return fields.map((row, index) => (
        <TableRow key={row.id}>
            {formShape.map((field) => {
                const fieldMeta = meta[field.key];
                const fieldSource = api[field.key];
                const custom = component[field.key];
                return (
                    <TableCell key={field.key}>
                        <FormField
                            control={control}
                            name={`${rowKey}.${index}.${field.key}` as Path<T>}
                            render={({ field: rhfField }) => (
                                <FormItem>
                                    <FormControl>
                                        <DynamicInput
                                            field={rhfField}
                                            meta={fieldMeta}
                                            api={fieldSource}
                                            custom={custom}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </TableCell>
                )
            })}
            <TableCell><Button type="button" variant="destructive" onClick={() => handleRemove(index)}>Hapus</Button></TableCell>
        </TableRow>
    ))
}
