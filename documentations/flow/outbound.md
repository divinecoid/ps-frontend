# Alur Outbound Barang (Outbound Manual & Outbound by Resi)

Dokumen ini menjelaskan alur bisnis dan teknikal proses **Outbound Barang (Outbound Manual & Outbound by Resi)** yang didekodekan dari file diagram [`outbound.xml`](file:///c:/Projects/PS%20Ko%20Aci/Apps/ps-frontend/documentations/flow/outbound.xml).

---

## Diagram Alur (Mermaid Diagram)

```mermaid
graph TD
    Start([Mulai]) --> MethodDecision{Metode Outbound?}

    %% CABANG 1: OUTBOUND MANUAL
    MethodDecision -- Outbound Manual --> ScanManual[Scan / Input Barcode + Enter]
    ScanManual --> DupDecision{Barcode Sudah<br>Di-scan?}
    DupDecision -- Ya --> ScanManual
    DupDecision -- Tidak --> ValAPI[Validate Barcode via API]
    ValAPI --> AddList[Masukkan ke List Barang & Kode Batang]
    AddList --> SubmitModal[Modal Konfirmasi Submit <br> Pilih Marketplace & Catatan]
    SubmitModal --> SaveManual[Simpan Outbound Manual <br> Submit API & Potong Stok]
    SaveManual --> End([Selesai])

    %% CABANG 2: OUTBOUND BY RESI / PESANAN
    MethodDecision -- Outbound by Resi --> MenuOrder[Masuk Menu Pesanan <br> Fetch Shopee / Tiktok]
    MenuOrder --> DetailOrder[Klik Detail Pesanan <br> Status: Ready to Pickup]
    DetailOrder --> ScanItem[Scan Barcode Item Pesanan <br> Sesuai Detail Order]
    ScanItem --> CheckComplete{Semua Barcode Terisi<br>& Tidak Duplikat?}
    CheckComplete -- Tidak / Error --> ScanItem
    CheckComplete -- Ya --> SavePrep[Simpan Persiapan <br> Submit Preparation API]
    SavePrep --> End

    style Start fill:#d5e8d4,stroke:#82b366,stroke-width:2px
    style End fill:#f8cecc,stroke:#b85450,stroke-width:2px
```

---

## Deskripsi Paragraf Alur Outbound Barang

Proses outbound (pengeluaran barang jadi dari gudang) dapat diproses melalui dua metode utama berdasarkan keputusan **Metode Outbound**:

### 1. Metode Outbound Manual
- Digunakan untuk pengeluaran stok mandiri/manual. Pengguna langsung melakukan **Scan/Input Barcode** satuan.
- Sistem mengecek secara lokal jika **Barcode Sudah Di-scan?** (untuk mencegah duplikasi). Jika ya, scan diabaikan dan dibersihkan. Jika tidak, sistem mengirim request ke server untuk **Validate Barcode via API**.
- Setelah divalidasi dan detail item diperoleh, data **Dimasukkan ke List** (tab *Barang Keluar* dan *Kode Batang*).
- Setelah selesai, pengguna mengonfirmasi via **Modal Konfirmasi Submit** untuk menentukan **Marketplace tujuan** (Shopee, Tiktok Shop, atau manual/tanpa marketplace) dan menambahkan **Catatan**.
- Setelah disubmit, API akan memproses **Simpan Outbound Manual** dan secara otomatis memotong stok barang satuan di lokasi rak terkait (**Selesai**).

### 2. Metode Outbound by Resi (Menu Pesanan)
- Digunakan untuk memproses pesanan masuk dari marketplace terintegrasi. Pengguna masuk ke **Menu Pesanan** dan dapat melakukan sinkronisasi pesanan secara manual (*Fetch Shopee Manual* atau *Fetch Tiktok Manual*).
- Pengguna memilih pesanan dengan status `Ready to Pickup` (atau `Ready to Ship`) dan masuk ke halaman **Detail Pesanan**.
- Pengguna melakukan **Scan Barcode Item Pesanan** secara spesifik untuk mencocokkan fisik barang dengan rincian pesanan.
- Setelah pemindaian, sistem memverifikasi **Apakah Semua Barcode Terisi & Tidak Duplikat?**. Jika terdapat error atau barcode kosong/duplikat, pengguna diminta untuk memperbaikinya.
- Jika verifikasi lolos, pengguna menekan tombol simpan untuk mengeksekusi **Simpan Persiapan (Submit Preparation API)**, yang akan mencatat barcode barang yang keluar untuk pesanan tersebut dan memperbarui status pesanan menjadi siap kirim (**Selesai**).
