import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FieldValues, Path, SubmitErrorHandler, SubmitHandler, UseFormReturn } from "react-hook-form";
import z from "zod";
import { ZodTypeAny } from "zod/v3";
import DynamicInput, { InputMeta } from "@/components/custom/dynamic-input";

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

export function withMeta<T extends z.ZodTypeAny>(schema: T, meta: InputMeta) {
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

            <DialogContent className="flex flex-col max-h-[90vh] p-0">
                <DialogHeader className="px-6 pt-6">
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit, onError)} className="flex flex-col flex-1 h-0">
                            <div className="flex-1 space-y-8 overflow-y-auto px-6">
                            {Object.entries(schema.shape as Record<string, ZodTypeAny>).map(([key, value]) => {
                                const fieldDescription: InputMeta = JSON.parse(value.description ?? "{}");
                                return <FormField
                                    control={form.control}
                                    key={key}
                                    name={key as Path<T>}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{fieldDescription.label}</FormLabel>
                                            <FormControl>
                                                <DynamicInput meta={fieldDescription} field={field} />
                                            </FormControl>
                                            <FormDescription>{fieldDescription.description}</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
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