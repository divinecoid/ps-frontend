import ModalItem from "@/components/custom/modal-item";
import { BaseForm } from "@/interfaces/base";
import { Inventory } from "@/interfaces/inventory";
import Services from "@/services";
import { z } from "zod/v3";

export default function ModalInventory(props: BaseForm) {
    return <ModalItem<Inventory>
        title={props.isEdit ? "Edit Inventory" : "Add Inventory"}
        description={props.isEdit ? "Edit inventory" : "Add new inventory"}
        {...props}
        formShape={[
            {
                key: "serial_number",
                type: "text",
                schema: z.string().min(2, {
                    message: "Serial number must be at least 2 characters.",
                }),
                label: "Serial number",
                description: "Input inventory's serial number.",
                placeholder: "IVT-001",
            },
            {
                key: "product_id",
                type: "combobox",
                schema: z.string().nonempty({
                    message: "Product is required",
                }),
                source: {
                    id: "id",
                    label: "sku",
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
                    message: "Factory is required",
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
                schema: z.coerce.number().positive({
                    message: "Quantity must be positive.",
                }),
                label: "Quantity",
                description: "Input inventory's quantity.",
                placeholder: "150",
            },
            {
                key: "cmt_id",
                type: "combobox",
                schema: z.string().nonempty({
                    message: "CMT is required",
                }),
                source: {
                    id: "id",
                    label: "name",
                    api: Services.MasterCMT.index,
                },
                label: "CMT",
                description: "CMT type.",
                placeholder: "CMT source",
            },
            {
                key: "rack_id",
                type: "combobox",
                schema: z.string().nonempty({
                    message: "Rack is required",
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
                    message: "Barcode group is required",
                }),
                label: "Barcode group",
                description: "The group of this batch.",
                placeholder: "BCG-001",
            },
        ]}
    />
}