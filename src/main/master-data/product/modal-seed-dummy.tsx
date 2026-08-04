import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Database } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod/v3";
import { zodResolver } from "@hookform/resolvers/zod";
import DynamicInput from "@/components/custom/dynamic-input";
import Services from "@/services";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

const schema = z.object({
  cmt_id: z.string().nonempty("CMT dibutuhkan."),
  model_id: z.string().nonempty("Model dibutuhkan."),
  color_id: z.string().nonempty("Warna dibutuhkan."),
  size_id: z.string().nonempty("Ukuran dibutuhkan."),
  rack_id: z.string().optional(),
  type: z.enum(["D", "P"], { required_error: "Tipe dibutuhkan." }),
  number: z.coerce.number().min(1, "Nomor urut minimal 1."),
  qty: z.coerce.number().min(1, "Jumlah minimal 1.").max(100, "Maksimal 100."),
});

interface ModalSeedDummyProps {
  onSubmit?: () => void;
}

export default function ModalSeedDummy({ onSubmit }: ModalSeedDummyProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      cmt_id: "",
      model_id: "",
      color_id: "",
      size_id: "",
      rack_id: "",
      type: "P",
      number: 1,
      qty: 1,
    },
  });

  const submitForm = async (values: any) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        rack_id: values.rack_id || null,
      };
      const res = await Services.MasterProduct.seedDummy(payload);
      const json = await res?.json();
      if (res?.ok) {
        toast.success(json.message || "Berhasil menginput stok lama!", { richColors: true });
        setOpen(false);
        onSubmit?.();
      } else {
        toast.error(String(json.message || "Gagal menginput stok lama!"), { richColors: true });
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, { richColors: true });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (isOpen) {
          form.reset({
            cmt_id: "",
            model_id: "",
            color_id: "",
            size_id: "",
            rack_id: "",
            type: "P",
            number: 1,
            qty: 1,
          });
        }
      }}
    >
      <DialogTrigger asChild className="select-none">
        <Button variant="outline" className="flex items-center gap-2">
          <Database className="h-4 w-4" /> Input Stok Lama
        </Button>
      </DialogTrigger>
      <DialogContent className={`flex flex-col max-h-[90vh] p-0 select-none ${loading ? 'cursor-progress' : ''}`}>
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Input Stok Lama</DialogTitle>
          <DialogDescription>
            Generate barcode produk untuk input stok lama secara massal.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submitForm)} className="flex flex-col flex-1 h-0">
            <ScrollArea className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="cmt_id"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>CMT</FormLabel>
                      <FormControl>
                        <DynamicInput
                          aria-invalid={fieldState.invalid}
                          field={field as any}
                          meta={{
                            type: "combobox",
                            placeholder: "Pilih CMT",
                            source: { id: "id", label: "name" },
                          }}
                          api={Services.MasterCMT.index}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="model_id"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Model</FormLabel>
                      <FormControl>
                        <DynamicInput
                          aria-invalid={fieldState.invalid}
                          field={field as any}
                          meta={{
                            type: "combobox",
                            placeholder: "Pilih Model",
                            source: { id: "id", label: "name" },
                          }}
                          api={Services.MasterProductModel.index}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="color_id"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Warna</FormLabel>
                      <FormControl>
                        <DynamicInput
                          aria-invalid={fieldState.invalid}
                          field={field as any}
                          meta={{
                            type: "combobox",
                            placeholder: "Pilih Warna",
                            source: { id: "id", label: "name" },
                          }}
                          api={Services.MasterColor.index}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="size_id"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Ukuran</FormLabel>
                      <FormControl>
                        <DynamicInput
                          aria-invalid={fieldState.invalid}
                          field={field as any}
                          meta={{
                            type: "combobox",
                            placeholder: "Pilih Ukuran",
                            source: { id: "id", label: "name" },
                          }}
                          api={Services.MasterSize.index}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rack_id"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Rak (Opsional)</FormLabel>
                      <FormControl>
                        <DynamicInput
                          aria-invalid={fieldState.invalid}
                          field={field as any}
                          meta={{
                            type: "combobox",
                            placeholder: "Pilih Rak",
                            source: { id: "id", label: "name" },
                          }}
                          api={Services.MasterRack.index}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>Tipe Seri</FormLabel>
                        <FormControl>
                          <DynamicInput
                            aria-invalid={fieldState.invalid}
                            field={field as any}
                            meta={{
                              type: "select",
                              placeholder: "Pilih Tipe",
                              options: {
                                P: "Piece (P)",
                                D: "Dozen (D)",
                              },
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="number"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>Seq. Mulai</FormLabel>
                        <FormControl>
                          <DynamicInput
                            aria-invalid={fieldState.invalid}
                            field={field as any}
                            meta={{
                              type: "number",
                              placeholder: "1",
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="qty"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>Jumlah (Qty)</FormLabel>
                        <FormControl>
                          <DynamicInput
                            aria-invalid={fieldState.invalid}
                            field={field as any}
                            meta={{
                              type: "number",
                              placeholder: "1",
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </ScrollArea>
            <DialogFooter className="sm:justify-end px-6 py-4 bg-muted/30 border-t">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Batal
                </Button>
              </DialogClose>
              <Button type="submit" disabled={loading}>
                {loading ? "Menyimpan..." : "Generate"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
