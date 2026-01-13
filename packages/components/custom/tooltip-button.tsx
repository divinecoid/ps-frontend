import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ReactElement } from "react"

interface TooltipButtonProps {
  children?: ReactElement
  tooltip?: string
}
export function TooltipButton({ children, tooltip }: TooltipButtonProps) {
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
