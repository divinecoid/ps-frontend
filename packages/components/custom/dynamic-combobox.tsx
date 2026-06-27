import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { BaseApiCallIndexProps } from "@/interfaces/base"
import { toast } from "sonner"

interface DynamicComboboxProps {
  source?: BaseApiCallIndexProps;
  id: string;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  variant?: "outline" | "link" | "default" | "destructive" | "secondary" | "ghost" | null | undefined;
  type?: 'single' | 'multi';
  value: string | number | (string | number)[];
  onValueChange: (values: string | string[]) => void;
  className?: string | undefined;
  "aria-invalid"?: boolean
  onItemChange?: (item: Record<string, unknown>) => void;
}

interface Options {
  value: string;
  label: string;
  raw: Record<string, unknown>;
}

export function DynamicCombobox({ source, id, label, type = 'single', variant = 'outline', placeholder, disabled, value, onValueChange, onItemChange, className, "aria-invalid": ariaInvalid }: DynamicComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [filter, setFilter] = React.useState<string>("");
  const [options, setOptions] = React.useState<Options[]>([]);

  const selectedValue = React.useMemo(() => {
    if (Array.isArray(value)) return null;
    return value ? String(value) : null;
  }, [value]);

  const needsInitialLabel = Boolean(
    selectedValue && !options.some(o => o.value === selectedValue)
  );

  React.useEffect(() => {
    if (!source) return;
    if (!open && !needsInitialLabel) return;

    const delay = filter ? 300 : 0;
    const timer = setTimeout(async () => {
      try {
        const result = await source(1, 10, filter);
        if (result?.ok) {
          const json = (await result.json());
          const mapped = json.data.map((item: Record<string, unknown>) => ({
            value: String(item[id]),
            label: String(item[label]),
            raw: item,
          }));
          setOptions(mapped);
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message, { richColors: true })
        }
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [source, filter, open, needsInitialLabel, id, label]);

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          variant={variant}
          role="combobox"
          aria-expanded={open}
          aria-invalid={ariaInvalid}
          disabled={disabled}
          className={cn("justify-between font-normal aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive truncate", className)}
        >
          <span className="truncate flex-1 text-left">
            {value && Array.isArray(value) && value.length > 0 ? (              // multiselect
              value.map(v => options.find(o => o.value === v)?.label).join(", ")
            ) : !Array.isArray(value) && value ? (                              // singleselect
              options.find(o => o.value === value)?.label
            ) : (
              <span className="opacity-50">{placeholder}</span>
            )}
          </span>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command shouldFilter={false}>
          <CommandInput placeholder="Telusuri..." className="h-9" value={filter} onValueChange={setFilter} />
          <CommandList>
            <CommandEmpty>Data tidak ditemukan.</CommandEmpty>
            <CommandGroup>
              {options.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={() => {
                    if (type === 'single') {
                      onValueChange(item.value);
                      onItemChange?.(item.raw);
                      setOpen(false)
                    } else {
                      const current = Array.isArray(value) ? value.map(String) : [];
                      const exists = current.includes(item.value);
                      const next = exists
                        ? current.filter(v => v !== item.value)
                        : [...current, item.value];
                      onValueChange(next);
                    }
                  }}
                >
                  {item.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      (type === "single"
                        ? value === item.value
                        : Array.isArray(value) && value.includes(item.value))
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
