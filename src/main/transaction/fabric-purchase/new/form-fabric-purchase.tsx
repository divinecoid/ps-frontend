import ItemForm from "@/components/custom/item-form";
import { BaseForm } from "@/interfaces/base";
import Services from "@/services";
import { useParams } from "react-router-dom";
import { z } from "zod/v3";
import DetailList from "./form-detail-list";
import RollSizeField from "./roll-size-field";

export default function FormFabricPurchase(props: BaseForm) {
  const { id } = useParams();

  const detailSchema = z
    .object({
      color_id: z.string().nonempty({ message: "Warna dibutuhkan." }),
      quantity: z.coerce
        .number()
        .int()
        .min(1, { message: "Jumlah kain minimal 1." }),
    })
    .superRefine((data, ctx) => {
      if (!data.quantity || data.quantity < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Jumlah kain harus lebih besar dari 0.",
          path: ["quantity"],
        });
      }
    });

  const schema = {
    factory_id: z.string().nonempty({ message: "Pabrik dibutuhkan." }),
    gram: z.string().nonempty({ message: "Gram dibutuhkan." }),
    // prefer roll_size_id; ukuran kept for backwards compatibility
    roll_size_id: z.string().nonempty({ message: "Ukuran dibutuhkan." }),
    ukuran: z.coerce.number().int().min(1, { message: "Ukuran dibutuhkan." }).optional(),
    details: z
      .array(detailSchema)
      .min(1, { message: "Minimal tambahkan 1 rincian pembelian." }),
  };

  return (
    <ItemForm
      id={id}
      {...props}
      services={Services.TransactionFabricPurchase}
      formShape={[
        {
          key: "factory_id",
          type: "combobox",
          schema: schema.factory_id,
          label: "Pabrik",
          description: "Pilih pabrik dari master data.",
          placeholder: "Pilih pabrik",
          source: {
            id: "id",
            label: "name",
            api: Services.MasterFactory.index,
          },
        },
        {
          key: "gram",
          type: "text",
          schema: schema.gram,
          label: "Gram",
          description: "Isi gram kain.",
          placeholder: "Contoh: 120gsm",
          group: "size",
        },
        {
          key: "ukuran",
          type: "custom",
          schema: schema.ukuran,
          label: "Ukuran",
          description: "Pilih ukuran roll dari master data.",
          placeholder: "Pilih ukuran",
          group: "size",
          custom: () => <RollSizeField disabled={props.disabled} />,
        },
        {
          key: "roll_size_id",
          type: "hidden",
          schema: schema.roll_size_id,
        },
        {
          key: "details",
          type: "custom",
          schema: schema.details,
          custom: <DetailList rowKey="details" disabled={props.disabled} />,
        },
      ]}
    />
  );
}
