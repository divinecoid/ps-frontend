import { KeyboardEvent, useEffect, useState } from "react";
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
/**
 * FIXME: AI generated code
 */
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
    const [rackName, setRackName] = useState<string>("");
    const [search, setSearch] = useState<string>("");
    const [items, setItems] = useState<Item[]>([]);
    const [barcodes, setBarcodes] = useState<Barcode[]>([]);
    const [deleteRow, setDeleteRow] = useState<DeleteRowProps>();
    const [deleteBarcodeRow, setDeleteBarcodeRow] = useState<DeleteRowProps>();
    const [loadingCount, setLoadingCount] = useState(0);
    const [submitConfirm, setSubmitConfirm] = useState<boolean>();
    const [resetConfirm, setResetConfirm] = useState<boolean>();

    const loading = loadingCount > 0;

    const startLoading = () => setLoadingCount(c => c + 1);
    const stopLoading = () => setLoadingCount(c => Math.max(0, c - 1));

    useEffect(() => {
        if (rack) loadRack(rack);
        else setRackName("");
    }, [rack]);

    const splitBarcode = (barcode: string) => {
        const split = barcode.split("|");
        return [
            split.slice(0, 5).join("|"),
            split[5],
            split[6]
        ];
    };
    const loadRack = async (rackId: string) => {
        try {
            startLoading();
            const res = await Services.MasterRack.show(rackId);
            const json: RackViewResponse = await res.json();
            if (res.ok) {
                setRackName(json.data.name);
            } else {
                toast.error(json.message, { richColors: true });
                setRackName("");
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message, { richColors: true });
            }
        } finally {
            stopLoading();
        }
    };

    const validateBarcode = async (barcode: string): Promise<Item | undefined> => {
        const [prefix] = splitBarcode(barcode);
        try {
            startLoading();
            const res = await Services.TransactionMutation.validate({ barcode });
            const json: MutationValidateResponse = await res.json();
            if (!res.ok) {
                toast.error(json.message, { richColors: true });
                return;
            }
            const data = json.data;
            return {
                rack_id: rack,
                rack: {
                    name: rackName
                },
                barcode: prefix,
                cmt: data.cmt.name ?? "",
                model: data.model.name ?? "",
                color: data.color.name ?? "",
                size: data.size.name ?? "",
                rec_qty: 1
            };
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message, { richColors: true });
            }
        } finally {
            stopLoading();
        }
    };

    const findProduct = async (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key !== "Enter") return;

        const [, group, sequence] = splitBarcode(search);

        if (!group || !sequence) {
            toast.error("Barcode tidak valid!", { richColors: true });
            return;
        }

        if (group === "D") {
            toast.error("Produk lusin harus dibuka menjadi satuan!", { richColors: true });
            return;
        }

        if (group !== "P") {
            toast.error("Barcode tidak valid!", { richColors: true });
            return;
        }
        if (barcodes.some(item => item.barcode === search)) {
            toast.error("Barcode sudah ada!", { richColors: true });
            return;
        }

        const item = await validateBarcode(search);

        if (!item) return;

        addRow(item, {
            barcode: search,
            rack_id: rack,
            rack: {
                name: rackName
            }
        });

        setSearch("");
    };

    const addRow = (item: Item, barcode: Barcode) => {
        setItems(prev => {
            const index = prev.findIndex(i => i.barcode === item.barcode && i.rack_id === item.rack_id);
            if (index !== -1) {
                return prev.map((i, idx) =>
                    idx === index
                        ? { ...i, rec_qty: i.rec_qty + item.rec_qty }
                        : i
                );
            }
            return [...prev, item];
        });
        setBarcodes(prev => [...prev, barcode]);
    }

    const removeRow = (deleteRow: DeleteRowProps) => {
        setItems(prev => prev.filter(item => !(item.barcode === deleteRow.barcode && item.rack_id === deleteRow.rack_id)));
        setBarcodes(prev => prev.filter(item => !(item.barcode.includes(deleteRow.barcode) && item.rack_id === deleteRow.rack_id)));
    }

    const removeBarcodeRow = (deleteRow: DeleteRowProps) => {
        const [prefix] = splitBarcode(deleteRow.barcode);
        setItems(prev =>
            prev.map(item => item.barcode === prefix && item.rack_id === deleteRow.rack_id ? {
                ...item,
                rec_qty:
                    item.rec_qty - 1
            } : item).filter(
                item => item.rec_qty > 0
            )
        );
        setBarcodes(prev => prev.filter(item => !(item.barcode === deleteRow.barcode && item.rack_id === deleteRow.rack_id)));
    }

    const submit = async () => {
        try {
            startLoading();
            const result = {
                items: Object.entries(
                    barcodes.reduce((a, { rack_id, barcode }) => {
                        (a[rack_id] ??= []).push(barcode);
                        return a;
                    }, {} as Record<string, string[]>)
                ).map(([rack_id, barcodes]) => ({ rack_id, barcodes }))
            }

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
                toast.error(error.message, { richColors: true });
            }
        } finally {
            stopLoading();
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

    return <div className={`flex flex-col gap-4 py-4 md:gap-6 md:py-6 h-full select-none ${loading ? "cursor-progress" : ""}`}>
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
        <div className="select-none fixed bottom-0 right-0 w-full border-t backdrop-blur-md bg-background/70 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end px-7 py-2">
            <Button variant="destructive" type="button" onClick={() => setResetConfirm(true)}>Atur Ulang</Button>
            <Button type="button" onClick={confirm}>Kirim</Button>
        </div>
    </div>
}
