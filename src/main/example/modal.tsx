import ModalItem from "@/components/custom/modal-item";
import { BaseModalForm } from "@/interfaces/base";
import { Rack } from "@/interfaces/rack";
import Services from "@/services";
import { z } from "zod/v3";

const testing = false;

export default function ModalRack(props: BaseModalForm) {

    const test = <ModalItem
        services={Services.MasterRack}
        title={props.isEdit ? "Edit Rack" : "Add Rack"}
        description={props.isEdit ? "Edit Rack" : "Add new rack"}
        {...props}
        formShape={[
            {
                key: "text",
                type: "text",
                passwordEdit: props.isEdit,
                schema: props.isEdit ? z.string().optional() : z.string().nonempty("Kata sandi dibutuhkan"),
                label: "Text",
                description: "Input text.",
                placeholder: "Text input",
            },
            {
                key: "password",
                type: "password",
                schema: z.string().min(2, {
                    message: "Password must be at least 2 characters.",
                }),
                label: "Password",
                description: "Input password.",
                placeholder: "Password input",
            },
            {
                key: "textarea",
                type: "textarea",
                schema: z.string(),
                label: "Text Area",
                description: "Input text area.",
                placeholder: "Text area",
            },
            {
                key: "number",
                type: "number",
                schema: z.string(),
                label: "Number",
                description: "This is your number.",
                placeholder: "Number",
            },
            {
                key: "slider",
                type: "range",
                schema: z.array(z.coerce.number()).length(1),
                label: "Volume",
                description: "This is your volume slider.",
                max: 100,
                defaultValue: [10],
                step: 1,
            },
            {
                key: "range",
                type: "range",
                schema: z.array(z.coerce.number()).length(1),
                label: "Range",
                description: "This is your range slider.",
                max: 100,
                defaultValue: [10, 50],
                step: 1,
            },
            {
                key: "select",
                type: "select",
                schema: z.string(),
                label: "Select",
                description: "This is your select.",
                options: {//tipe options bebas, yang penting key: value & key sesuai schema
                    "0": "first option",
                    "1": "second option",
                    "2": "third option",
                },
                defaultValue: "1",//default value bebas, yang penting sesuai dengan key
            },
            {
                key: "radio",
                type: "radio",
                schema: z.string(),
                label: "Radio",
                description: "This is your radio.",
                options: {//tipe options bebas, yang penting key: value
                    "0": "first option",
                    "1": "second option",
                    "2": "third option",
                },
                defaultValue: "2",//default value bebas, yang penting sesuai dengan key
            },
            {
                key: "switch",
                type: "switch",
                schema: z.coerce.boolean(),
                label: "Switch",
                description: "This is your switch.",
                placeholder: "Switch",
            },
            {
                key: "checkbox",
                type: "checkbox",
                schema: z.coerce.boolean(),
                label: "Checkbox",
                description: "This is your checkbox.",
                placeholder: "Checkbox",
            },
            {
                key: "single_combobox",
                type: "combobox",
                schema: z.string().nonempty({
                    message: "combobox is required",
                }),
                label: "Reference selector",
                description: "Reference selector",
                placeholder: "Reference selector",
                source: {
                    id: "id",//id association reference
                    label: "name",//visible label name
                    api: Services.MasterRack.index//source api
                }
            },
            {
                key: "multi_combobox",
                type: "multi-combobox",
                schema: z.array(z.string()).min(1, {
                    message: "multi_combobox is required",
                }),
                label: "Reference set selector",
                description: "Reference set selector",
                placeholder: "Reference set selector",
                source: {
                    id: "id",//id association reference
                    label: "name",//visible label name
                    api: Services.MasterRack.index//source api
                }
            },
            {
                key: "single_datepicker",
                type: "date",
                schema: z.date(),
                mode: "single",
                label: "Single datepicker",
                description: "Datepicker",
                placeholder: "Date",
            },
            {
                key: "multiple_datepicker",
                type: "date",
                schema: z.array(z.date()),
                mode: "multiple",
                label: "Multiple datepicker",
                numberOfMonths: 2,
                description: "Datepicker",
                placeholder: "Date",
            },
            {
                key: "range_datepicker",
                type: "date",
                schema: z.object({ from: z.date(), to: z.date() }),
                mode: "range",
                label: "Range datepicker",
                numberOfMonths: 5,
                description: "Datepicker",
                placeholder: "Date",
            },
            {
                key: "telephone",
                type: "tel",
                schema: z.string().nonempty({
                    message: "telephone is required",
                }),
                label: "Telephone",
                description: "Telephone",
                placeholder: "Telephone",
            },

            {
                key: "hidden",
                type: "hidden",
                schema: z.string().nonempty({
                    message: "hidden is required",
                }),
            },
        ]} />
    const rack = <ModalItem<Rack>
        title={props.isEdit ? "Edit Rack" : "Add Rack"}
        description={props.isEdit ? "Edit Rack" : "Add new rack"}
        services={Services.MasterRack}
        {...props}
        formShape={[
            {
                key: "code",
                type: "text",
                schema: z.string().min(2, {
                    message: "Code must be at least 2 characters.",
                }),
                label: "Code",
                description: "Input rack's code.",
                placeholder: "RC-001",
            },
            {
                key: "name",
                type: "text",
                schema: z.string(),
                label: "Name",
                description: "Input rack's name.",
                placeholder: "Rack name",
            },
            {
                key: "warehouse_id",
                type: "combobox",
                schema: z.string().nonempty({
                    message: "Warehouse is required",
                }),
                label: "Warehouse",
                description: "The location where this rack placed.",
                placeholder: "Warehouse",
                source: {
                    id: "id",
                    label: "name",
                    api: Services.MasterWarehouse.index
                }
            },
        ]} />

    return testing ? test : rack;
}