import ItemForm from "@/components/custom/item-form";
import { BaseForm } from "@/interfaces/base";
import Services from "@/services";
import { useParams } from "react-router-dom";
import { z } from "zod/v3";
import { FabricCutting } from "@/interfaces/fabric-cutting";
import FabricCuttingRequestDetailList from "./form-fabric-cutting-request-detail-variant-list";

export default function FormFabricCuttingRequest(props: BaseForm) {
    const { id } = useParams();

    const variantDetailSchema = z.object({
        size_id: z.string().nonempty({
            message: "Ukuran dibutuhkan.",
        }),
        dozen_qty: z.coerce.number().min(0).default(0),
        piece_qty: z.coerce.number().min(0).default(0),
    })

    const detailSchema = {
        model_id: z.string().nonempty({
            message: "Model dibutuhkan.",
        }),
        variant_detail: z.array(variantDetailSchema).min(1, {
            message: "Minimal tambahkan 1 varian yang akan dijahit."
        }).superRefine((data, ctx) => {
            const seen = new Set<string>()
            data.forEach((item, index) => {
                if (seen.has(item.size_id)) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "Ukuran tidak boleh duplikat.",
                        path: [index, "size_id"],
                    })
                }
                seen.add(item.size_id)
            })
            const totalAllPiece = data.reduce((acc, item) => {
                return acc + (item.dozen_qty * 12) + item.piece_qty
            }, 0)
            if (totalAllPiece < 1) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Total semua varian minimal 1 piece.",
                    path: [0, "piece_qty"],
                })
            }
        })
    }

    const schema = {
        fabric_id: z.string().nonempty({
            message: "Kain dibutuhkan",
        }),
        quantity: z.coerce.number().gte(1, {
            message: "Jumlah harus lebih dari 0"
        }),
        serial_number: z.string(),
        color_id: z.string().nonempty({
            message: "Warna dibutuhkan.",
        }),
        request_detail: z.array(z.object(detailSchema)).min(1, {
            message: "Minimal tambahkan 1 produk yang akan dijahit.",
        }).superRefine((data, ctx) => {
            const seen = new Map<string, number>()
            data.forEach((item, index) => {
                const key = `${item.model_id}`
                if (seen.has(key)) {
                    const firstIndex = seen.get(key)!
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "Model dan warna tidak boleh duplikat.",
                        path: [index],
                    })
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "Model dan warna tidak boleh duplikat.",
                        path: [firstIndex],
                    })
                } else {
                    seen.set(key, index)
                }
            })
        })
    }

    return <ItemForm<FabricCutting>
        id={id}
        {...props}
        services={Services.TransactionFabricCutting}
        formShape={[
            {
                key: "fabric_id",
                type: "combobox",
                schema: schema.fabric_id,
                label: "Seri kain",
                description: "Kain yang akan dipotong.",
                placeholder: "FCT001-RED.001",
                source: {
                    id: "id",
                    label: "sequence",
                    api: props.disabled ? Services.MasterFabric.index : Services.MasterFabric.uncut
                }
            },
            {
                key: "quantity",
                type: "number",
                schema: schema.quantity,
                label: "Jumlah roll kain",
                description: "Jumlah roll kain yang akan dipotong.",
                placeholder: "Cth: 2",
                defaultValue: 0,
            },
            {
                key: "serial_number",
                type: "text",
                schema: schema.serial_number,
                label: "Series",
                description: "Masukkan seri.",
                placeholder: "Contoh: 0001",
            },
            {
                key: "request_detail",
                type: "custom",
                schema: schema.request_detail,
                custom: <FabricCuttingRequestDetailList rowKey="request_detail" disabled={props.disabled} />
            }
        ]} >

    </ItemForm>
}