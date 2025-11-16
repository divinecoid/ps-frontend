import { Input } from "@/components/ui/input";
import { ControllerRenderProps, FieldValues, Path } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

export interface InputMeta {
    label?: string;
    description?: string;
    placeholder?: string;
    type?: React.HTMLInputTypeAttribute;
    options?: Record<string, string>;                       //radio, select
    defaultValue?: string | number | (string | number)[];   //radio, select, checkbox, slider, input, textarea
    max?: number;                                           //slider
    step?: number;                                          //slider
}
interface DynamicInputProps<T extends FieldValues> {
    field: ControllerRenderProps<T, Path<T>>;
    meta: InputMeta;
}

export default function DynamicInput<T extends FieldValues>({
    field,
    meta
}: DynamicInputProps<T>) {
    const { type, placeholder, options, defaultValue, max, step } = meta;
    switch (type) {
        case 'text':
        case 'password':
        case 'email':
        case 'search':
        case 'tel':
        case 'url':
        case 'number':
        case 'color':
        case 'file':
        case 'hidden':
            return <Input
                placeholder={placeholder}
                type={type}
                value={field.value ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
            />
        case 'range':
            return <Slider
                value={Array.isArray(field.value) ? field.value : [Number(field.value ?? defaultValue ?? 0)]}
                onValueChange={field.onChange}
                max={max}
                step={step}
            />
        case 'textarea':
            return <Textarea
                placeholder={placeholder}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref} />
        case 'checkbox':
            return <Checkbox
                checked={!!field.value}
                onCheckedChange={field.onChange} />
        case 'radio':
            return <RadioGroup
                value={field.value ?? defaultValue}
                {...field}>
                {Object.entries(options).map(([value, label]) => {
                    return <div
                        className="flex items-center gap-3"
                        key={value}>
                        <RadioGroupItem
                            value={value}
                            id={value} />
                        <Label
                            htmlFor={value}>{label}
                        </Label>
                    </div>
                })}
            </RadioGroup>
        case 'select':
            return <Select
                value={field.value ?? defaultValue}
                onValueChange={field.onChange}
                {...field}>
                <SelectTrigger>
                    <SelectValue
                        placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {Object.entries(options).map(([value, label]) => {
                        return <SelectItem
                            key={value}
                            value={value}>{label}
                        </SelectItem>
                    })}
                </SelectContent>
            </Select>
        case 'switch':
            return <div className="flex items-center space-x-2">
                <Switch
                    id={meta.label}
                    checked={!!field.value}
                    onCheckedChange={field.onChange} />
                <Label
                    htmlFor={meta.label}>
                    {meta.label}
                </Label>
            </div>
        default:
            return <div className="border-destructive rounded-md p-2 bg-destructive/20">
                <p className="text-xs text-destructive">
                    Unknown input type: {type}
                </p>
            </div>
    };
}