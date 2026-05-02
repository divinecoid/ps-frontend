import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface ModalConfirmItemProps {
    submitConfirm: boolean | undefined
    setSubmitConfirm: React.Dispatch<React.SetStateAction<boolean | undefined>>
    onSubmit: () => void
}

export default function ModalConfirmSubmit({ submitConfirm, setSubmitConfirm, onSubmit }: ModalConfirmItemProps) {

    const confirm = async () => {
        if (submitConfirm != undefined) {
            onSubmit?.();
            setSubmitConfirm?.(undefined);
        }
    }

    return <AlertDialog open={submitConfirm != undefined ? true : false} onOpenChange={() => { setSubmitConfirm?.(undefined) }}>
        <AlertDialogContent className="select-none">
            <AlertDialogHeader>
                <AlertDialogTitle>Mutasi Produk</AlertDialogTitle>
                <AlertDialogDescription>
                    Semua barang yang ada di daftar mutasi akan dipindahkan ke rak bawah.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={confirm}>Simpan</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
}