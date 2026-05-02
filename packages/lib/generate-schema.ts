import { InputMeta } from "@/components/custom/dynamic-input";
import { BaseApiCallIndexProps, FormShape } from "@/interfaces/base";
import z, { ZodTypeAny } from "zod/v3";

export default function generateSchema<T>(fields: FormShape<T>[]) {
    const shape: Record<string, ZodTypeAny> = {};
    const api: Record<string, BaseApiCallIndexProps | null> = {};
    const meta: Record<string, InputMeta> = {};
    const component: Record<string, React.ReactElement | ((index: number) => React.ReactNode)> = {};
    const defaultValues: Record<string, unknown> = {};
    for (const field of fields) {
        shape[field.key] = field.schema;
        meta[field.key] = {
            label: field.label,
            description: field.description,
            placeholder: field.placeholder,
            numberOfMonths: field.numberOfMonths,
            mode: field.mode,
            type: field.type,
            options: field.options,
            defaultValue: field.defaultValue,
            passwordEdit: field.passwordEdit,
            max: field.max,
            step: field.step,
            disabled: field.disabled,
            ...(field.source && {
                source: {
                    id: field.source.id,
                    label: field.source.label
                }
            })
        };
        defaultValues[field.key] = field.defaultValue ?? undefined;
        if (field.source) {
            api[field.key] = field.source.api;
        }
        if (field.custom) {
            component[field.key] = field.custom;
        }
    }
    return {
        schema: z.object(shape),
        meta,
        defaultValues,
        api,
        component
    };
}