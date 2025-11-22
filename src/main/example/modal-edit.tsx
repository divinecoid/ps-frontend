import ModalAddItem from "@/components/custom/modal-item";
import { z } from "zod/v3";
import Services from "@/services";
import { useEffect, useState } from "react";
import { Rack, RackViewResponse } from "@/interfaces/rack";

const testing = false;

export default function ModalEditExample({ onSubmit, id, open, setOpen }) {

    const [data, setData] = useState<Rack>();

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        if (id) {
            try {
                const res = await Services.MasterRack.show(id)
                if (res.ok) {
                    const json: RackViewResponse = await res.json();
                    setData(json.data);
                    
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    const test = <ModalAddItem
        title="Add Rack"
        description="Add new rack"
        onCreate={Services.MasterRack.store}
        onUpdate={Services.MasterRack.update}
        id={id}
        isEdit
        afterSubmit={onSubmit}
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
                schema: z.boolean(),
                label: "Warehouse",
                description: "This is your switch.",
                placeholder: "DICK",
            },
            {
                key: "h",
                type: "checkbox",
                schema: z.boolean(),
                label: "Warehouse",
                description: "This is your checkbox.",
                placeholder: "DICK",
            },
            {
                key: "i",
                type: "combobox",
                schema: z.string(),
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

    const rack = <ModalAddItem
        title="Add Rack"
        description="Add new rack"
        onCreate={Services.MasterRack.store}
        onUpdate={Services.MasterRack.update}
        id={id}
        afterSubmit={onSubmit}
        formShape={[
            {
                key: "code",
                type: "text",
                schema: z.string().min(2, {
                    message: "Code must be at least 2 characters.",
                }),
                label: "Code",
                description: "Input rack's code.",
                placeholder: "R001",
            },
            {
                key: "name",
                type: "text",
                schema: z.string(),
                label: "Name",
                description: "Input rack's name.",
                placeholder: "Item rack name",
            },
            {
                key: "warehouse_id",
                type: "combobox",
                schema: z.string().nonempty(
                    "Warehouse is required!"
                ),
                label: "Warehouse",
                description: "This is your public display name.",
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