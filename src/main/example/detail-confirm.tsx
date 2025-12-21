import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { BaseDialog } from "@/interfaces/base";

export default function ConfirmDetail({ id, setId, action, title, description, variant }: BaseDialog) {

    const confirm = () => {
        if (id != undefined) {
            action?.(id);
            setId?.(undefined);
        }
    }

    return <AlertDialog open={id != undefined ? true : false} onOpenChange={() => { setId?.(undefined) }}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle className={`${variant === 'destructive' ? 'text-destructive' : ''}`}>{title}</AlertDialogTitle>
                <AlertDialogDescription>
                    {description}
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction variant={variant} onClick={confirm}>OK</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
}