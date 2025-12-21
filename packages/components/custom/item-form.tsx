import { Button } from "@/components/ui/button";
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
import { z } from "zod/v3";
import { zodResolver } from "@hookform/resolvers/zod";
import DynamicInput from "@/components/custom/dynamic-input";
import { BaseApiCallProps, FormShape } from "@/interfaces/base";
import { toast } from "sonner";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import generateSchema from "@/lib/generate-schema";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface ItemProps<T extends FieldValues> {
    id?: number;
    setId?: React.Dispatch<React.SetStateAction<number | undefined>>
    isEdit?: boolean,
    children?: React.ReactNode;
    footer?: React.ReactNode;
    services?: BaseApiCallProps<T>;
    onError?: SubmitErrorHandler<FieldValues>;
    formShape: FormShape<T>[];
    key?: number;
}

export default function ItemForm<T extends FieldValues>({
    id,
    isEdit,
    children,
    services,
    onError,
    formShape,
    key,
}: ItemProps<T>) {
    const { schema, meta, defaultValues, api, component } = generateSchema<T>(formShape);
    const [loading, setLoading] = React.useState<boolean>(isEdit ? true : false);
    const navigate = useNavigate();
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues
    });
    React.useEffect(() => {
        const viewData = async () => {
            try {
                if (isEdit && id) {
                    const res = await services?.show?.(id);
                    const json = await res?.json();
                    if (res?.ok) {
                        form.reset(json.data);
                    } else {
                        toast.error(json.message, { richColors: true });
                        navigate('../');
                    }
                }
            } catch (error) {
                if (error instanceof Error) {
                    toast.error(error.message, { richColors: true });
                    navigate('../');
                }
            } finally {
                setLoading(false);
            }
        }
        viewData();
    }, [id]);

    const submitForm = async (values: FieldValues) => {
        toast.info(JSON.stringify(values), { richColors: true }) //TODO:
        setLoading(true);
        try {
            const res = await (id ? services?.update?.(id, values as T) : services?.store?.(values as T));
            const json = await res?.json();
            if (res?.ok) {
                navigate('../');
            } else {
                toast.error(String(json.message), { richColors: true });
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message, { richColors: true })
            }
        } finally {
            setLoading(false);
        }
    }
    return <Form {...form} key={key}>
        <form onSubmit={form.handleSubmit(submitForm, onError)}
            className={`flex flex-col flex-1 h-0 select-none ${loading ? 'cursor-wait' : 'cursor-default'}`}>
            <ScrollArea className="flex-1 space-y-8 overflow-y-auto">
                {Object.entries((schema as z.ZodObject<T>).shape).map(([key]) => {
                    const fieldMeta = meta[key];
                    const fieldSource = api[key];
                    const custom = component[key];
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
                                            api={fieldSource}
                                            custom={custom}
                                        />
                                    </FormControl>
                                    <FormDescription>{fieldMeta.description}</FormDescription>
                                    {fieldMeta.type === 'custom' ? (
                                        <p
                                            data-slot="form-message"
                                            className={cn("text-destructive text-sm")}>
                                            {form.formState.errors?.[key]?.root?.message?.toString() ?? form.formState.errors[key]?.message?.toString()}
                                        </p>
                                    ) : <FormMessage />}
                                </FormItem>
                            )}
                        />
                    );
                })}
                {children}
            </ScrollArea>
            <div className="sticky bottom-0 border-t backdrop-blur-md bg-background/70 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end justify-end px-7 py-2">
                <Button variant="outline" type="button" onClick={(e) => { e.preventDefault(); navigate(-1) }}>Cancel</Button>
                <Button type="submit">Submit</Button>
            </div>
        </form>
    </Form>
}