import { KeyboardEvent, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Items } from "./items";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Services from "@/services";
import { Label } from "@/components/ui/label";
import { Barcodes } from "./barcodes";
import { InboundValidateResponse } from "@/interfaces/inbound";
import ModalConfirm from "@/components/custom/modal-confirm";
import ModalConfirmItemPiece from "./confirm-item-piece";
import { RackViewResponse } from "@/interfaces/rack";
import ModalConfirmSubmit from "./confirm-submit";

export interface Item {
    cmt: string
    barcode: string
    model: string
    color: string
    size: string
    rec_dozen_qty: number
    rec_piece_qty: number
}

export interface Barcode {
    barcode: string
    rack_id: string
    rack: {
        name: string
    }
    full_barcode: string
}

export default function Receive() {

    const [search, setSearch] = useState<string>("");
    const [items, setItems] = useState<Item[]>([]);
    const [barcodes, setBarcodes] = useState<Barcode[]>([]);
    const [deleteRow, setDeleteRow] = useState<string>();
    const [deleteBarcodeRow, setDeleteBarcodeRow] = useState<string>();
    const [loading, setLoading] = useState(false);
    const [barcodeConfirm, setBarcodeConfirm] = useState<string>();
    const [submitConfirm, setSubmitConfirm] = useState<boolean>();

    const findProduct = async (event: KeyboardEvent<HTMLInputElement>) => {
        const [prefix, group, sequence] = splitBarcode(search);
        if (event.key === "Enter" && prefix != '' && sequence != '') {//barcode valid harus punya prefix dan sequence, sedangkan group boleh ada, boleh tidak
            switch (group) {
                case ''://kalau group tidak ada
                    if (barcodes.some(item => item.barcode == `${prefix}||${sequence}`)) {
                        toast.error("Barcode sudah ada!", { richColors: true })
                    } else {
                        setBarcodeConfirm(search);
                    }
                    break;
                default://kalau group ada
                    if (barcodes.some(item => item.barcode == `${prefix}|${group}|`)) {
                        toast.error("Barcode sudah ada!", { richColors: true })
                    } else {
                        await validateDozenBarcode(search);
                    }
                    break;
            }
            setSearch("");
        }
    }

    const validateDozenBarcode = async (full_barcode: string) => {
        const [prefix, group, _sequence] = splitBarcode(full_barcode);
        const item = await validateBarcode(full_barcode);
        if (item) {
            const barcode: Barcode = {
                barcode: `${prefix}|${group}|`,
                full_barcode: full_barcode,
                rack: {
                    name: ""
                },
                rack_id: ""
            }
            addRow(item, barcode);
        }
    }

    const validatePieceBarcode = async (full_barcode: string, rack_id: string) => {
        const [prefix, _group, sequence] = splitBarcode(full_barcode);
        const rackName = await getRack(rack_id);
        const item = await validateBarcode(full_barcode);
        if (item) {
            const barcode: Barcode = {
                barcode: `${prefix}||${sequence}`,
                full_barcode: full_barcode,
                rack: {
                    name: rackName ?? ""
                },
                rack_id: rack_id
            }
            addRow(item, barcode);
        }
    }

    const getRack = async (rack_id: string): Promise<string | undefined> => {
        try {
            setLoading(true);
            const res = await Services.MasterRack.show(rack_id);
            const json: RackViewResponse = await res.json();
            if (res.ok) {
                setLoading(false);
                const data = json.data;
                return data.name;
            } else {
                toast.error(json.message, { richColors: true })
            }
            setLoading(false);
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message, { richColors: true });
            }
            setLoading(false);

        }
    }

    const validateBarcode = async (barcode: string): Promise<Item | undefined> => {
        const [prefix, _group, _sequence] = splitBarcode(barcode);
        try {
            setLoading(true);
            const res = await Services.TransactionInbound.validate({ barcode: barcode });
            const json: InboundValidateResponse = await res.json();
            if (res.ok) {
                setLoading(false);
                const data = json.data;
                return {
                    barcode: prefix,
                    cmt: data.cmt.name ?? "",
                    model: data.model.name ?? "",
                    color: data.color.name ?? "",
                    size: data.size.name ?? "",
                    rec_dozen_qty: data.is_dozen ? 1 : 0,
                    rec_piece_qty: data.is_dozen ? 0 : 1
                };
            } else {
                toast.error(json.message, { richColors: true })
            }
            setLoading(false);
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message, { richColors: true });
            }
            setLoading(false);
        }
    }

    const addRow = (item: Item, barcode: Barcode) => {
        setItems(prev => {
            const index = prev.findIndex(i => i.barcode === item.barcode);
            if (index !== -1) {
                return prev.map((i, idx) =>
                    idx === index
                        ? {
                            ...i,
                            rec_dozen_qty: i.rec_dozen_qty + item.rec_dozen_qty,
                            rec_piece_qty: i.rec_piece_qty + item.rec_piece_qty,
                        }
                        : i
                );
            }
            return [...prev, item];
        });
        setBarcodes(prev => [...prev, barcode]);
    }

    const removeRow = (barcode: string) => {
        setItems(prev => prev.filter(item => item.barcode !== barcode))//kalau item yang dihapus, semua kode batang yang berkaitan juga dihapus
        setBarcodes(prev => prev.filter(item => !item.barcode.includes(barcode)));
    }

    const removeBarcodeRow = (barcode: string) => {
        const [prefix, group, _sequence] = splitBarcode(barcode);
        setItems(prev => {
            const index = prev.findIndex(i => i.barcode === prefix);
            if (index !== -1) {
                return prev.map((i, idx) =>
                    idx === index
                        ? {
                            ...i,
                            rec_dozen_qty: i.rec_dozen_qty - (group === '' ? 0 : 1),
                            rec_piece_qty: i.rec_piece_qty - (group === '' ? 1 : 0),
                        }
                        : i
                ).filter(
                    item =>
                        !(item.rec_dozen_qty === 0 && item.rec_piece_qty === 0)
                )
            }
            return prev;
        });
        setBarcodes(prev => prev.filter(item => item.barcode !== barcode));
    }

    const splitBarcode = (barcode: string) => {
        const split = barcode.split("|");
        const prefix = split.slice(0, 5).join("|");
        const group = split[5];
        const sequence = split[6];
        return [prefix, group, sequence];
    }

    const submit = async (warehouse_id: string, notes: string) => {
        try {
            const final = barcodes.map(item => ({ barcode: item.full_barcode, rack_id: item.rack_id }));
            const barcodesDozen = final.filter(item => !item.barcode.includes('||')).map(item => item.barcode);
            const barcodesPiece = final.filter(item => item.barcode.includes('||'));

            await Services.TransactionInbound.store({
                barcodes_dozen: barcodesDozen,
                barcodes_piece: barcodesPiece,
                warehouse_id: warehouse_id,
                notes: notes
            });
            const result = {
                barcodes_dozen: barcodesDozen,
                barcodes_piece: barcodesPiece
            }
            // console.log((result))
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message, { richColors: true })
            }
        }
    }

    const confirm = () => {
        barcodes.length > 0 ?
            setSubmitConfirm(true) :
            toast.error("Tambahkan minimal 1 barcode yang diterima!", { richColors: true })
    }

    return <div className={`flex flex-col gap-4 py-4 md:gap-6 md:py-6 h-full select-none ${loading ? 'cursor-progress' : undefined}`}>
        <ModalConfirm action={removeRow} id={deleteRow} setId={setDeleteRow} variant="destructive" title="Apakah anda yakin untuk menghapus barang ini?" description="Barang ini akan dibatalkan dari penerimaan." />
        <ModalConfirm action={removeBarcodeRow} id={deleteBarcodeRow} setId={setDeleteBarcodeRow} variant="destructive" title="Apakah anda yakin untuk menghapus barang ini?" description="Barang ini akan dibatalkan dari penerimaan." />
        <ModalConfirmItemPiece barcode={barcodeConfirm} setBarcode={setBarcodeConfirm} onSubmit={validatePieceBarcode} />
        <ModalConfirmSubmit submitConfirm={submitConfirm} setSubmitConfirm={setSubmitConfirm} onSubmit={submit} />
        <div className="px-4 lg:px-6">
            <Label>Barcode</Label>
            <Input onKeyDown={findProduct} value={search} onChange={e => setSearch(e.target.value)} className="mt-2 mb-4" />
            <Tabs defaultValue="items">
                <TabsList>
                    <TabsTrigger value="items">Barang diterima</TabsTrigger>
                    <TabsTrigger value="barcodes">Kode batang</TabsTrigger>
                </TabsList>
                <TabsContent value="items">
                    <Items rows={items} removeRow={setDeleteRow} />
                </TabsContent>
                <TabsContent value="barcodes">
                    <Barcodes rows={barcodes} removeRow={setDeleteBarcodeRow} />
                </TabsContent>
            </Tabs>
        </div>
        <div className="select-none fixed bottom-0 right-0 w-full border-t backdrop-blur-md bg-background/70 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end justify-end px-7 py-2">
            <Button variant="destructive" type="button" onClick={(e) => { e.preventDefault(); }}>Atur Ulang</Button>
            <Button type="button" onClick={confirm}>Kirim</Button>
        </div>
    </div>
}
