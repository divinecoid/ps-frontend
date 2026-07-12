import { KeyboardEvent, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Items } from "./items";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Services from "@/services";
import { Label } from "@/components/ui/label";
import { Barcodes } from "./barcodes";
import { ManualOutboundValidateBarcodeResponse } from "@/interfaces/manual-outbound";
import { BaseResponse } from "@/interfaces/base";
import ModalConfirmReset from "./confirm-reset";
import ModalConfirmSubmit from "./confirm-submit";
import ModalConfirm from "@/components/custom/modal-confirm";
import { useAcm } from "@/provider/acm-provider";
import OverviewPage from "@/components/custom/overview-page";
import { TooltipHover } from "@/components/custom/tooltip-hover";
import { Eye, ArrowLeft, Plus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/format-date";

// Represents one unique product variant in the summary table
export interface Item {
    key: string    // model_id|color_id|size_id — used for grouping/removal
    model: string
    color: string
    size: string
    qty: number
}

// Represents a single scanned barcode
export interface ScannedBarcode {
    barcode: string
    model: string
    color: string
    size: string
    rack: string | null
    // for grouping
    model_id: string
    color_id: string
    size_id: string
}

export default function OutboundManual() {
    const [view, setView] = useState<"scan" | "list" | "detail">("scan");
    const [search, setSearch] = useState<string>("");
    const [items, setItems] = useState<Item[]>([]);
    const [barcodes, setBarcodes] = useState<ScannedBarcode[]>([]);
    const [loading, setLoading] = useState(false);
    const [deleteItemKey, setDeleteItemKey] = useState<string>();
    const [deleteBarcodeKey, setDeleteBarcodeKey] = useState<string>();
    const [submitConfirm, setSubmitConfirm] = useState<boolean | undefined>();
    const [resetConfirm, setResetConfirm] = useState<boolean | undefined>();
    const [outboundDetail, setOutboundDetail] = useState<any>();
    const { canCreate } = useAcm("outbound_manual");

    const handleScan = async (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key !== "Enter") return;
        const barcode = search.trim();
        if (!barcode) return;

        // Client-side duplicate check
        if (barcodes.some((b) => b.barcode === barcode)) {
            toast.error("Barcode sudah di-scan!", { richColors: true });
            setSearch("");
            return;
        }

        await validateBarcode(barcode);
        setSearch("");
    };

    const validateBarcode = async (barcode: string) => {
        try {
            setLoading(true);
            const res = await Services.TransactionManualOutbound.validateBarcode({ barcode });
            const json: ManualOutboundValidateBarcodeResponse = await res.json();
            if (res.ok) {
                const product = json.data.product;
                const scanned: ScannedBarcode = {
                    barcode,
                    model: product.model?.name ?? "-",
                    color: product.color?.name ?? "-",
                    size: product.size?.name ?? "-",
                    rack: product.rack ? `${product.rack.code} - ${product.rack.name}` : null,
                    model_id: product.model?.id ?? "",
                    color_id: product.color?.id ?? "",
                    size_id: product.size?.id ?? "",
                };
                addBarcode(scanned);
                toast.success(`Barcode valid: ${product.model?.name ?? ""} ${product.color?.name ?? ""} ${product.size?.name ?? ""}`, { richColors: true });
            } else {
                toast.error(json.message, { richColors: true });
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message, { richColors: true });
            }
        } finally {
            setLoading(false);
        }
    };

    const addBarcode = (scanned: ScannedBarcode) => {
        setBarcodes((prev) => [...prev, scanned]);

        // Update summary items
        const key = `${scanned.model_id}|${scanned.color_id}|${scanned.size_id}`;
        setItems((prev) => {
            const existing = prev.findIndex((i) => i.key === key);
            if (existing !== -1) {
                return prev.map((item, idx) =>
                    idx === existing ? { ...item, qty: item.qty + 1 } : item
                );
            }
            return [...prev, {
                key,
                model: scanned.model,
                color: scanned.color,
                size: scanned.size,
                qty: 1,
            }];
        });
    };

    /** Remove all barcodes belonging to a model|color|size group */
    const removeItem = (key: string) => {
        setBarcodes((prev) => prev.filter((b) => `${b.model_id}|${b.color_id}|${b.size_id}` !== key));
        setItems((prev) => prev.filter((i) => i.key !== key));
    };

    /** Remove a single barcode */
    const removeBarcode = (barcode: string) => {
        const target = barcodes.find((b) => b.barcode === barcode);
        if (!target) return;
        const key = `${target.model_id}|${target.color_id}|${target.size_id}`;
        setBarcodes((prev) => prev.filter((b) => b.barcode !== barcode));
        setItems((prev) =>
            prev
                .map((item) => item.key === key ? { ...item, qty: item.qty - 1 } : item)
                .filter((item) => item.qty > 0)
        );
    };

    const resetState = () => {
        setItems([]);
        setBarcodes([]);
    };

    const handleConfirm = () => {
        if (barcodes.length === 0) {
            toast.error("Tambahkan minimal 1 barcode terlebih dahulu!", { richColors: true });
            return;
        }
        setSubmitConfirm(true);
    };

    const submit = async (marketplace_id: string | undefined, notes: string | undefined) => {
        try {
            setLoading(true);
            const res = await Services.TransactionManualOutbound.submit({
                barcodes: barcodes.map((b) => b.barcode),
                ...(marketplace_id ? { marketplace_id } : {}),
                ...(notes ? { notes } : {}),
            });
            const json: BaseResponse = await res.json();
            if (res.ok) {
                resetState();
                toast.success(json.message, { richColors: true });
                setView("list");
            } else {
                toast.error(json.message, { richColors: true });
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message, { richColors: true });
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchDetail = async (id: string) => {
        try {
            setLoading(true);
            const res = await Services.TransactionManualOutbound.show(id);
            const json = await res.json();
            if (res.ok) {
                setOutboundDetail(json.data);
                setView("detail");
            } else {
                toast.error(json.message, { richColors: true });
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message, { richColors: true });
            }
        } finally {
            setLoading(false);
        }
    };

    const listColumns = [
        {
            accessorKey: "outbound_date",
            header: "Tanggal Outbound",
            enableSorting: true,
            cell: ({ row }: any) => {
                return row.original.outbound_date
                    ? formatDate(new Date(row.original.outbound_date))
                    : "-";
            },
        },
        {
            accessorKey: "marketplace.name",
            header: "Marketplace",
            enableSorting: true,
            cell: ({ row }: any) => row.original.marketplace?.name ?? "Tanpa Marketplace",
        },
        {
            accessorKey: "user.name",
            header: "Petugas",
            enableSorting: true,
        },
        {
            accessorKey: "total_items",
            header: "Jumlah Barang",
            enableSorting: true,
        },
        {
            accessorKey: "notes",
            header: "Catatan",
            enableSorting: true,
        },
    ];

    return (
        <div className={`flex flex-col gap-4 py-4 md:gap-6 md:py-6 h-full select-none ${loading ? "cursor-progress" : ""}`}>
            {/* Confirm Remove Item Group */}
            <ModalConfirm
                action={removeItem}
                id={deleteItemKey}
                setId={setDeleteItemKey}
                variant="destructive"
                title="Hapus semua barcode barang ini?"
                description="Semua barcode untuk model/warna/ukuran ini akan dihapus dari daftar."
            />

            {/* Confirm Remove Single Barcode */}
            <ModalConfirm
                action={removeBarcode}
                id={deleteBarcodeKey}
                setId={setDeleteBarcodeKey}
                variant="destructive"
                title="Hapus barcode ini?"
                description="Barcode ini akan dihapus dari daftar outbound."
            />

            {/* Reset Confirm */}
            <ModalConfirmReset
                resetConfirm={resetConfirm}
                setResetConfirm={setResetConfirm}
                onSubmit={resetState}
            />

            {/* Submit Confirm */}
            <ModalConfirmSubmit
                submitConfirm={submitConfirm}
                setSubmitConfirm={setSubmitConfirm}
                barcodes={barcodes}
                onSubmit={submit}
            />

            {/* Header / Navigation Topbar */}
            <div className="px-4 lg:px-6 flex justify-between items-center border-b pb-4">
                <div className="flex items-center gap-2">
                    {view === "detail" && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                setView("list");
                                setOutboundDetail(undefined);
                            }}
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    )}
                    <h1 className="text-2xl font-bold tracking-tight">
                        {view === "scan" ? "Outbound Manual" : view === "list" ? "Riwayat Outbound Manual" : "Detail Outbound Manual"}
                    </h1>
                </div>
                <div className="flex gap-2">
                    {view !== "scan" && canCreate && (
                        <Button onClick={() => setView("scan")} size="sm">
                            <Plus className="mr-2 h-4 w-4" /> Scan Outbound
                        </Button>
                    )}
                    {view !== "list" && (
                        <Button variant="outline" onClick={() => setView("list")} size="sm">
                            <Eye className="mr-2 h-4 w-4" /> Riwayat Outbound
                        </Button>
                    )}
                </div>
            </div>

            {/* Main Content */}
            {view === "scan" && (
                <div className="px-4 lg:px-6">
                    <div className="mb-4">
                        <Label>Scan Barcode Satuan (Piece)</Label>
                        <Input
                            id="barcode-input"
                            disabled={!canCreate || loading}
                            onKeyDown={handleScan}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={
                                canCreate
                                    ? "Scan atau ketik barcode satuan (piece) lalu tekan Enter"
                                    : "Anda tidak memiliki akses untuk melakukan outbound manual"
                            }
                            className="mt-2"
                            autoFocus
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Total: <span className="font-semibold">{barcodes.length}</span> item di-scan
                        </p>
                    </div>

                    <Tabs defaultValue="items">
                        <TabsList>
                            <TabsTrigger value="items">
                                Barang Keluar ({items.length})
                            </TabsTrigger>
                            <TabsTrigger value="barcodes">
                                Kode Batang ({barcodes.length})
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="items">
                            <Items
                                rows={items}
                                removeRow={canCreate ? setDeleteItemKey : undefined}
                            />
                        </TabsContent>
                        <TabsContent value="barcodes">
                            <Barcodes
                                rows={barcodes}
                                removeRow={canCreate ? setDeleteBarcodeKey : undefined}
                            />
                        </TabsContent>
                    </Tabs>
                </div>
            )}

            {view === "list" && (
                <div className="px-4 lg:px-6 flex-1">
                    <OverviewPage
                        columns={listColumns}
                        source={Services.TransactionManualOutbound}
                        rowActions={({ row }) => (
                            <TooltipHover tooltip="Lihat Detail">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => fetchDetail(row.id)}
                                >
                                    <Eye className="h-4 w-4" />
                                </Button>
                            </TooltipHover>
                        )}
                    />
                </div>
            )}

            {view === "detail" && outboundDetail && (
                <div className="px-4 lg:px-6 flex-1">
                    <div className="bg-slate-50 p-4 rounded-lg mb-6 text-sm grid grid-cols-2 md:grid-cols-4 gap-4 border">
                        <div>
                            <span className="text-muted-foreground block">Tanggal Outbound</span>
                            <span className="font-semibold">
                                {outboundDetail.outbound_date
                                    ? formatDate(new Date(outboundDetail.outbound_date))
                                    : "-"}
                            </span>
                        </div>
                        <div>
                            <span className="text-muted-foreground block">Marketplace</span>
                            <span className="font-semibold">
                                {outboundDetail.marketplace?.name ?? "Tanpa Marketplace"}
                            </span>
                        </div>
                        <div>
                            <span className="text-muted-foreground block">Petugas</span>
                            <span className="font-semibold">
                                {outboundDetail.user?.name ?? "-"}
                            </span>
                        </div>
                        <div>
                            <span className="text-muted-foreground block">Total Barang</span>
                            <span className="font-semibold">{outboundDetail.total_items} items</span>
                        </div>
                        <div className="col-span-2 md:col-span-4 mt-2 pt-2 border-t">
                            <span className="text-muted-foreground block">Catatan</span>
                            <span className="font-medium italic text-slate-700">
                                {outboundDetail.notes && outboundDetail.notes.trim() !== ""
                                    ? outboundDetail.notes
                                    : "Tidak ada catatan"}
                            </span>
                        </div>
                    </div>

                    <Tabs defaultValue="items">
                        <TabsList>
                            <TabsTrigger value="items">
                                Barang Keluar ({outboundDetail.summary?.length ?? 0})
                            </TabsTrigger>
                            <TabsTrigger value="barcodes">
                                Kode Batang ({outboundDetail.details?.length ?? 0})
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="items">
                            <div className="pb-8">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Model</TableHead>
                                            <TableHead>Warna</TableHead>
                                            <TableHead>Ukuran</TableHead>
                                            <TableHead className="text-center w-[80px]">Jumlah (Satuan)</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {outboundDetail.summary?.map((summaryItem: any, index: number) => (
                                            <TableRow key={index}>
                                                <TableCell>{summaryItem.model ?? "-"}</TableCell>
                                                <TableCell>{summaryItem.color ?? "-"}</TableCell>
                                                <TableCell>{summaryItem.size ?? "-"}</TableCell>
                                                <TableCell className="text-center">{summaryItem.qty}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </TabsContent>
                        <TabsContent value="barcodes">
                            <div className="pb-8">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Barcode</TableHead>
                                            <TableHead>Model</TableHead>
                                            <TableHead>Warna</TableHead>
                                            <TableHead>Ukuran</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {outboundDetail.details?.map((detailItem: any, index: number) => (
                                            <TableRow key={index}>
                                                <TableCell className="font-mono text-xs">{detailItem.barcode}</TableCell>
                                                <TableCell>{detailItem.model ?? "-"}</TableCell>
                                                <TableCell>{detailItem.color ?? "-"}</TableCell>
                                                <TableCell>{detailItem.size ?? "-"}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            )}

            {/* Bottom Action Bar */}
            {view === "scan" && canCreate && (
                <div className="select-none fixed bottom-0 right-0 w-full border-t backdrop-blur-md bg-background/70 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end justify-end px-7 py-2">
                    <Button
                        variant="destructive"
                        type="button"
                        onClick={() => setResetConfirm(true)}
                        disabled={loading}
                    >
                        Atur Ulang
                    </Button>
                    <Button
                        type="button"
                        onClick={handleConfirm}
                        disabled={loading || barcodes.length === 0}
                    >
                        Submit & Potong Stok
                    </Button>
                </div>
            )}
        </div>
    );
}
