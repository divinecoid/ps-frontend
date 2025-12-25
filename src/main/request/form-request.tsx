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
            message: "Minimal tambahkan 1 model yang akan dijahit."
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
            message: "Minimal tambahkan 1 model yang akan dijahit."
        })
    }

    return <ItemForm<Request>
        id={Number(param)}
        {...props}
        onError={console.log}
        services={Services.Request}
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
                custom: <DetailList rowKey="request_detail" schema={detailSchema} variantSchema={variantDetailSchema} />
            }
        ]} >

    </ItemForm>
}