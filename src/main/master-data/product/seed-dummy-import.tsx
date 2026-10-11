import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Download, Upload } from "lucide-react";
import Services from "@/services";
import { toast } from "sonner";
import { downloadFile } from "@/lib/file";

interface SeedDummyImportProps {
  onSubmit?: () => void;
  onDone?: () => void;
}

export default function SeedDummyImport({ onSubmit, onDone }: SeedDummyImportProps) {
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDownloadTemplate = async () => {
    setDownloading(true);
    try {
      const res = await Services.MasterProduct.seedDummyTemplate();
      if (!res.ok) {
        toast.error("Gagal mengunduh template", { richColors: true });
        return;
      }
      await downloadFile(res);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, { richColors: true });
      }
    } finally {
      setDownloading(false);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Pilih file Excel terlebih dahulu", { richColors: true });
      return;
    }
    setLoading(true);
    setErrors([]);
    try {
      const res = await Services.MasterProduct.seedDummyImport(file);
      const json = await res?.json();
      if (res?.ok) {
        toast.success(json.message || "Berhasil import stok lama!", { richColors: true });
        setFile(null);
        if (inputRef.current) inputRef.current.value = "";
        onSubmit?.();
        onDone?.();
      } else {
        const message = String(json?.message || "Gagal import stok lama");
        setErrors(message.split("\n").filter(Boolean));
        toast.error("Import gagal, periksa detail error di bawah", { richColors: true });
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, { richColors: true });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-dashed p-4 space-y-3">
        <p className="text-sm text-muted-foreground">
          Unduh template, isi setiap baris dengan kode CMT, SKU model, kode warna, kode ukuran, kode rak, tipe (D/P), nomor urut, dan jumlah (qty). Semua baris akan diproses sekaligus &mdash; jika ada baris yang salah, tidak ada yang akan disimpan.
        </p>
        <Button type="button" variant="outline" className="flex items-center gap-2" onClick={handleDownloadTemplate} disabled={downloading}>
          <Download className="h-4 w-4" /> {downloading ? "Mengunduh..." : "Unduh Template Excel"}
        </Button>
      </div>

      <div className="space-y-2">
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-input file:bg-background file:text-sm file:font-medium hover:file:bg-accent"
        />
      </div>

      {errors.length > 0 && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 max-h-48 overflow-y-auto">
          <ul className="text-sm text-destructive space-y-1 list-disc pl-4">
            {errors.map((err, i) => <li key={i}>{err}</li>)}
          </ul>
        </div>
      )}

      <div className="flex justify-end gap-2">
        <DialogClose asChild>
          <Button type="button" variant="outline">Batal</Button>
        </DialogClose>
        <Button type="button" className="flex items-center gap-2" onClick={handleUpload} disabled={loading || !file}>
          <Upload className="h-4 w-4" /> {loading ? "Memproses..." : "Upload & Generate"}
        </Button>
      </div>
    </div>
  );
}
