import { KeyboardEvent, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Items } from "./items";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Services from "@/services";
import { Label } from "@/components/ui/label";
import { Barcodes } from "./barcodes";
import ModalConfirm from "@/components/custom/modal-confirm";
import { RackViewResponse } from "@/interfaces/rack";
import ModalConfirmSubmit from "./confirm-submit";
import ModalConfirmReset from "./confirm-reset";
import { MutationValidateResponse } from "@/interfaces/mutation";
import { ComboboxAutoHighlight } from "@/components/custom/combobox-autohighlight";
import { BaseResponse } from "@/interfaces/base";

export interface Item {
    cmt: string
    barcode: string
    model: string
    color: string
    size: string
    rack_id: string
    rack: {
        name: string
    }
    rec_qty: number
}

export interface Barcode {
    barcode: string
    rack_id: string
    rack: {
        name: string
    }
}

export interface DeleteRowProps {
    barcode: string
    rack_id: string
}

export default function Mutation() {

    const [rack, setRack] = useState<string>("");
    const [search, setSearch] = useState<string>("");
    const [items, setItems] = useState<Item[]>([]);
    const [barcodes, setBarcodes] = useState<Barcode[]>([]);
    const [deleteRow, setDeleteRow] = useState<DeleteRowProps>();
    const [deleteBarcodeRow, setDeleteBarcodeRow] = useState<DeleteRowProps>();
    const [loading, setLoading] = useState(false);
    const [submitConfirm, setSubmitConfirm] = useState<boolean>();
    const [resetConfirm, setResetConfirm] = useState<boolean>();

    const findProduct = async (event: KeyboardEvent<HTMLInputElement>) => {
        const [prefix, group, sequence] = splitBarcode(search);
        if (event.key === "Enter" && prefix != '' && group != '' && sequence != '') {//barcode valid harus punya prefix, group dan sequence
            switch (group) {
                case 'P'://kalau piece
                    if (barcodes.some(item => item.barcode == search)) {
                        toast.error("Barcode sudah ada!", { richColors: true })
                    } else {
                        const validation = await validateBarcode(search);
                        if (validation) {
                            validatePieceBarcode(search, rack);
                        }
                    }
                    break;
                case 'D'://kalau group ada
                    toast.error("Produk lusin harus dibuka menjadi satuan!", { richColors: true })
                    break;
                default:
                    toast.error("Barcode tidak valid!", { richColors: true })
                    break;
            }
            setSearch("");
        }
    }

    const validatePieceBarcode = async (full_barcode: string, rack_id: string) => {
        const rackName = await getRack(rack_id);
        const item = await validateBarcode(full_barcode);
        if (item && rackName) {
            const barcode: Barcode = {
                barcode: full_barcode,
                rack: {
                    name: rackName ?? ""
                },
                rack_id: rack_id
            }
            addRow(item, barcode);
        } else {
            if (!rackName) {
                toast.error("Rack tidak valid!", { richColors: true })
            }
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
            const res = await Services.TransactionMutation.validate({ barcode });
            const rackName = await getRack(rack);
            const json: MutationValidateResponse = await res.json();
            if (res.ok) {
                setLoading(false);
                const data = json.data;
                return {
                    rack_id: rack,
                    rack: {
                        name: rackName ?? ""
                    },
                    barcode: prefix,
                    cmt: data.cmt.name ?? "",
                    model: data.model.name ?? "",
                    color: data.color.name ?? "",
                    size: data.size.name ?? "",
                    rec_qty: 1
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
            const index = prev.findIndex(i => i.barcode === item.barcode && i.rack_id === item.rack_id);
            if (index !== -1) {
                return prev.map((i, idx) =>
                    idx === index
                        ? {
                            ...i,
                            rec_qty: i.rec_qty + item.rec_qty,
                        }
                        : i
                );
            }
            return [...prev, item];
        });
        setBarcodes(prev => [...prev, barcode]);
    }

    const removeRow = (deleteRow: DeleteRowProps) => {
        setItems(prev => prev.filter(item => !(item.barcode == deleteRow.barcode && item.rack_id == deleteRow.rack_id)))//kalau item yang dihapus, semua kode batang yang berkaitan juga dihapus
        setBarcodes(prev => prev.filter(item => !(item.barcode.includes(deleteRow.barcode) && item.rack_id == deleteRow.rack_id)));
    }

    const removeBarcodeRow = (deleteRow: DeleteRowProps) => {
        const [prefix, _group, _sequence] = splitBarcode(deleteRow.barcode);
        setItems(prev => {
            const index = prev.findIndex(i => i.barcode === prefix && i.rack_id == deleteRow.rack_id);
            if (index !== -1) {
                return prev.map((i, idx) =>
                    idx === index
                        ? {
                            ...i,
                            rec_qty: i.rec_qty - 1,
                        }
                        : i
                ).filter(
                    item =>
                        !(item.rec_qty === 0)
                )
            }
            return prev;
        });
        setBarcodes(prev => prev.filter(item => !(item.barcode == deleteRow.barcode && item.rack_id == deleteRow.rack_id)));
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
            const result = {
                items: Object.entries(
                    barcodes.reduce((a, { rack_id, barcode }) => {
                        (a[rack_id] ??= []).push(barcode);
                        return a;
                    }, {} as Record<string, string[]>)
                ).map(([rack_id, barcodes]) => ({ rack_id, barcodes }))
            };//mengkelompokkan rack barcodes yang flat menjadi group

            const res = await Services.TransactionMutation.store(result);
            const json: BaseResponse = await res.json();
            if (res.ok) {
                resetState();
                toast.success(json.message, { richColors: true });
            } else {
                toast.error(json.message, { richColors: true });
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message, { richColors: true })
            }
        }
    }

    const confirm = () => {
        if (barcodes.length > 0) {
            setSubmitConfirm(true);
        } else {
            toast.error("Tambahkan minimal 1 barcode yang diterima!", { richColors: true });
        }
    };

    const resetState = () => {
        setItems([]);
        setBarcodes([]);
    };

    return <div className={`flex flex-col gap-4 py-4 md:gap-6 md:py-6 h-full select-none ${loading ? 'cursor-progress' : undefined}`}>
        <ModalConfirm<DeleteRowProps> action={removeRow} id={deleteRow} setId={setDeleteRow} variant="destructive" title="Apakah anda yakin untuk menghapus barang ini?" description="Barang ini akan dibatalkan dari penerimaan." />
        <ModalConfirm<DeleteRowProps> action={removeBarcodeRow} id={deleteBarcodeRow} setId={setDeleteBarcodeRow} variant="destructive" title="Apakah anda yakin untuk menghapus barang ini?" description="Barang ini akan dibatalkan dari penerimaan." />
        <ModalConfirmReset resetConfirm={resetConfirm} setResetConfirm={setResetConfirm} onSubmit={resetState} />
        <ModalConfirmSubmit submitConfirm={submitConfirm} setSubmitConfirm={setSubmitConfirm} onSubmit={submit} />
        <div className="px-4 lg:px-6">
            <Label>Rak</Label>
            <ComboboxAutoHighlight source={Services.MasterRack.index} id="id" label="name" placeholder="Cari rak atau masukkan id barcode disini" value={rack} onValueChange={setRack} errorMessage="Rak tidak valid!" className="mt-2 mb-4" onFocus={e=>e.target.select()} />
            <Label>Barcode</Label>
            <Input onKeyDown={findProduct} value={search} disabled={!rack} placeholder={!rack ? 'Silakan tentukan rak terlebih dahulu' : "Masukkan barcode barang di sini"} onChange={e => setSearch(e.target.value)} className="mt-2 mb-4" />
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
            <Button variant="destructive" type="button" onClick={() => setResetConfirm(true)}>Atur Ulang</Button>
            <Button type="button" onClick={confirm}>Kirim</Button>
        </div>
    </div>
}
