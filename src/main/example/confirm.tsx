import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { BaseDialog } from "@/interfaces/base";
import { toast } from "sonner";

export default function ConfirmRack({ id, setId, action, onSubmit, title, description }: BaseDialog) {
    const confirm = async () => {
        if (id) {
            try {
                const res = await action(id);
                if (res.ok) {
                    onSubmit();
                    setId(undefined);
                }
            } catch (error) {
                toast.error(error.message, { richColors: true })
            }
        }
    }

    return <AlertDialog open={id ? true : false} onOpenChange={() => { setId && setId(undefined) }}>
        <AlertDialogContent>
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