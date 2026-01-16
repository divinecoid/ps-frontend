import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog } from "@/interfaces/base";

export default function ConfirmDetail({ index, setIndex, action, title, description, variant }: Dialog) {

    const confirm = () => {
        if (index != undefined) {
            action?.(index);
            setIndex?.(undefined);
        }
    }

    return <AlertDialog open={index != undefined ? true : false} onOpenChange={() => { setIndex?.(undefined) }}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle className={`${variant === 'destructive' ? 'text-destructive' : ''}`}>{title}</AlertDialogTitle>
                <AlertDialogDescription>
                    {description}
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Batalkan</AlertDialogCancel>
                <AlertDialogAction variant={variant} onClick={confirm}>Konfirmasi</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
}