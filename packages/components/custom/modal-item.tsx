import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { FieldValues, Path, SubmitErrorHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z, ZodTypeAny } from "zod/v3";
import { zodResolver } from "@hookform/resolvers/zod";
import DynamicInput, { InputMeta, InputTypes } from "@/components/custom/dynamic-input";
import { BaseApiCallIndexProps, BaseApiCallCreateProps, BaseApiCallUpdateProps, BaseApiCallViewProps } from "@/interfaces/base";
import { toast } from "sonner";
import React from "react";

interface FormShape<T> {
    key: keyof T & string;
    type: InputTypes;
    schema: z.ZodTypeAny;
    label?: string;
    description?: string;
    placeholder?: string;
    max?: number;
    step?: number;
    options?: Record<string, string>;
    source?: {
        id: string;
        label: string;
        api: BaseApiCallIndexProps | null;
    },
    defaultValue?: string | number | (string | number)[];
}

interface ModalItemProps<T extends FieldValues> {
    id?: number;
    setId?: React.Dispatch<React.SetStateAction<number>>
    isEdit?: boolean,
    title?: string;
    description?: string;
    children?: React.ReactNode;
    footer?: React.ReactNode;
    onCreate?: BaseApiCallCreateProps;
    onUpdate?: BaseApiCallUpdateProps;
    onView?: BaseApiCallViewProps;
    afterSubmit: () => void;
    onError?: SubmitErrorHandler<T>;
    formShape: FormShape<T>[];
}

export function generateSchema<T>(fields: FormShape<T>[]) {
    const shape: Record<string, ZodTypeAny> = {};
    const api: Record<string, BaseApiCallIndexProps | null> = {};
    const meta: Record<string, InputMeta> = {};
    const defaultValues: Record<string, any> = {};
    for (const field of fields) {
        shape[field.key] = field.schema;
        meta[field.key] = {
            label: field.label,
            description: field.description,
            placeholder: field.placeholder,
            type: field.type,
            options: field.options,
            defaultValue: field.defaultValue,
            max: field.max,
            step: field.step,
            ...(field.source && {
                source: {
                    id: field.source.id,
                    label: field.source.label
                }
            })
        };
        defaultValues[field.key] = field.defaultValue ?? "";
        if (field.source) {
            api[field.key] = field.source.api;
        }
    }
    return {
        schema: z.object(shape),
        meta,
        defaultValues,
        api
    };
}

export default function ModalItem<T extends FieldValues>({
    id,
    setId,
    isEdit,
    title,
    description,
    children,
    onCreate,
    onUpdate,
    onView,
    afterSubmit,
    onError,
    formShape,
}: ModalItemProps<T>) {
    const { schema, meta, defaultValues, api } = generateSchema<T>(formShape);
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues
    });
    React.useEffect(() => {
        const viewData = async () => {
            try {
                if (isEdit && id) {
                    const res = await onView(id);
                    if (res.ok) {
                        const json = await res.json();
                        form.reset(json.data);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }
        viewData();
    }, [id]);

    const submitForm = async (values) => {
        try {
            const res = await (id ? onUpdate(id, values) : onCreate(values));
            const json = await res.json();
            if (res.ok) {
                afterSubmit();
                isEdit && setId(undefined);
            } else {
                toast.error(String(json.message), { richColors: true });
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <Dialog open={isEdit ? id ? true : false : undefined} onOpenChange={(open) => { setId && setId(undefined); open && form.reset(defaultValues); }}>
            {!isEdit && (
                <DialogTrigger asChild className="select-none">
                    <Button variant="outline"><Plus /> Create</Button>
                </DialogTrigger>
            )}
            <DialogContent className="flex flex-col max-h-[90vh] p-0 select-none">
                <DialogHeader className="px-6 pt-6">
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(submitForm, onError)}
                        className="flex flex-col flex-1 h-0 select-none">
                        <div className="flex-1 space-y-8 overflow-y-auto px-6">
                            {children}
                            {Object.entries((schema as z.ZodObject<any>).shape).map(([key]) => {
                                const fieldMeta = meta[key];
                                const fieldSource = api[key];
                                return (
                                    <FormField
                                        key={key}
                                        control={form.control}
                                        name={key as Path<T>}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{fieldMeta.label}</FormLabel>
                                                <FormControl>
                                                    <DynamicInput
                                                        field={field}
                                                        meta={fieldMeta}
                                                        api={fieldSource ?? undefined}
                                                    />
                                                </FormControl>
                                                <FormDescription>{fieldMeta.description}</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                );
                            })}
                        </div>
                        <DialogFooter className="sm:justify-end px-6 pb-6">
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Submit</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}