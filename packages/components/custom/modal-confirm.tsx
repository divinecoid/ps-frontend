import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { BaseDialog } from "@/interfaces/base";
import { toast } from "sonner";

export default function ModalConfirm<T>({ id, setId, action, onSubmit, title, description, variant }: BaseDialog<T>) {
    const confirm = async () => {
        if (id != undefined) {
            try {
                const res = await action?.(id);
                if (res?.ok) {
                    onSubmit?.();
                    setId?.(undefined);
                }
            } catch (error) {
                if (error instanceof Error) {
                    toast.error(error.message, { richColors: true })
                }
            }
        }
    }

    return <AlertDialog open={id != undefined ? true : false} onOpenChange={() => { setId?.(undefined) }}>
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