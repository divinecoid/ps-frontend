import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export function EmptyPage() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>404 - Not Found</EmptyTitle>
        <EmptyDescription>
          The page you&apos;re looking for doesn&apos;t exist.
        </EmptyDescription>
        <Button><Link to="/home">Go Home</Link></Button>
      </EmptyHeader>
      <EmptyContent>
        <EmptyDescription>
          Need help? <Link to="#" onClick={() =>
            toast("Not implemented", {
              description: "Will be implemented soon!",
              action: {
                label: "Got it",
                onClick: undefined,
              },
            })}>Contact support</Link>
        </EmptyDescription>
      </EmptyContent>
    </Empty>
  )
}
