import ItemForm from "@/components/custom/item-form";
import { BaseForm } from "@/interfaces/base";
import Services from "@/services";
import { useParams } from "react-router-dom";
import { z } from "zod/v3";
import DetailRow from "./detail-row";
import { Request } from "@/interfaces/request";


export default function FormExample(props: BaseForm) {
    const param = useParams();

    const variantDetailSchema = {
        dozen_qty: z.coerce.number().min(0, {
            message: "Jumlah dibutuhkan.",
        }).default(0),
        piece_qty: z.coerce.number().min(0, {
            message: "Jumlah dibutuhkan.",
        }).default(0),
    }

    const detailSchema = {
        model_id: z.string().nonempty({
            message: "Model dibutuhkan.",
        }),
        color_id: z.string().nonempty({
            message: "Warna dibutuhkan.",
        }),
        variant_detail: z.array(z.object(variantDetailSchema)).min(1, {
            message: "Minimal tambahkan 1 model yang akan dijahit."
        })
    }

    return <ItemForm<Request>
        id={String(param)}
        {...props}
        onError={console.log}
        services={Services.TransactionRequest}
        formShape={[
            {
                key: "cmt_id",
                type: "combobox",
                schema: z.coerce.number().positive({
                    message: "CMT dibutuhkan",
                }).default(-1),
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
                schema: z.array(z.object(detailSchema)).min(1, {
                    message: "Minimal tambahkan 1 model yang akan dijahit."
                }),
                custom: <DetailRow rowKey="request_detail" schema={detailSchema} variantSchema={variantDetailSchema} />
            }
        ]} >

    </ItemForm>
}