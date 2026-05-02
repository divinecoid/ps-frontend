import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface ResetDialog {
    resetConfirm?: boolean
    setResetConfirm?: React.Dispatch<React.SetStateAction<boolean | undefined>>
    onSubmit?: () => void
}

export default function ModalConfirmReset({ resetConfirm, setResetConfirm, onSubmit }: ResetDialog) {
    const confirm = async () => {
        if (resetConfirm != undefined) {
            onSubmit?.();
            setResetConfirm?.(undefined);
        }
    }

    return <AlertDialog open={resetConfirm != undefined ? true : false} onOpenChange={() => { setResetConfirm?.(undefined) }}>
        <AlertDialogContent className="select-none">
            <AlertDialogHeader>
                <AlertDialogTitle className={`text-destructive`}>Apakah anda yakin untuk mengatur ulang daftar penerimaan?</AlertDialogTitle>
                <AlertDialogDescription>
                    Semua barang yang ada di daftar penerimaan akan dihapus.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction variant={"destructive"} onClick={confirm}>OK</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
}