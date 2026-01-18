import ItemForm from "@/components/custom/item-form";
import { BaseForm } from "@/interfaces/base";
import Services from "@/services";
import { useParams } from "react-router-dom";
import { z } from "zod/v3";
import { Request } from "@/interfaces/request";
import DetailList from "./form-request-detail-variant-list";


export default function FormRequest(props: BaseForm) {
    const { id } = useParams();

    const variantDetailSchema = z.object({
        size_id: z.string().nonempty({
            message: "Ukuran dibutuhkan.",
        }),
        dozen_qty: z.coerce.number().min(0).default(0),
        piece_qty: z.coerce.number().min(0).default(0),
    }).superRefine((data, ctx) => {
        const totalPiece = data.dozen_qty * 12 + data.piece_qty
        if (totalPiece < 1) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Jumlah total minimal 1 piece.",
                path: ["piece_qty"],
            })
        }
    })

    const detailSchema = {
        model_id: z.string().nonempty({
            message: "Model dibutuhkan.",
        }),
        color_id: z.string().nonempty({
            message: "Warna dibutuhkan.",
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
        })
    }

    const schema = {
        cmt_id: z.string().nonempty({
            message: "CMT dibutuhkan",
        }),
        color_id: z.string().nonempty({
            message: "Warna dibutuhkan.",
        }),
        request_detail: z.array(z.object(detailSchema)).min(1, {
            message: "Minimal tambahkan 1 produk yang akan dijahit.",
        }).superRefine((data, ctx) => {
            const seen = new Map<string, number>()
            data.forEach((item, index) => {
                const key = `${item.model_id}::${item.color_id}`
                if (seen.has(key)) {
                    const firstIndex = seen.get(key)!
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "Model dan warna tidak boleh duplikat.",
                        path: [index, "color_id"],
                    })
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "Model dan warna tidak boleh duplikat.",
                        path: [firstIndex, "color_id"],
                    })
                } else {
                    seen.set(key, index)
                }
            })
        })
    }

    return <ItemForm<Request>
        id={id}
        {...props}
        services={Services.TransactionRequest}
        formShape={[
            {
                key: "cmt_id",
                type: "combobox",
                schema: schema.cmt_id,
                label: "CMT",
                description: "CMT yang akan melakukan penjahitan.",
                placeholder: "CMT",
                source: {
                    id: "id",
                    label: "name",
                    api: Services.MasterCMT.index
                }
            },
            {
                key: "request_detail",
                type: "custom",
                schema: schema.request_detail,
                custom: <DetailList rowKey="request_detail" disabled={props.disabled} />
            }
        ]} >

    </ItemForm>
}