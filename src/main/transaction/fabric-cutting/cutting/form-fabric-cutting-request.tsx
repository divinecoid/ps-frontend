import ItemForm from "@/components/custom/item-form";
import { BaseForm } from "@/interfaces/base";
import Services from "@/services";
import { z } from "zod/v3";
import { FabricCutting } from "@/interfaces/fabric-cutting";
import { useParams } from "react-router-dom";
import FabricCuttingRequestDetailList from "./form-fabric-cutting-request-detail-variant-list";
import FabricCuttingRequestFabricList from "./form-fabric-cutting-request-fabric-list";

export default function FormFabricCuttingRequest(props: BaseForm) {

    const { id } = useParams();

    const variantDetailSchema = z.object({
        size_id: z.string().nonempty({
            message: "Ukuran dibutuhkan.",
        }),
        qty: z.coerce.number().min(0).default(0),
    })

    const detailSchema = {
        model_id: z.string().nonempty({
            message: "Model dibutuhkan.",
        }),
        variant_detail: z.array(variantDetailSchema).min(1, {
            message: "Minimal tambahkan 1 varian yang akan dipotong."
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
                return acc + item.qty
            }, 0)
            if (totalAllPiece < 1) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Total semua varian minimal 1.",
                    path: [0, "qty"],
                })
            }
        })
    }

    const fabricSchema = {
        fabric_id: z.string().nonempty({
            message: "Kain dibutuhkan.",
        }),
        quantity: z.coerce.number().min(1, {message: "Minimal 1 roll kain"}).default(0),
    }

    const schema = {
        serial_number: z.string(),
        color_id: z.string().nonempty({
            message: "Warna dibutuhkan.",
        }),
        fabric_detail: z.array(z.object(fabricSchema)).min(1, {
            message: "Minimal tambahkan 1 produk yang akan dipotong."
        }).superRefine((data, ctx) => {
            const seen = new Map<string, number>();
            data.forEach((item, index) => {
                if (!item.fabric_id) return;
                const firstIndex = seen.get(item.fabric_id);
                if (firstIndex !== undefined) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "Kain tidak boleh duplikat.",
                        path: [index, "fabric_id"],
                    });
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "Kain tidak boleh duplikat.",
                        path: [firstIndex, "fabric_id"],
                    });
                    return;
                }
                seen.set(item.fabric_id, index);
            });
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
                        message: "Model tidak boleh duplikat.",
                        path: [index, "model_id"],
                    })
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "Model tidak boleh duplikat.",
                        path: [firstIndex, "model_id"],
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
        onError={console.log}
        formShape={[
            {
                key: "serial_number",
                type: "text",
                schema: schema.serial_number,
                label: "Series",
                description: "Masukkan seri.",
                placeholder: "Contoh: 0001",
            },
            {
                key: "fabric_detail",
                type: "custom",
                schema: schema.fabric_detail,
                custom: <FabricCuttingRequestFabricList rowKey="fabric_detail" disabled={props.disabled} />
            },
            {
                key: "request_detail",
                type: "custom",
                schema: schema.request_detail,
                custom: <FabricCuttingRequestDetailList rowKey="request_detail" disabled={props.disabled} />
            }
        ]} />
}

