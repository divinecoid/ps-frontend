import { KeyboardEvent, useState } from "react";
import OverviewPage from "@/components/custom/overview-page";
import Services from "@/services";
import { columns } from "./column";
import { ReturnReceipt, ReturnReceiptDetail } from "@/interfaces/return-receipt";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { useAcm } from "@/provider/acm-provider";

import { CalendarDays } from "lucide-react";

export default function ReturnPage() {
  const [activeReceipt, setActiveReceipt] = useState<ReturnReceipt | null>(null);
  const [searchAwb, setSearchAwb] = useState("");
  const [barcodeScan, setBarcodeScan] = useState("");
  const [loading, setLoading] = useState(false);

  // Date range filter states
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  // ACM Permissions
  const { canCreate } = useAcm("retur_barang");

  const handleInitiateReturn = async () => {
    if (!searchAwb.trim()) {
      toast.error("Nomor resi/AWB harus diisi.", { richColors: true });
      return;
    }
    setLoading(true);
    try {
      const res = await Services.TransactionReturnReceipt.store({ awb_code: searchAwb.trim() });
      const json = await res.json();
      if (res.ok) {
        setActiveReceipt(json.data);
        setSearchAwb("");
        toast.success(json.message, { richColors: true });
      } else {
        toast.error(json.message || "Gagal menginisiasi retur.", { richColors: true });
      }
    } catch (e: any) {
      toast.error(e.message, { richColors: true });
    } finally {
      setLoading(false);
    }
  };

  const handleBarcodeScan = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" || !barcodeScan.trim() || !activeReceipt) return;
    setLoading(true);
    try {
      const res = await Services.TransactionReturnReceipt.validateBarcode({
        return_receipt_id: activeReceipt.id,
        barcode: barcodeScan.trim(),
      });
      const json = await res.json();
      if (res.ok) {
        const { detail_id } = json.data;
        
        // Update local detail state
        setActiveReceipt((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            details: prev.details.map((d) =>
              d.id === detail_id
                ? { ...d, is_received: true, barcode_scanned: barcodeScan.trim() }
                : d
            ),
          };
        });
        toast.success(`Berhasil memindai item: ${json.data.item_name}`, { richColors: true });
      } else {
        toast.error(json.message || "Gagal memindai barcode produk.", { richColors: true });
      }
    } catch (err: any) {
      toast.error(err.message, { richColors: true });
    } finally {
      setBarcodeScan("");
      setLoading(false);
    }
  };

  const handleCheckboxChange = (detailId: string, checked: boolean) => {
    setActiveReceipt((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        details: prev.details.map((d) =>
          d.id === detailId ? { ...d, is_received: checked } : d
        ),
      };
    });
  };

  const handleConfirmAll = () => {
    if (!activeReceipt) return;
    setActiveReceipt((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        details: prev.details.map((d) => ({
          ...d,
          is_received: true,
        })),
      };
    });
    toast.success("Semua item berhasil dicentang.", { richColors: true });
  };

  const handleSubmitReturn = async () => {
    if (!activeReceipt) return;
    setLoading(true);
    try {
      const payload = {
        return_receipt_id: activeReceipt.id,
        details: activeReceipt.details.map((d) => ({
          id: d.id,
          barcode_scanned: d.barcode_scanned,
          is_received: d.is_received,
        })),
      };
      const res = await Services.TransactionReturnReceipt.submit(payload);
      const json = await res.json();
      if (res.ok) {
        toast.success(json.message || "Penerimaan retur berhasil disubmit.", { richColors: true });
        setActiveReceipt(null);
      } else {
        toast.error(json.message || "Gagal menyimpan data retur.", { richColors: true });
      }
    } catch (e: any) {
      toast.error(e.message, { richColors: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 h-full select-none">
      <div className="flex-1 flex flex-col gap-4">
        {/* Date Range Filters */}
        <div className="flex flex-wrap items-center gap-4 bg-card p-4 border rounded-lg">
          <div className="flex items-center gap-2">
            <CalendarDays className="size-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filter Tanggal:</span>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="max-w-[160px]"
            />
            <span className="text-sm text-muted-foreground">s/d</span>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="max-w-[160px]"
            />
          </div>
          {(startDate || endDate) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setStartDate("");
                setEndDate("");
              }}
            >
              Reset
            </Button>
          )}
        </div>

        <OverviewPage
          columns={columns}
          source={Services.TransactionReturnReceipt}
          customParams={{
            start_date: startDate,
            end_date: endDate,
          }}
          rowActions={({ row }) => (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveReceipt(row)}
            >
              Proses Retur
            </Button>
          )}
        />
      </div>

      {canCreate && (
        <Card className="border-2 border-dashed">
          <CardHeader>
            <CardTitle>Penerimaan Barang Retur Baru</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {!activeReceipt ? (
              <div className="flex items-end gap-4 max-w-md">
                <div className="flex-1">
                  <Label htmlFor="awb">Nomor Resi / AWB Retur</Label>
                  <Input
                    id="awb"
                    placeholder="Masukkan Nomor Resi"
                    value={searchAwb}
                    onChange={(e) => setSearchAwb(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleInitiateReturn()}
                  />
                </div>
                <Button onClick={handleInitiateReturn} disabled={loading}>
                  + Terima Barang Retur
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Nomor Resi / AWB</Label>
                    <Input value={activeReceipt.awb_code} disabled />
                  </div>
                  <div>
                    <Label>Scan Barcode Barang</Label>
                    <Input
                      placeholder="Scan Barcode Produk Disini"
                      value={barcodeScan}
                      onChange={(e) => setBarcodeScan(e.target.value)}
                      onKeyDown={handleBarcodeScan}
                      disabled={loading}
                      autoFocus
                    />
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden mt-2">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama Barang</TableHead>
                        <TableHead>Warna</TableHead>
                        <TableHead>Ukuran</TableHead>
                        <TableHead>Barcode Dipindai</TableHead>
                        <TableHead className="w-[100px] text-center">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activeReceipt.details.map((detail) => (
                        <TableRow key={detail.id}>
                          <TableCell>{detail.order_item?.item_name || "-"}</TableCell>
                          <TableCell>{detail.order_item?.color || "-"}</TableCell>
                          <TableCell>{detail.order_item?.size || "-"}</TableCell>
                          <TableCell>{detail.barcode_scanned || "-"}</TableCell>
                          <TableCell className="text-center">
                            <Checkbox
                              checked={detail.is_received}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange(detail.id, !!checked)
                              }
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex gap-4 justify-end mt-4">
                  <Button variant="outline" onClick={handleConfirmAll}>
                    Konfirmasi Jumlah Barang Sesuai
                  </Button>
                  <Button onClick={handleSubmitReturn} disabled={loading}>
                    Submit Penerimaan Barang Retur
                  </Button>
                  <Button variant="ghost" onClick={() => setActiveReceipt(null)}>
                    Batal
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
