import ModalItem from "@/components/custom/modal-item";
import { BaseModalForm } from "@/interfaces/base";
import { Rack } from "@/interfaces/rack";
import Services from "@/services";
import { z } from "zod/v3";

const testing = false;

export default function ModalRack(props: BaseModalForm) {

    const test = <ModalItem
        title={props.isEdit ? "Edit Rack" : "Add Rack"}
        description={props.isEdit ? "Edit Rack" : "Add new rack"}
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
                placeholder: "EX-001",
            },
            {
                key: "name",
                type: "textarea",
                schema: z.string(),
                label: "Name",
                description: "Input racks' name.",
                placeholder: "Book rack",
            },
            {
                key: "warehouse_id",
                type: "number",
                schema: z.string(),
                label: "Warehouse",
                description: "This is your public display name.",
                placeholder: "WarehouseNumber",
            },
            {
                key: "d",
                type: "range",
                schema: z.array(z.coerce.number()).length(1),
                label: "Color",
                description: "This is your public display name.",
                max: 100,
                defaultValue: [3],
                step: 1,
            },
            {
                key: "e",
                type: "select",
                schema: z.string(),
                label: "Warehouse",
                description: "This is your select.",
                options: {
                    a: "a",
                    b: "b",
                    c: "cCCCCCc",
                },
                defaultValue: "a",
            },
            {
                key: "f",
                type: "radio",
                schema: z.string(),
                label: "Warehouse",
                description: "This is your radio.",
                options: {
                    a: "a",
                    b: "b",
                    c: "c",
                },
                defaultValue: "a",
            },
            {
                key: "g",
                type: "switch",
                schema: z.coerce.boolean(),
                label: "Warehouse",
                description: "This is your switch.",
                placeholder: "DICK",
            },
            {
                key: "h",
                type: "checkbox",
                schema: z.coerce.boolean(),
                label: "Warehouse",
                description: "This is your checkbox.",
                placeholder: "DICK",
            },
            {
                key: "i",
                type: "combobox",
                schema: z.string().nonempty({
                    message: "i is required",
                }),
                label: "Combobox",
                description: "Combobox",
                placeholder: "COMBO",
                source: {
                    id: "id",
                    label: "name",
                    api: Services.MasterRack.index
                }
            },
        ]} />
    const rack = <ModalItem<Rack>
        title={props.isEdit ? "Edit Rack" : "Add Rack"}
        description={props.isEdit ? "Edit Rack" : "Add new rack"}
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