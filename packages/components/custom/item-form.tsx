import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FieldValues, Path, SubmitErrorHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod/v3";
import { zodResolver } from "@hookform/resolvers/zod";
import DynamicInput from "@/components/custom/dynamic-input";
import { BaseApiCallProps, FormShape } from "@/interfaces/base";
import { toast } from "sonner";
import React from "react";
import generateSchema from "@/lib/generate-schema";
import { useNavigate } from "react-router-dom";
import { LoaderCircle } from "lucide-react";

interface ItemProps<T extends FieldValues> {
  id?: string;
  setId?: React.Dispatch<React.SetStateAction<string | undefined>>;
  disabled?: boolean;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  services?: BaseApiCallProps<T>;
  onError?: SubmitErrorHandler<FieldValues>;
  formShape: FormShape<T>[];
}

export default function ItemForm<T extends FieldValues>({
  id,
  disabled,
  children,
  services,
  onError,
  formShape,
}: ItemProps<T>) {
  const { schema, meta, defaultValues, api, component } =
    generateSchema<T>(formShape);
  const [loading, setLoading] = React.useState<boolean>(id ? true : false);
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });
  React.useEffect(() => {
    const viewData = async () => {
      try {
        if (id) {
          const res = await services?.show?.(id);
          const json = await res?.json();
          if (res?.ok) {
            form.reset(json.data);
          } else {
            toast.error(json.message, { richColors: true });
            navigate(-1);
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message, { richColors: true });
          navigate(-1);
        }
      } finally {
        setLoading(false);
      }
    };
    viewData();
  }, [id]);

  const submitForm = async (values: FieldValues) => {
    setLoading(true);
    try {
      const res = await (id
        ? services?.update?.(id, values as T)
        : services?.store?.(values as T));
      const json = await res?.json();
      if (res?.ok) {
        navigate(-1);
      } else {
        toast.error(String(json.message), { richColors: true });
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, { richColors: true });
      }
    } finally {
      setLoading(false);
    }
  };
  const rows = React.useMemo(() => {
    const grouped: FormShape<T>[][] = [];

    for (const field of formShape) {
      if (field.group) {
        const lastRow = grouped[grouped.length - 1];
        if (lastRow?.[0]?.group === field.group) {
          lastRow.push(field);
          continue;
        }
      }
      grouped.push([field]);
    }

    return grouped;
  }, [formShape]);

  if (loading && id) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <LoaderCircle className="h-8 w-8 animate-spin text-foreground" />
          <p className="text-sm">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submitForm, onError)}
        className={`flex flex-col flex-1 h-0 pt-5 px-1 select-none ${loading ? "cursor-progress" : undefined}`}
      >
        <div className="flex-1 overflow-y-auto">
          {rows.map((row, rowIndex) => {
            const rowClass =
              row.length > 1
                ? "grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-3"
                : undefined;
            return (
              <div key={`row-${rowIndex}`} className={rowClass}>
                {row.map((entry) => {
                  const key = entry.key;
                  const fieldMeta = meta[key];
                  const fieldSource = api[key];
                  const custom = component[key];

                  if (fieldMeta.type === "custom") {
                    return (
                      <div key={key} className="px-7 py-2">
                        {typeof custom === "function" ? custom(0) : custom}
                        <p
                          data-slot="form-message"
                          className="text-destructive text-sm"
                        >
                          {form.formState.errors[key]?.message?.toString() ??
                            form.formState.errors?.[
                              key
                            ]?.root?.message?.toString()}
                        </p>
                      </div>
                    );
                  }

                  return (
                    <FormField
                      key={key}
                      control={form.control}
                      name={key as Path<T>}
                      render={({ field, fieldState }) => (
                        <FormItem
                          className={`${fieldMeta.type === "hidden" ? "h-0" : "px-7 py-2"}`}
                        >
                          <FormLabel>{fieldMeta.label}</FormLabel>
                          <FormControl>
                            <DynamicInput
                              aria-invalid={fieldState.invalid}
                              field={field}
                              meta={fieldMeta}
                              api={fieldSource}
                              disabled={disabled || fieldMeta.disabled}
                            />
                          </FormControl>
                          <FormDescription>
                            {fieldMeta.description}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  );
                })}
              </div>
            );
          })}
          {children}
        </div>
        <div className="sticky bottom-0 border-t backdrop-blur-md bg-background/70 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end justify-end px-7 py-2">
          {disabled ? (
            <Button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                navigate(-1);
              }}
            >
              Tutup
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(-1);
                }}
              >
                Batal
              </Button>
              <Button type="submit">Simpan</Button>
            </>
          )}
        </div>
      </form>
    </Form>
  );
}
