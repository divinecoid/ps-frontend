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
import { z } from "zod/v3";
import { zodResolver } from "@hookform/resolvers/zod";
import DynamicInput from "@/components/custom/dynamic-input";
import { BaseApiCallProps, FormShape } from "@/interfaces/base";
import { toast } from "sonner";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import generateSchema from "@/lib/generate-schema";

interface ModalItemProps<T extends FieldValues> {
    id?: string;
    setId?: React.Dispatch<React.SetStateAction<string | undefined>>
    isEdit?: boolean,
    disabled?: boolean;
    title?: string;
    description?: string;
    children?: React.ReactNode;
    footer?: React.ReactNode;
    services?: BaseApiCallProps<T>;
    onSubmit?: () => void;
    onError?: SubmitErrorHandler<FieldValues>;
    formShape: FormShape<T>[];
}

export default function ModalItem<T extends FieldValues>({
    id,
    setId,
    isEdit,
    disabled,
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
                    const res = await services?.show?.(id);
                    const json = await res?.json();
                    if (res?.ok) {
                        form.reset(json.data);
                        setOpen(true);
                    } else {
                        toast.error(json.message, { richColors: true });
                        setId?.(undefined);
                    }
                }
            } catch (error) {
                if (error instanceof Error) {
                    toast.error(error.message, { richColors: true });
                    setId?.(undefined);
                }
            } finally {
                setLoading(false);
            }
        }
        viewData();
    }, [id]);

    const submitForm = async (values: FieldValues) => {
        setLoading(true);
        try {
            const res = await (id ? services?.update?.(id, values as T) : services?.store?.(values as T));
            const json = await res?.json();
            if (res?.ok) {
                onSubmit?.();
                setId?.(undefined);
                setOpen(false);
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
    return (
        <Dialog open={open} onOpenChange={(open) => { setId?.(undefined); setOpen(open); if (open) form.reset(defaultValues) }}>
            {!isEdit && (
                <DialogTrigger asChild className="select-none">
                    <Button variant="outline"><Plus /> Tambah</Button>
                </DialogTrigger>
            )}
            <DialogContent className={`flex flex-col max-h-[90vh] p-0 select-none ${loading ? 'cursor-progress' : undefined}`}>
                <DialogHeader className="px-6 pt-6">
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(submitForm, onError)}
                        className="flex flex-col flex-1 h-0 select-none">
                        <ScrollArea className="flex-1 overflow-y-auto">
                            {Object.entries((schema as z.ZodObject<T>).shape).map(([key]) => {
                                const fieldMeta = meta[key];
                                const fieldSource = api[key];
                                return (
                                    <FormField
                                        key={key}
                                        control={form.control}
                                        name={key as Path<T>}
                                        render={({ field, fieldState }) => (
                                            <FormItem className="px-7 py-2">
                                                <FormLabel>{fieldMeta.label}</FormLabel>
                                                <FormControl>
                                                    <DynamicInput
                                                        aria-invalid={fieldState.invalid}
                                                        field={field}
                                                        meta={fieldMeta}
                                                        api={fieldSource}
                                                        disabled={disabled || fieldMeta.disabled}
                                                    />
                                                </FormControl>
                                                <FormDescription>{fieldMeta.description}</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                );
                            })}
                            {children}
                        </ScrollArea>
                        <DialogFooter className="sm:justify-end px-6 pb-6">
                            {disabled ? (
                                <DialogClose asChild>
                                    <Button variant="outline">Tutup</Button>
                                </DialogClose>
                            ) : (
                                <>
                                    <DialogClose asChild>
                                        <Button variant="outline">Batal</Button>
                                    </DialogClose>
                                    <Button type="submit">Simpan</Button>
                                </>
                            )}
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}