import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import React from "react";
import { useFormContext } from "react-hook-form";
import { FormField } from "@/components/ui/form";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ReceiveLog, ReceiveLogDetail } from "@/interfaces/request";
import { formatDate } from "@/lib/format-date";
import ViewReceiveLogDetail from "./dialog-receive-log-detail-view";

export default function ReceivedLogList() {
    const form = useFormContext()
    const [viewLogDetail, setViewLogDetail] = React.useState<ReceiveLogDetail[]>();
    const [open, setOpen] = React.useState<boolean>();

    return <div className="mb-2">
        <ViewReceiveLogDetail data={viewLogDetail} open={open} setOpen={setOpen} />
        <FormField
            control={form.control}
            name="receive_log"
            render={({ field }) => (
                <div className="mb-3">
                    <Table>
                        <TableCaption>Daftar riwayat penerimaan dari penjahit.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Penerima</TableHead>
                                <TableHead>Tanggal diterima</TableHead>
                                <TableHead>Gudang</TableHead>
                                <TableHead className="w-0">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {(field.value ?? []).map((row: ReceiveLog, index: number) => (
                                <TableRow key={`${row.id}-${index}`}>
                                    <TableCell>{row.user?.name}</TableCell>
                                    <TableCell>{formatDate(row.received_date)}</TableCell>
                                    <TableCell>{row.warehouse?.name}</TableCell>
                                    <TableCell className="w-0">
                                        <Button type="button" onClick={() => { setViewLogDetail(row.details); setOpen(true) }}><Eye /></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )} />
    </div>
}