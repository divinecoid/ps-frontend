import ModalAddItem from "@/components/custom/add-item";
import { Inventory } from "@/interfaces/inventory";
import Services from "@/services";
import { z } from "zod/v3";

export default function ModalAddInventory({ id }: { id?: string }) {
    return <ModalAddItem<Inventory>
        title="Add Inventory"
        description="Add new inventory"
        onCreate={Services.MasterInventory.store}
        onUpdate={Services.MasterInventory.update}
        formShape={[
            {
                key: "serial_number",
                type: "text",
                schema: z.string().min(2, {
                    message: "Serial number must be at least 2 characters.",
                }),
                label: "Code",
                description: "Input inventory's serial number.",
                placeholder: "IVT-001",
            },
            {
                key: "product_id",
                type: "combobox",
                schema: z.string().nonempty({
                    message: "Product is required"
                }),
                source: {
                    id: "id",
                    label: "name",
                    api: Services.MasterProduct.index,
                },
                label: "Product",
                description: "Product category.",
                placeholder: "Product category",
            },
            {
                key: "factory_id",
                type: "combobox",
                schema: z.string().nonempty({
                    message: "Factory is required"
                }),
                source: {
                    id: "id",
                    label: "name",
                    api: Services.MasterFactory.index,
                },
                label: "Factory",
                description: "Factory source.",
                placeholder: "Factory source",
            },
            {
                key: "quantity",
                type: "number",
                schema: z.number().positive({
                    message: "Quantity must be positive.",
                }),
                label: "Code",
                description: "Input inventory's serial number.",
                placeholder: "IVT-001",
            },
            {
                key: "cmt_id",
                type: "combobox",
                schema: z.string().nonempty({
                    message: "Factory is required"
                }),
                source: {
                    id: "id",
                    label: "name",
                    api: Services.MasterCMT.index,
                },
                label: "CMT",
                description: "CMT type.",
                placeholder: "Factory source",
            },
            {
                key: "rack_id",
                type: "combobox",
                schema: z.string().nonempty({
                    message: "Rack is required"
                }),
                source: {
                    id: "id",
                    label: "name",
                    api: Services.MasterRack.index,
                },
                label: "Rack",
                description: "The rack that stores this inventory.",
                placeholder: "Rack name",
            },
            {
                key: "barcode_group",
                type: "text",
                schema: z.string().min(2, {
                    message: "Barcode group is required"
                }),
                label: "Barcode group",
                description: "The group of this batch.",
                placeholder: "BCG-001",
            }
        ]} />
}