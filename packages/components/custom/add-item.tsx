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
import DynamicInput, { InputMeta } from "@/components/custom/dynamic-input";
import { BaseApiCallIndexProps, BaseApiCallCreateProps, BaseApiCallUpdateProps } from "@/interfaces/base";
import { toast } from "sonner";
import { useState } from "react";

interface FormShape {
    key: string;
    type: React.HTMLInputTypeAttribute | "combobox";
    schema: z.ZodTypeAny;
    label?: string;
    description?: string;
    placeholder?: string;
    max?: number;
    step?: number;
    options?: Record<string, string>;
    source?: BaseApiCallIndexProps | null;
    defaultValue?: string | number | (string | number)[];
    keyId?: string;
    keyLabel?: string;
}

interface ModalAddRackProps<T extends FieldValues> {
    id?: string;
    title?: string;
    description?: string;
    children?: React.ReactNode;
    footer?: React.ReactNode;
    onCreate?: BaseApiCallCreateProps;
    onUpdate?: BaseApiCallUpdateProps;
    onError?: SubmitErrorHandler<T>;
    formShape: FormShape[];
}

export function generateSchema(fields: FormShape[]) {
    const shape: Record<string, ZodTypeAny> = {};
    const sources: Record<string, BaseApiCallIndexProps | null> = {};
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
            keyId: field.keyId,
            keyLabel: field.keyLabel
        };
        defaultValues[field.key] = field.defaultValue ?? "";
        if (field.source) {
            sources[field.key] = field.source;
        }
    }
    return {
        schema: z.object(shape),
        meta,
        defaultValues,
        sources
    };
}

export default function ModalAddItem<T extends FieldValues>({
    id,
    title,
    description,
    children,
    onCreate,
    onUpdate,
    onError,
    formShape
}: ModalAddRackProps<T>) {
    const { schema, meta, defaultValues, sources } = generateSchema(formShape);
    const [open, setOpen] = useState(false);
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues
    });
    const submitForm = async (values) => {
        try {
            const res = await (id ? onUpdate(id, values) : onCreate(values));
            const json = await res.json();
            if (res.ok) {
                // return json;
                setOpen(false);
            } else {
                toast.error(String(json.message), {richColors: true});
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <Dialog open={open} onOpenChange={(open) => { setOpen(open); open && form.reset(defaultValues); }}>
            <DialogTrigger asChild className="select-none">
                <Button variant="outline"><Plus /> Create</Button>
            </DialogTrigger>
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
                                const fieldSource = sources[key];
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
                                                        source={fieldSource ?? undefined}
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