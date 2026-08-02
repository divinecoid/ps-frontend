import React from "react";
import { useFormContext } from "react-hook-form";
import { FormField } from "@/components/ui/form";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { PendingBarcode } from "@/interfaces/request";

export default function PendingBarcodeList() {
    const form = useFormContext();

    return (
        <div className="mb-2">
            <FormField
                control={form.control}
                name="pending_barcodes"
                render={({ field }) => (
                    <div className="mb-3">
                        <Table>
                            <TableCaption>Daftar barcode yang telah dibuat tetapi belum diterima.</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Barcode</TableHead>
                                    <TableHead>Tipe</TableHead>
                                    <TableHead>Model</TableHead>
                                    <TableHead>Warna</TableHead>
                                    <TableHead>Ukuran</TableHead>
                                    <TableHead className="w-0">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {(field.value ?? []).length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                                            Semua barcode telah diterima.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    (field.value ?? []).map((row: PendingBarcode, index: number) => (
                                        <TableRow key={`${row.barcode}-${index}`}>
                                            <TableCell className="font-mono">{row.barcode}</TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                                    row.type === "Dozen" 
                                                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" 
                                                        : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                                                }`}>
                                                    {row.type}
                                                </span>
                                            </TableCell>
                                            <TableCell>{row.model}</TableCell>
                                            <TableCell>{row.color}</TableCell>
                                            <TableCell>{row.size}</TableCell>
                                            <TableCell className="w-0">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(row.barcode);
                                                        toast.success("Barcode berhasil disalin", { richColors: true });
                                                    }}
                                                >
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}
            />
        </div>
    );
}
