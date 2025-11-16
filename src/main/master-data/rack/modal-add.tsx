import ModalAddItem, { withMeta } from "@/components/custom/add-item";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod";

const formSchema = z.object({
    code: withMeta(z.string().min(2, {
        message: "Code must be at least 2 characters.",
    }), {
        label: "Code",
        description: "Input rack's code.",
        placeholder: "R001",
        type: "text"
    }),
    name: withMeta(z.string(), {
        label: "Name",
        description: "Input racks' name.",
        placeholder: "Book rack",
        type: "textarea"
    }),
    warehouse_id: withMeta(z.string(), {
        label: "Warehouse",
        description: "This is your public display name.",
        placeholder: "WarehouseNumber",
        type: "number"
    }),
    d: withMeta(z.array(z.number()).length(1), {
        label: "Color",
        description: "This is your public display name.",
        placeholder: "",
        type: "range",
        max: 100,
        defaultValue: [3],
        step: 1
    }),
    e: withMeta(z.string(), {
        label: "Warehouse",
        description: "This is your select.",
        placeholder: "",
        type: "select",
        options: {
            a: "a",
            b: "b",
            c: "cCCCCCc"
        },
        defaultValue: "a"
    }),
    f: withMeta(z.string(), {
        label: "Warehouse",
        description: "This is your radio.",
        placeholder: "",
        type: "radio",
        options: {
            a: "a",
            b: "b",
            c: "c"
        },
        defaultValue: "a"
    }),
    g: withMeta(z.boolean(), {
        label: "Warehouse",
        description: "This is your select.",
        placeholder: "DICK",
        type: "switch",
    }),
    h: withMeta(z.boolean(), {
        label: "Warehouse",
        description: "This is your select.",
        placeholder: "DICK",
        type: "checkbox",
    }),
})
type FormValues = z.infer<typeof formSchema>;

export default function ModalAddRack({ id }: { id?: string }) {

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: "",
            name: "",
            warehouse_id: "",
            d: [0],
            e: "c",
            f: "b",
            g: false,
            h: true
        },
    });

    const onSubmit: SubmitHandler<FormValues> = (values) => {
        console.log(JSON.stringify(values))
    };

    const onError: SubmitErrorHandler<FormValues> = (errors) => {
        console.log(errors);
    };
    return <ModalAddItem
        form={form}
        title="Add Rack"
        description="Add new rack"
        onSubmit={onSubmit}
        onError={onError}
        schema={formSchema} />
}