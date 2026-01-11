import { format, isDate } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { DateRange, isDateRange, Mode } from "react-day-picker"
import React from "react"

interface DatePickerProps {
  placeholder?: string;
  mode?: Mode;
  value: Date | DateRange | Date[];
  disabled?: boolean;
  numberOfMonths?: number;
  onChange: (values: Date | DateRange | Date[]) => void;
}

export function DatePicker({ ...props }: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const isDateArray = (value?: Date | DateRange | Date[]): value is Date[] => {
    return Array.isArray(value) && value.every(v => v instanceof Date)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!props.value}
          className="data-[empty=true]:text-muted-foreground justify-start text-left font-normal"
        >
          <CalendarIcon />
          {props.value ?
            props.mode?.endsWith('multiple') ?
              isDateArray(props.value) &&
              `${props.value.length } day${props.value?.length > 1 ? 's' : ''} selected`
              : props.mode?.endsWith('range') ?
                isDateRange(props.value) &&
                ((props.value.from ? format(props.value.from, "PPP") : undefined)
                  + " - " +
                  (props.value.to ? format(props.value.to, "PPP") : undefined))
                : isDate(props.value) &&
                format(props.value, "PPP")
            : <span>{props.placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        {props.mode?.endsWith('multiple') ? (
          <Calendar
            mode="multiple"
            numberOfMonths={props.numberOfMonths ?? 1}
            selected={isDateArray(props.value) ? props.value : undefined}
            disabled={props.disabled}
            onSelect={value => isDateArray(value) && props.onChange(value)}
            captionLayout="dropdown" />
        ) : props.mode?.endsWith('range') ? (
          <Calendar
            mode="range"
            selected={isDateRange(props.value) ? props.value : undefined}
            numberOfMonths={props.numberOfMonths ?? 1}
            disabled={props.disabled}
            onSelect={(value) => isDateRange(value) && props.onChange(value)}
            captionLayout="dropdown" />
        ) : (
          <Calendar
            mode="single"
            numberOfMonths={props.numberOfMonths ?? 1}
            selected={isDate(props.value) ? props.value : undefined}
            disabled={props.disabled}
            onSelect={(date) => {
              if(isDate(date)) props.onChange(date);
              setOpen(false);
            }}
            captionLayout="dropdown" />
        )}
      </PopoverContent>
    </Popover>
  )
}