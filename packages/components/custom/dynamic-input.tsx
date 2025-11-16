import { Input } from "@/components/ui/input";
import { ControllerRenderProps, FieldValues, Path } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";

export type InputType = "text" | "textarea" | "number" | "email" | "password" | "date" | "select" | "checkbox";

interface DynamicInputProps extends ControllerRenderProps<FieldValues, string> {
    placeholder?: string;
    type?: "text" | "textarea" | "number" | "email" | "password" | "date" | "select" | "checkbox"
}

export default function DynamicInput({ placeholder, type, ...field }: DynamicInputProps) {
    switch (type) {
        case 'text':
            return <Input placeholder={placeholder} {...field} />
        case 'textarea':
            return <Textarea placeholder={placeholder} {...field} />
    };
}