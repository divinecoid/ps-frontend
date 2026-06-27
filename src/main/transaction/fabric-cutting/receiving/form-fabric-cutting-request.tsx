import ItemForm from "@/components/custom/item-form";
import { BaseForm } from "@/interfaces/base";
import Services from "@/services";
import { z } from "zod/v3";
import { FabricCutting } from "@/interfaces/fabric-cutting";
import { useParams } from "react-router-dom";
import FabricCuttingRequestDetailList from "./form-fabric-cutting-request-detail-variant-list";
import FabricCuttingRequestFabricList from "./form-fabric-cutting-request-fabric-list";
import FabricCuttingReceiveDetailList from "../receiving/form-fabric-cutting-receive-detail-variant-list";

export default function FormFabricCuttingRequest(props: BaseForm) {

    const { id } = useParams();

    const receiveVariantDetailSchema = z.object({
        size_id: z.string().nonempty({
            message: "Ukuran dibutuhkan.",
        }),
        dozen_qty: z.coerce.number().min(0).default(0),
        piece_qty: z.coerce.number().min(0).default(0),
    })
    const variantDetailSchema = z.object({
        size_id: z.string(),
        qty: z.coerce.number().min(0).default(0),
    })

    const detailSchema = {
        model_id: z.string(),
        variant_detail: z.array(variantDetailSchema)
    }

    const receiveSchema = {
        model_id: z.string().nonempty({
            message: "Model dibutuhkan.",
        }),
        cloth_id: z.string().nonempty({
            message: "Warna dibutuhkan.",
        }),
        cloth_detail: z.array(z.object({
            size_id: z.string(),
            avl_qty: z.coerce.number(),
        })).default([]),
        variant_detail: z.array(receiveVariantDetailSchema).min(1, {
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
                return acc + (item.dozen_qty * 12 + item.piece_qty)
            }, 0)
            if (totalAllPiece < 1) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Jumlah total minimal 1 piece.",
                    path: [0, "piece_qty"],
                })
            }
        })
    }

    const fabricSchema = {
        fabric_id: z.string(),
        quantity: z.coerce.number(),
    }

    const schema = {
        serial_number: z.string(),
        color_id: z.string(),
        fabric_detail: z.array(z.object(fabricSchema)),
        request_detail: z.array(z.object(detailSchema)),
        receive_detail: z.array(z.object(receiveSchema)).min(1, {
            message: "Minimal tambahkan 1 produk yang akan dijahit.",
        }).superRefine((data, ctx) => {
            const seen = new Map<string, number>()
            data.forEach((item, index) => {
                const key = `${item.model_id}::${item.cloth_id}`
                if (seen.has(key)) {
                    const firstIndex = seen.get(key)!
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "Model dan warna tidak boleh duplikat.",
                        path: [index, "cloth_id"],
                    })
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "Model dan warna tidak boleh duplikat.",
                        path: [firstIndex, "cloth_id"],
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
        services={{ ...Services.TransactionFabricCutting, update: Services.TransactionFabricCutting.setReceived }}
        onError={console.log}
        formShape={[
            {
                key: "serial_number",
                type: "text",
                schema: schema.serial_number,
                label: "Series",
                description: "Masukkan seri.",
                placeholder: "Contoh: 0001",
                disabled: true
            },
            {
                key: "fabric_detail",
                type: "custom",
                schema: schema.fabric_detail,
                disabled: true,
                custom: <FabricCuttingRequestFabricList rowKey="fabric_detail" disabled={true} />
            },
            {
                key: "request_detail",
                type: "custom",
                schema: schema.request_detail,
                disabled: true,
                custom: <FabricCuttingRequestDetailList rowKey="request_detail" disabled={true} />
            },
            {
                key: "receive_detail",
                type: "custom",
                schema: schema.receive_detail,
                custom: <FabricCuttingReceiveDetailList rowKey="receive_detail" disabled={props.disabled} />

            }
        ]} />
}

