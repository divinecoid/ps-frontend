import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { BaseDialog } from "@/interfaces/base";
import { toast } from "sonner";

export default function ModalConfirm({ id, setId, action, onSubmit, title, description }: BaseDialog) {
    const confirm = async () => {
        if (id) {
            try {
                const res = await action?.(id);
                if (res?.ok) {
                    onSubmit();
                    setId?.(undefined);
                }
            } catch (error) {
                if (error instanceof Error) {
                    toast.error(error.message, { richColors: true })
                }
            }
        }
    }

    return <AlertDialog open={id ? true : false} onOpenChange={() => { setId?.(undefined) }}>
        <AlertDialogContent className="select-none">
            <AlertDialogHeader>
                <AlertDialogTitle>{title}</AlertDialogTitle>
                <AlertDialogDescription>
                    {description}
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={confirm}>OK</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
}