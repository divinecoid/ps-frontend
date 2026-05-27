import { Button } from "@/components/ui/button";
import { Card, CardDescription } from "@/components/ui/card";
import { Plus } from "lucide-react";
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FormDescription, FormField, FormLabel } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import ConfirmDetail from "./form-detail-confirm";
import DetailItem from "./form-detail-item";

interface DetailListProps {
  rowKey: string;
  disabled?: boolean;
}

export default function DetailList({ rowKey, disabled }: DetailListProps) {
  const [deleteIndex, setDeleteIndex] = React.useState<number | undefined>();

  const form = useFormContext();

  const { append, fields, remove } = useFieldArray({
    control: form.control,
    name: rowKey,
  });

  const handleAdd = () => {
    append({
      color_id: undefined,
      quantity: "",
      sequence: undefined,
    });
  };

  return (
    <div className="mb-2">
      <ConfirmDetail
        index={deleteIndex}
        setIndex={setDeleteIndex}
        action={remove}
        variant="destructive"
        title="Apakah anda yakin untuk menghapus ini?"
        description="Aksi ini akan menghapus rincian terpilih secara permanen!"
      />

      <FormField
        control={form.control}
        name="details"
        render={() => (
          <div className="mb-3">
            <div className="flex my-2">
              <FormLabel className="flex-1 py-3">Rincian Pembelian</FormLabel>
              {!disabled && (
                <Button type="button" variant="default" onClick={handleAdd}>
                  <Plus />
                  Tambah rincian
                </Button>
              )}
            </div>

            <Card
              className={cn(
                "shadow-none bg-secondary p-2 gap-2 grid grid-cols-1",
                (form.formState.errors[rowKey]?.message ||
                  form.formState.errors?.[rowKey]?.root?.message) &&
                  "border-destructive bg-destructive/10",
              )}
            >
              {fields.length === 0 && (
                <CardDescription className="text-center h-full m-4">
                  Daftar pembelian Anda masih kosong, silahkan tambah rincian.
                </CardDescription>
              )}

              {fields.map((row, index) => (
                <DetailItem
                  key={row.id}
                  form={form}
                  index={index}
                  parentKey={rowKey}
                  handleDelete={setDeleteIndex}
                  disabled={disabled}
                />
              ))}
            </Card>
          </div>
        )}
      />
    </div>
  );
}
