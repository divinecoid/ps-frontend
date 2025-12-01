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
  source: BaseApiCallIndexProps;
  id: string;
  label: string;
  placeholder?: string;
  type?: 'single' | 'multi';
  value: string | number | (string | number)[];
  onValueChange: (...event: any[]) => void;
}

interface Options {
  value: string;
  label: string;
}

export function DynamicCombobox({ source, id, label, type = 'single', placeholder, value, onValueChange }: DynamicComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [filter, setFilter] = React.useState<string>("");
  const [options, setOptions] = React.useState<Options[]>([]);

  React.useEffect(() => {
    const getData = async () => {
      try {
        const result = await source(1, 10, filter);
        if (result.ok) {
          const json = (await result.json());
          const mapped = json.data.map((item: any) => ({
            value: String(item[id]),
            label: item[label]
          }))
          setOptions(mapped);
        }
      } catch (error) {
        toast.error(error.message, { richColors: true })
      }
    }
    getData();
  }, [filter]);

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          {value && Array.isArray(value) && value.length > 0 ? (              // multiselect
            value.map(v => options.find(o => o.value === String(v))?.label).join(", ")
          ) : !Array.isArray(value) && value ? (                              // singleselect
            options.find(o => o.value === String(value))?.label
          ) : (
            <p className="opacity-50">{placeholder}</p>
          )}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command shouldFilter={false}>
          <CommandInput placeholder="Search..." className="h-9" value={filter} onValueChange={setFilter} />
          <CommandList>
            <CommandEmpty>No data found.</CommandEmpty>
            <CommandGroup>
              {options.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={() => {
                    if (type === 'single') {
                      onValueChange(Number(item.value))
                      setOpen(false)
                    } else {
                      const current = Array.isArray(value) ? value.map(String) : [];
                      const exists = current.includes(item.value);
                      const next = exists
                        ? current.filter(v => v !== item.value)
                        : [...current, item.value];
                      onValueChange(next.map(Number));
                    }
                  }}
                >
                  {item.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      (type === "single"
                        ? value === Number(item.value)
                        : Array.isArray(value) && value.includes(Number(item.value)))
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
