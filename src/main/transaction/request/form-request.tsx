import ItemForm from "@/components/custom/item-form";
import { BaseForm } from "@/interfaces/base";
import Services from "@/services";
import { useParams } from "react-router-dom";
import { z } from "zod/v3";
import { Request } from "@/interfaces/request";
import DetailList from "./form-request-detail-variant-list";


export default function FormRequest(props: BaseForm) {
    const param = useParams();

    const variantDetailSchema = {
        size_id: z.number().min(1, {
            message: "Ukuran dibutuhkan.",
        }).default(0),
        dozen_qty: z.coerce.number().min(1, {
            message: "Jumlah dibutuhkan.",
        }).default(0),
        piece_qty: z.coerce.number().min(1, {
            message: "Jumlah dibutuhkan.",
        }).default(0),
    }

    const detailSchema = {
        model_id: z.number().min(1, {
            message: "Model dibutuhkan.",
        }).default(0),
        color_id: z.number().min(1, {
            message: "Warna dibutuhkan.",
        }).default(0),
        variant_detail: z.array(z.object(variantDetailSchema)).min(1, {
            message: "Minimal tambahkan 1 varian yang akan dijahit."
        }).superRefine((data, ctx) => {
            const seen = new Set<number>()
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
        cmt_id: z.coerce.number().positive({
            message: "CMT dibutuhkan",
        }).default(-1),
        color_id: z.number().min(1, {
            message: "Warna dibutuhkan.",
        }).default(0),
        request_detail: z.array(z.object(detailSchema)).min(1, {
            message: "Minimal tambahkan 1 produk yang akan dijahit."
        }).superRefine((data, ctx) => {
            const seen = new Set<number>()
            data.forEach((item, index) => {
                if (seen.has(item.model_id)) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "Model tidak boleh duplikat.",
                        path: [index, "model_id"],
                    })
                }
                seen.add(item.model_id)
            })
        })
    }

    return <ItemForm<Request>
        id={Number(param)}
        {...props}
        services={Services.Request}
        onError={console.log}
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
                custom: <DetailList rowKey="request_detail" />
            }
        ]} >

    </ItemForm>
}