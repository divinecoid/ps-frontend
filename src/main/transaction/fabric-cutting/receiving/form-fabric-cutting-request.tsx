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
        fabric_id: z.string().nonempty({
            message: "Kain dibutuhkan.",
        }),
        quantity: z.coerce.number().min(1, { message: "Minimal 1 roll kain" }).default(0),
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
        }),
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
                for (const [variantIndex, variant] of item.variant_detail.entries()) {
                    const qty = variant.dozen_qty * 12 + variant.piece_qty;

                    // Skip validasi jika qty = 0
                    if (qty <= 0) {
                        continue;
                    }

                    const stock = item.cloth_detail.find(
                        d => d.size_id === variant.size_id
                    );

                    // Qty > 0 tetapi ukuran tidak tersedia
                    if (!stock) {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            path: [
                                index,
                                "variant_detail",
                                variantIndex,
                                "size_id",
                            ],
                            message: "Ukuran ini tidak tersedia pada kain yang dipilih.",
                        });
                        continue;
                    }

                    // Qty > 0 dan melebihi stok
                    if (qty > stock.avl_qty) {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            path: [
                                index,
                                "variant_detail",
                                variantIndex,
                                "piece_qty",
                            ],
                            message: `Jumlah melebihi stok. Maksimal ${stock.avl_qty} pcs.`,
                        });
                    }
                }
            })
        })
    }

    return <ItemForm<FabricCutting>
        id={id}
        {...props}
        services={Services.TransactionFabricCutting}
        // dummy={{ "serial_number": "0000", "fabric_detail": [{ "fabric_id": "019ee943-fc59-73a3-b88e-63aeded984d9", "quantity": 12 }, { "fabric_id": "019ee944-a881-737b-a256-e3cd1e33e68b", "quantity": 12 }], "request_detail": [{ "model_id": "019e8320-b9bb-737a-809d-5cdfc779768e", "variant_detail": [{ "size_id": "019ee93e-02d7-70fc-b7ff-3b96e4163172", "qty": 0 }, { "size_id": "019ee93e-155e-71dd-9b3d-d8cda66645b5", "qty": 5 }, { "size_id": "019ee93e-299c-70e7-a136-4e7e8574b366", "qty": 5 }, { "size_id": "019ee93e-5ba3-7011-a064-34c60876fd6a", "qty": 0 }] }, { "model_id": "019e8320-b9bc-708b-9829-2d16e8ad6c16", "variant_detail": [{ "size_id": "019ee93e-02d7-70fc-b7ff-3b96e4163172", "qty": 0 }, { "size_id": "019ee93e-155e-71dd-9b3d-d8cda66645b5", "qty": 5 }, { "size_id": "019ee93e-299c-70e7-a136-4e7e8574b366", "qty": 5 }, { "size_id": "019ee93e-5ba3-7011-a064-34c60876fd6a", "qty": 0 }, { "size_id": "019ee93e-7e8c-73d2-be1b-582e49d7a912", "qty": 0 }] }] }}
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

