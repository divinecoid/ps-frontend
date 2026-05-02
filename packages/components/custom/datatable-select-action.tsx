import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { SelectActionDialog } from "@/interfaces/base";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { toast } from "sonner";
import { Button } from "../ui/button";

export default function DatatableSelectAction<T extends { id: string }>({ action, selectedRows, onSubmit, title, description, variant, trigger }: SelectActionDialog<T>) {
    const confirm = async () => {
        try {
            if (selectedRows) {
                const res = await action?.(selectedRows?.map(item => item.id))
                if (res?.ok) {
                    onSubmit?.();
                }
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message, { richColors: true })
            }
        }
    }

    return <AlertDialog>
        {(selectedRows?.length ?? 0) > 0 && (
            <AlertDialogTrigger asChild>
                <Button variant={variant}>{trigger}</Button>
            </AlertDialogTrigger>
        )}
        <AlertDialogContent className="select-none">
            <AlertDialogHeader>
                <AlertDialogTitle className={`${variant === 'destructive' ? 'text-destructive' : ''}`}>{title}</AlertDialogTitle>
                <AlertDialogDescription>
                    {description}
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction variant={variant} onClick={confirm}>OK</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
}