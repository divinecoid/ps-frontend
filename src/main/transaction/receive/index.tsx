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
    rack_id?: string
    full_barcode: string
}

export default function Receive() {

    const [search, setSearch] = useState<string>("");
    const [items, setItems] = useState<Item[]>([]);
    const [barcodes, setBarcodes] = useState<Barcode[]>([]);
    const [deleteRow, setDeleteRow] = useState<string>();
    const [deleteBarcodeRow, setDeleteBarcodeRow] = useState<string>();
    const [loading, setLoading] = useState(false);
    const [tempBarcode, setTempBarcode] = useState<Barcode>();

    const findProduct = async (event: KeyboardEvent<HTMLInputElement>) => {
        const [prefix, group, sequence] = splitBarcode(search);
        if (event.key === "Enter") {
            if (sequence == '') {
                toast.error("Barcode tidak valid!", { richColors: true })
            } else if (group !== '') {
                if (barcodes.some(item => item.barcode == `${prefix}|${group}|`)) {
                    toast.error("Barcode sudah ada!", { richColors: true })
                } else if (await validateBarcode()) {
                }
            } else if (group === '') {
                if (barcodes.some(item => item.barcode == `${prefix}|${group}|${sequence}`)) {
                    toast.error("Barcode sudah ada!", { richColors: true })
                } else if (await validateBarcode()) {
                }
            }
            setSearch("");
        }
    }
    const validateBarcode = async (): Promise<boolean> => {
        try {
            setLoading(true);
            const res = await Services.TransactionInbound.validate({ barcode: search });
            setLoading(false);
            const [prefix, group, sequence] = splitBarcode(search);
            const json: InboundValidateResponse = await res.json();
            const data = json.data;
            if (res.ok) {
                const item = { barcode: prefix, cmt: data.cmt.name, model: data.model.name, color: data.color.name, size: data.size.name, rec_dozen_qty: data.is_dozen ? 1 : 0, rec_piece_qty: data.is_dozen ? 0 : 1 };
                if (group == "") {//jika piece
                    setTempBarcode({ barcode: prefix, full_barcode: search, rack_id: "" });
                    confirmItemPiece(item);
                } else {
                    addRow(item, { barcode: group != '' ? `${prefix}|${group}|` : `${prefix}|${group}|${sequence}`, rack_id: "", full_barcode: search })
                }
                setSearch("");
                return true;
            } else {
                toast.error(json.message, { richColors: true })
                setSearch("");
                return false;
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message, { richColors: true });
            }
            setLoading(false);
            return false;
        }
    }

    const confirmItemPiece = (item: Item) => {

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
        console.log(barcode);
        // setItems(prev => prev.filter(item => item.barcode !== barcode))//TODO: kalau item yang dihapus, semua kode batang yang berkaitan juga dihapus
        // setBarcodes(prev => prev.filter(item => item.barcode !== barcode));
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

    const submit = async () => {
        try {
            const final = barcodes.map(item => item.full_barcode);
            console.log(JSON.stringify(final));

            const barcodesDozen = final.filter(item => !item.includes('||'));
            const barcodesPiece = final.filter(item => item.includes('||'));

            // Services.TransactionInbound.store({
            //     barcodes_dozen: barcodesDozen,

            // });
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message, { richColors: true })
            }
        }
    }

    return <div className={`flex flex-col gap-4 py-4 md:gap-6 md:py-6 h-full select-none ${loading ? 'cursor-progress' : undefined}`}>
        <ModalConfirm action={removeRow} id={deleteRow} setId={setDeleteRow} variant="destructive" title="Apakah anda yakin untuk menghapus barang ini?" description="Barang ini akan dibatalkan dari penerimaan." />
        <ModalConfirm action={removeBarcodeRow} id={deleteBarcodeRow} setId={setDeleteBarcodeRow} variant="destructive" title="Apakah anda yakin untuk menghapus barang ini?" description="Barang ini akan dibatalkan dari penerimaan." />
        <ModalConfirmItemPiece barcode={tempBarcode} setBarcode={setTempBarcode} onSubmit={console.log} />
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
            <Button type="button" onClick={submit}>Kirim</Button>
        </div>
    </div>
}
