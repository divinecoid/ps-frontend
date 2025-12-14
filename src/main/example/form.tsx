import ItemForm from "@/components/custom/item-form";
import OverviewPage from "@/components/custom/overview-page";
import { BaseForm } from "@/interfaces/base";
import { Rack } from "@/interfaces/rack";
import Services from "@/services";
import { useParams } from "react-router-dom";
import { z } from "zod/v3";
import { detailColumns } from "./detail-column";
import ModalRack from "./modal";
import { useState } from "react";
import DropdownRowActions from "@/components/custom/dropdown-row-actions";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import ConfirmRack from "./confirm";

export default function FormExample(props: BaseForm) {
    const param = useParams();
    const [editRow, setEditRow] = useState<number>();
    const [deleteRow, setDeleteRow] = useState<number>();
    const rack = <ItemForm
        id={Number(param)}
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
            {
                key: "date",
                type: "date",
                mode: "multiple",
                numberOfMonths: 5,
                schema: z.date(),
                label: "Rack date",
                description: "Input rack's date.",
                placeholder: "Rack date",
            },
        ]} >
        <OverviewPage
            columns={detailColumns}
            source={Services.MasterRack}
            actions={(props) => [
                <ModalRack {...props} />,
                <ModalRack {...props} isEdit id={editRow} setId={setEditRow} />,
                <ConfirmRack {...props} action={Services.MasterRack.destroy} id={deleteRow} setId={setDeleteRow} title="Are you want to delete this object?" description="This action will set this object to inactive state." />
            ]}
            rowActions={({ row }) => (
                <DropdownRowActions>
                    <DropdownMenuItem onSelect={() => setEditRow(row.id)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setDeleteRow(row.id)}>Delete</DropdownMenuItem>
                </DropdownRowActions>
            )} />
    </ItemForm>

    return rack;
}