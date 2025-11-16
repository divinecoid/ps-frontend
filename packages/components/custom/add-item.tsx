import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FieldValues, Path, SubmitErrorHandler, SubmitHandler, UseFormReturn } from "react-hook-form";
import z from "zod";
import { ZodTypeAny } from "zod/v3";
import DynamicInput, { InputType } from "@/components/custom/dynamic-input";

interface ModalAddRackProps<T extends FieldValues> {
    title?: string;
    description?: string;
    children?: React.ReactNode;
    footer?: React.ReactNode;
    form: UseFormReturn<T>;
    onSubmit?: SubmitHandler<T>;
    onError?: SubmitErrorHandler<T>;
    schema?: z.ZodObject;
}

interface FieldDescription {
    label?: string;
    description?: string;
    placeholder?: string;
    type?: InputType;
}

export interface FieldMeta {
    label: string;
    description?: string;
    placeholder?: string;
    type?: InputType;
}

export function withMeta<T extends z.ZodTypeAny>(schema: T, meta: FieldMeta) {
    return schema.describe(JSON.stringify(meta));
}

export default function ModalAddItem<T extends FieldValues>({
    title,
    description,
    children,
    form,
    onSubmit,
    onError,
    schema
}: ModalAddRackProps<T>) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline"><Plus />Create</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-8">
                        {children}
                        {Object.entries(schema.shape as Record<string, ZodTypeAny>).map(([key, value]) => {
                            const fieldDescription: FieldDescription = JSON.parse(value.description ?? "{}");
                            return <FormField
                                control={form.control}
                                key={key}
                                name={key as Path<T>}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{fieldDescription.label}</FormLabel>
                                        <FormControl>
                                            <DynamicInput placeholder={fieldDescription.placeholder} type={fieldDescription.type} {...field} />
                                        </FormControl>
                                        <FormDescription>{fieldDescription.description}</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        })}
                        <DialogFooter className="sm:justify-end">
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