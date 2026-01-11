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

interface ComboboxProps {
  data: Record<string, string>[];
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
}

interface Options {
  value: string;
  label: string;
}

export function Combobox({ data, id, label, type = 'single', variant = 'outline', placeholder, disabled, value, onValueChange, className, "aria-invalid": ariaInvalid }: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [filter, setFilter] = React.useState<string>("");
  const [options, setOptions] = React.useState<Options[]>([]);

  React.useEffect(() => {
    const mapped = data.map((item: Record<string, string>) => ({
      value: item[id],
      label: item[label],
    }))
    setOptions(mapped);
  }, [data]);


  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          variant={variant}
          role="combobox"
          aria-expanded={open}
          aria-invalid={ariaInvalid}
          disabled={disabled}
          className={cn("justify-between aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive truncate", className)}
        >
          <span className="truncate flex-1 text-left">
            {value && Array.isArray(value) && value.length > 0 ? (              // multiselect
              value.map(v => options.find(o => o.value === v)?.label).join(", ")
            ) : !Array.isArray(value) && value ? (                              // singleselect
              options.find(o => o.value === value)?.label
            ) : (
              <p className="opacity-50">{placeholder}</p>
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
                      onValueChange(item.value)
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
