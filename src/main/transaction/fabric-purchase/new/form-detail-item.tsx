import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DynamicCombobox } from "@/components/custom/dynamic-combobox";
import { Button } from "@/components/ui/button";
import { TooltipHover } from "@/components/custom/tooltip-hover";
import { Trash } from "lucide-react";
import Services from "@/services";
import { UseFormReturn, FieldValues } from "react-hook-form";
import { Input } from "@/components/ui/input";

interface DetailItemProps<T> {
  form: UseFormReturn<FieldValues, T, FieldValues>;
  index: number;
  parentKey: string;
  disabled?: boolean;
  handleDelete: (index: number) => void;
}

export default function DetailItem<T>({
  form,
  index,
  parentKey,
  disabled,
  handleDelete,
}: DetailItemProps<T>) {
  const rowKey = `${parentKey}.${index}`;
  const sequence = form.watch(`${rowKey}.sequence`);
  const colorName = form.watch(`${rowKey}.color.name`);

  return (
    <Card className="p-4 rounded-lg h-min @container">
      <CardHeader className="p-0">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
          <div className="grid gap-3 sm:grid-cols-2">
            {disabled ? (
              <div className="min-w-0 space-y-2">
                <FormLabel>Warna</FormLabel>
                <div className="rounded-md border bg-muted/20 px-3 py-2 text-sm">
                  {colorName || "-"}
                </div>
              </div>
            ) : (
              <FormField
                control={form.control}
                name={`${rowKey}.color_id`}
                render={({ field }) => (
                  <FormItem className="min-w-0">
                    <FormLabel>Warna</FormLabel>
                    <FormControl>
                      <DynamicCombobox
                        id="id"
                        label="name"
                        placeholder="Pilih warna"
                        type="single"
                        source={Services.MasterColor.index}
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={disabled}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name={`${rowKey}.quantity`}
              render={({ field }) => (
                <FormItem className="min-w-0">
                  <FormLabel>Jumlah</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="0"
                      type="number"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      disabled={disabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {sequence && (
              <div className="sm:col-span-2 rounded-md border bg-muted/20 px-3 py-2 text-sm">
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Sequence
                </div>
                <div className="mt-1 font-mono text-foreground break-all">
                  {sequence}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-start justify-end gap-2 lg:pt-7">
            {!disabled && (
              <TooltipHover tooltip="Hapus">
                <Button
                  tabIndex={-1}
                  variant="destructive"
                  size="icon"
                  type="button"
                  onClick={() => handleDelete(index)}
                >
                  <Trash />
                </Button>
              </TooltipHover>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0" />
    </Card>
  );
}
