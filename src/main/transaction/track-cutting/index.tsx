import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DynamicCombobox } from "@/components/custom/dynamic-combobox";
import Services from "@/services";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface SearchResult {
    fabric_cutting_id: string;
    serial_number: string;
    status: string;
    avl_qty: number;
    req_qty: number;
}

export default function TrackCutting() {
    const [modelId, setModelId] = useState<string>("");
    const [colorId, setColorId] = useState<string>("");
    const [sizeId, setSizeId] = useState<string>("");

    const [searchTriggered, setSearchTriggered] = useState(false);

    const [results, setResults] = useState<SearchResult[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    const handleSearch = async () => {
        if (!modelId || !colorId || !sizeId) {
            toast.error("Model, Warna, dan Ukuran harus dipilih!");
            return;
        }
        setSearchTriggered(true);
        setIsLoading(true);
        setIsError(false);
        try {
            const response = await Services.TransactionFabricCutting.searchCutting(modelId, colorId, sizeId);
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || "Gagal memuat data");
            }
            const json = await response.json();
            setResults(json.data as SearchResult[]);
        } catch (error) {
            setIsError(true);
            if (error instanceof Error) {
                toast.error(error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col flex-1 p-4 md:p-8 gap-4 overflow-y-auto">
            <h1 className="text-2xl font-bold tracking-tight">Lacak Hasil Potong</h1>
            
            <Card>
                <CardHeader>
                    <CardTitle>Filter Pencarian</CardTitle>
                    <CardDescription>Pilih Model, Warna, dan Ukuran untuk mencari sisa potongan kain yang tersedia.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col gap-2">
                            <Label>Model</Label>
                            <DynamicCombobox
                                id="id"
                                label="name"
                                value={modelId}
                                onValueChange={(val) => { setModelId(val as string); setSearchTriggered(false); }}
                                source={Services.MasterProductModel.index}
                                placeholder="Pilih Model"
                                className="w-full"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label>Warna</Label>
                            <DynamicCombobox
                                id="id"
                                label="name"
                                value={colorId}
                                onValueChange={(val) => { setColorId(val as string); setSearchTriggered(false); }}
                                source={Services.MasterColor.index}
                                placeholder="Pilih Warna"
                                className="w-full"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label>Ukuran</Label>
                            <DynamicCombobox
                                id="id"
                                label="name"
                                value={sizeId}
                                onValueChange={(val) => { setSizeId(val as string); setSearchTriggered(false); }}
                                source={Services.MasterSize.index}
                                placeholder="Pilih Ukuran"
                                className="w-full"
                            />
                        </div>
                    </div>
                    <Button onClick={handleSearch} className="w-fit" disabled={isLoading}>
                        {isLoading ? "Mencari..." : "Cari"}
                    </Button>
                </CardContent>
            </Card>

            {(searchTriggered || results) && (
                <Card>
                    <CardHeader>
                        <CardTitle>Hasil Pencarian</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading && <p>Loading...</p>}
                        {isError && <p className="text-destructive">Gagal memuat data.</p>}
                        {!isLoading && !isError && results && results.length === 0 && (
                            <p className="text-muted-foreground text-sm">Tidak ada data ditemukan untuk kriteria ini.</p>
                        )}
                        {!isLoading && !isError && results && results.length > 0 && (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>No</TableHead>
                                        <TableHead>Nomor Seri Potong</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Total Req Qty</TableHead>
                                        <TableHead>Sisa Qty</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {results.map((row, index) => (
                                        <TableRow key={row.fabric_cutting_id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{row.serial_number}</TableCell>
                                            <TableCell>{row.status}</TableCell>
                                            <TableCell>{row.req_qty}</TableCell>
                                            <TableCell>{row.avl_qty}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
