import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/components/ui/combobox"
import { BaseApiCallIndexProps } from "@/interfaces/base";
import { BaseUIEvent } from "@base-ui/react/utils/types";
import React from "react";
import { toast } from "sonner";

interface ComboboxAutohighlightProps {
    source?: BaseApiCallIndexProps;
    id: string;
    label: string;
    placeholder?: string;
    disabled?: boolean;
    value?: string;
    onValueChange: (values: string) => void;
    "aria-invalid"?: boolean;
    className?: string | undefined;
    errorMessage?: string;
    onFocus?: ((event: BaseUIEvent<React.FocusEvent<HTMLInputElement, Element>>) => void) | undefined
}

interface Options {
    value: string;
    label: string;
}

export function ComboboxAutoHighlight({ source, id, label, placeholder, disabled, value, onValueChange, className, "aria-invalid": ariaInvalid, errorMessage, onFocus }: ComboboxAutohighlightProps) {
    const [filter, setFilter] = React.useState<string>("");
    const [options, setOptions] = React.useState<Options[]>([]);

    React.useEffect(() => {
        const getData = async () => {
            try {
                const result = await source?.(1, 10, filter);
                if (result?.ok) {
                    const json = (await result.json());
                    const mapped = json.data.map((item: Record<string, string>) => ({
                        value: item[id],
                        label: item[label]
                    }))
                    setOptions(mapped);
                }
            } catch (error) {
                if (error instanceof Error) {
                    toast.error(error.message, { richColors: true })
                }
            }
        }
        getData();
    }, [source, filter]);

    const resetFilter = () => {
        const selected = options.find(o => o.value === value)
        if (selected) setFilter(selected.label)
    }

    const onKeyDown = (e: BaseUIEvent<React.KeyboardEvent<HTMLInputElement>>) => {
        if (e.key === 'Enter')
            if (options.length == 0) {
                toast.error(errorMessage, { richColors: true });
                setFilter("");
            }
    }

    return (
        <Combobox
            items={options}
            autoHighlight
            filter={() => true}
            disabled={disabled}
            value={value}
            onValueChange={(val) => {
                const selected = options.find(o => o.value === val)
                if (!selected) return;
                if (value === selected.value) {
                    setFilter("")
                    onValueChange("")
                    return;
                }
                setFilter(selected.label)
                onValueChange(selected.value)
            }}
        >
            <ComboboxInput placeholder={placeholder} onFocus={onFocus} value={filter} className={className} onChange={(e) => setFilter(e.target.value)} aria-invalid={ariaInvalid} onKeyDown={onKeyDown} onBlur={resetFilter} />
            <ComboboxContent>
                <ComboboxEmpty>No items found.</ComboboxEmpty>
                <ComboboxList>
                    {(item) => (
                        <ComboboxItem
                            key={item.value}
                            value={item.value}>
                            {item.label}
                        </ComboboxItem>
                    )}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    )
}
