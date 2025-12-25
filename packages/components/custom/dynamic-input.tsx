import { Input } from "@/components/ui/input";
import { ControllerRenderProps, FieldValues, Path } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { DynamicCombobox } from "./dynamic-combobox";
import { BaseApiCallIndexProps } from "@/interfaces/base";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/custom/date-picker";
import { Mode } from "react-day-picker";

export type InputTypes = React.HTMLInputTypeAttribute | "combobox" | "multi-combobox" | "switch" | "textarea" | "custom";

export interface InputMeta {
    label?: string;
    description?: string;
    placeholder?: string;
    type?: InputTypes;
    mode?: Mode;
    numberOfMonths?: number;
    passwordEdit?: boolean;
    options?: Record<string, string>;                       //radio, select
    defaultValue?: string | number | (string | number)[];   //radio, select, checkbox, slider, input, textarea
    max?: number;                                           //slider
    step?: number;                                          //slider
    source?: {
        id: string;
        label: string;
    }
}
interface DynamicInputProps<T extends FieldValues> {
    field: ControllerRenderProps<T, Path<T>>;
    meta: InputMeta;
    api?: BaseApiCallIndexProps | null;
    "aria-invalid"?: boolean
}

export default function DynamicInput<T extends FieldValues>({
    field,
    meta,
    api,
    "aria-invalid": ariaInvalid
}: DynamicInputProps<T>) {
    const { type, placeholder, options, defaultValue, max, step, source, passwordEdit, mode, numberOfMonths } = meta;
    const [edit, setEdit] = useState(false);
    switch (type) {
        case 'text':
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
        case 'password':
            return <div className="flex gap-3">
                {(edit || !passwordEdit) && (
                    <Input
                        className="flex-1"
                        placeholder={placeholder}
                        type={type}
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                    />
                )}
                {passwordEdit && (
                    <Button type="button"
                        variant={edit ? 'default' : 'secondary'}
                        onClick={() => { setEdit(!edit); field.onChange(undefined) }}>
                        {edit ? 'Cancel' : 'Update Password'}
                    </Button>
                )}
            </div>
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
        case 'combobox':
        case 'multi-combobox':
            return api != undefined && source != undefined ? <DynamicCombobox
                aria-invalid={ariaInvalid}
                id={source.id}
                label={source.label}
                placeholder={placeholder}
                type={type == "multi-combobox" ? "multi" : "single"}
                source={api}
                value={field.value}
                onValueChange={field.onChange} /> :
                <div className="border-destructive rounded-md p-2 bg-destructive/20">
                    <p className="text-xs text-destructive">
                        Dynamic Combobox needs API as options source: {type}
                    </p>
                </div>
        case 'radio':
            return <RadioGroup
                value={String(field.value ?? defaultValue ?? "")}
                onValueChange={field.onChange}>
                {options && Object.entries(options).map(([value, label]) => {
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
                value={String(field.value ?? defaultValue ?? "")}
                onValueChange={field.onChange}
                name={field.name}
            >
                <SelectTrigger>
                    <SelectValue
                        placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options && Object.entries(options).map(([value, label]) => {
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
        case 'date':
            return <DatePicker
                placeholder={placeholder}
                value={field.value}
                onChange={field.onChange}
                numberOfMonths={numberOfMonths}
                mode={mode} />
        case 'custom':
            return undefined;
        default:
            return <div className="border-destructive rounded-md p-2 bg-destructive/20">
                <p className="text-xs text-destructive">
                    Unknown input type: {type}
                </p>
            </div>
    };
}