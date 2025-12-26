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
import React from "react";

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
                const custom = component[field.key]
                if (typeof custom === "function" || React.isValidElement(custom)) {
                    return (
                        <TableCell key={field.key}>
                            {typeof custom === "function"
                                ? custom(index)
                                : custom}
                        </TableCell>
                    )
                }
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
                                            meta={meta[field.key]}
                                            api={api[field.key]}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </TableCell>
                )
            })}

            <TableCell>
                <Button
                    type="button"
                    variant="destructive"
                    onClick={() => handleRemove(index)}
                >
                    Hapus
                </Button>
            </TableCell>
        </TableRow>
    ))
}
