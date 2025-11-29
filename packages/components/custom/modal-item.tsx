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
import { FieldValues, Path, SubmitErrorHandler, SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z, ZodTypeAny } from "zod/v3";
import { zodResolver } from "@hookform/resolvers/zod";
import DynamicInput, { InputMeta, InputTypes } from "@/components/custom/dynamic-input";
import { BaseApiCallIndexProps, BaseApiCallProps } from "@/interfaces/base";
import { toast } from "sonner";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    passwordEdit?: boolean;
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
    services?: BaseApiCallProps;
    onSubmit: () => void;
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
            passwordEdit: field.passwordEdit,
            max: field.max,
            step: field.step,
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
    services,
    onSubmit,
    onError,
    formShape,
}: ModalItemProps<T>) {
    const { schema, meta, defaultValues, api } = generateSchema<T>(formShape);
    const [open, setOpen] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(isEdit ? true : false);
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues
    });
    React.useEffect(() => {
        const viewData = async () => {
            try {
                if (isEdit && id) {
                    const res = await services.show(id);
                    const json = await res.json();
                    if (res.ok) {
                        form.reset(json.data);
                        setOpen(true);
                    } else {
                        toast.error(json.message, { richColors: true });
                        setId(undefined);
                    }
                }
            } catch (error) {
                toast.error(error.message, { richColors: true });
                setId(undefined);
            } finally {
                loading && setLoading(false);
            }
        }
        viewData();
    }, [id]);

    const submitForm: SubmitHandler<T> = async (values) => {
        setLoading(true);
        try {
            const res = await (id ? services.update(id, values) : services.store(values));
            const json = await res.json();
            if (res.ok) {
                onSubmit();
                isEdit && setId(undefined);
                setOpen(false);
            } else {
                toast.error(String(json.message), { richColors: true });
            }
        } catch (error) {
            toast.error(error.message, { richColors: true })
        } finally {
            loading && setLoading(false);
        }
    }
    return (
        <Dialog open={open} onOpenChange={(open) => { setId && setId(undefined); setOpen(open); open && form.reset(defaultValues); }}>
            {!isEdit && (
                <DialogTrigger asChild className="select-none">
                    <Button variant="outline"><Plus /> Create</Button>
                </DialogTrigger>
            )}
            <DialogContent className={`flex flex-col max-h-[90vh] p-0 select-none ${loading ? 'cursor-wait' : 'cursor-default'}`}>
                <DialogHeader className="px-6 pt-6">
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(submitForm, onError)}
                        className="flex flex-col flex-1 h-0 select-none">
                        <ScrollArea className="flex-1 space-y-8 overflow-y-auto">
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
                                            <FormItem className="px-7 py-2">
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
                        </ScrollArea>
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