import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ReactElement } from "react"

interface TooltipHoverProps {
  children?: ReactElement
  tooltip?: string
}
export function TooltipHover({ children, tooltip }: TooltipHoverProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  )
}
