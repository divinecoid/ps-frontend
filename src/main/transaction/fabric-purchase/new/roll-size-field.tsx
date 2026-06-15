import React from "react";
import { FormLabel } from "@/components/ui/form";
import { DynamicCombobox } from "@/components/custom/dynamic-combobox";
import Services from "@/services";
import { useFormContext, useWatch } from "react-hook-form";
import { cn } from "@/lib/utils";

export default function RollSizeField({
  nameUkuran = "ukuran",
  nameRollSizeId = "roll_size_id",
  disabled,
}: {
  nameUkuran?: string;
  nameRollSizeId?: string;
  disabled?: boolean;
}) {
  const { setValue } = useFormContext();
  const rollSizeIdWatch = useWatch({ name: nameRollSizeId });
  const ukuranWatch = useWatch({ name: nameUkuran });
  const [options, setOptions] = React.useState<any[]>([]);

  React.useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await Services.MasterRollSize.master(
          1,
          9999,
          "",
          undefined as any,
        );
        if (res?.ok) {
          const json = await res.json();
          if (mounted) setOptions(json.data);
        }
      } catch (e) {
        // ignore
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  // determine selected id from either roll_size_id or ukuran fallback
  const selectedId = React.useMemo(() => {
    if (rollSizeIdWatch) return rollSizeIdWatch;
    if (ukuranWatch == null) return undefined;
    const found = options.find((o) => Number(o.size) === Number(ukuranWatch));
    return found?.id;
  }, [rollSizeIdWatch, ukuranWatch, options]);

  return (
    <div className="space-y-2">
      <FormLabel>Ukuran</FormLabel>
      <DynamicCombobox
        source={(page, per_page, search) =>
          Services.MasterRollSize.master(
            page,
            per_page,
            search,
            undefined as any,
          )
        }
        id="id"
        label="size"
        placeholder="Pilih ukuran roll"
        type="single"
        variant="outline"
        value={selectedId}
        onValueChange={(v) => {
          const sel = options.find((o) => o.id === v);
          if (sel) {
            setValue(nameRollSizeId, v);
            setValue(nameUkuran, String(sel.size));
          } else {
            setValue(nameRollSizeId, undefined as any);
            setValue(nameUkuran, undefined as any);
          }
        }}
        disabled={disabled}
        className={cn(
          "h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-none transition-[color,box-shadow] outline-none",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          "justify-between truncate hover:bg-transparent",
        )}
      />
    </div>
  );
}
