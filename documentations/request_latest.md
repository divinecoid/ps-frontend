# Request (CMT Request) API Documentation

Dokumentasi ini mencakup endpoint yang berhubungan dengan proses pembuatan dan pengelolaan Request ke CMT. Endpoint ini didefinisikan di `routes/api.php` dan ditangani oleh `app/Http/Controllers/Transaction/RequestController.php`.

## Base URL
Semua endpoint di bawah ini menggunakan prefix `/api/request` dan membutuhkan header Authorization berisi Bearer Token, serta dilindungi oleh middleware `checkrole`.

---

## 1. Get All Requests
Mengambil daftar semua Request (bisa dipaginasi dan di-filter sesuai sifat bawaan *base logic* CRUD).

- **Endpoint:** `GET /api/request`
- **Tipe:** GET

### Response (Struktur Tiap Item)
```json
{
    "id": "uuid",
    "cmt_id": "uuid",
    "serial_number": "Nomor Seri Request",
    "cmt": {
        "id": "uuid",
        "code": "Kode CMT",
        "name": "Nama CMT"
    },
    "created_at": "YYYY-MM-DD HH:mm:ss",
    "status": "OPEN|CLOSED",
    "request_detail": [
        {
            "req_dozen_qty": 10,
            "req_piece_qty": 3,
            "rec_dozen_qty": 0,
            "rec_piece_qty": 0,
            "rec_bs_qty": 0,
            "model_id": "uuid",
            "models": { /* Data Model */ },
            "color_id": "uuid",
            "colors": { /* Data Warna */ },
            "barcode": "CMT01|20260301120000|MOD01|RED|XL"
        }
    ]
}
```

---

## 2. Get Request Target Detail (Show)
Mengambil detail dari sebuah Request beserta ringkasan dari pesanan dan riwayat *Received Log* (Inbound) untuk Request bersangkutan.

- **Endpoint:** `GET /api/request/{id}`
- **Tipe:** GET
- **Parameter:** `id` (UUID dari Request)

### Response
Berisi struktur grouping berdasarkan varian (Model & Color) dan riwayat Inbound Logs:
```json
{
    "success": true,
    "message": "Data retrieved successfully",
    "data": {
        "cmt_id": "uuid",
        "serial_number": "Nomor Seri Request",
        "status": "OPEN|CLOSED",
        "request_detail": [
            {
                "model_id": "uuid",
                "color_id": "uuid",
                "variant_detail": [
                    {
                        "size_id": "uuid",
                        "dozen_qty": 2,
                        "piece_qty": 5
                    }
                ]
            }
        ],
        "receive_log": [
            {
                "id": "uuid",
                "request_id": "uuid",
                "warehouse_id": "uuid",
                "warehouse": { "name": "Nama Gudang" },
                "user_id": "uuid",
                "user": { "name": "Nama Admin" },
                "received_date": "YYYY-MM-DD HH:mm:ss",
                "notes": "Catatan Inbound",
                "created_at": "YYYY-MM-DD HH:mm:ss",
                "updated_at": "YYYY-MM-DD HH:mm:ss",
                "details": [
                    {
                        "model_id": "uuid",
                        "model": { "name": "Nama Model" },
                        "color_id": "uuid",
                        "color": { "name": "Nama Warna" },
                        "size_id": "uuid",
                        "size": { "name": "Nama Size" },
                        "qty": 12,
                        "barcode": "Barcode Item"
                    }
                ]
            }
        ]
    }
}
```

---

## 3. Get Request Barcodes List
Dipakai khusus untuk mengambil daftar detail kuantitas target dan **barcode master** per item yang di-*generate* dari sebuah request (biasanya dipakai untuk nge-print stiker barcode sebelum dikirim ke CMT).

- **Endpoint:** `GET /api/request/barcode/{id}`
- **Tipe:** GET
- **Parameter:** `id` (UUID dari Request)

### Response
```json
{
    "success": true,
    "data": {
        "request_detail": [
            {
                "req_dozen_qty": 5,
                "req_piece_qty": 0,
                "barcode": "CMT01|20260301120000|MOD01|RED|XL"
            },
            {
                "req_dozen_qty": 0,
                "req_piece_qty": 3,
                "barcode": "CMT01|20260301120000|MOD01|RED|LG"
            }
        ]
    }
}
```
*Catatan:* Barcode yang dikembalikan di atas adalah ** Prefix utama **. Saat melakukan scan Inbound, nanti akan ditambahkan `|DOZEN|1` atau `|PIECE|1` di belakangnya (tergantung grup).

---

## 4. Create (Store) New Request
Endpoint utama untuk mem-booking dan membuat Request ke CMT. Menentukan Item, Warna, dan perincian Ukuran apa saja beserta jumlah per Lusin dan Pierce (Pcs).

- **Endpoint:** `POST /api/request`
- **Tipe:** POST

### Request Body (JSON)
```json
{
    "cmt_id": "019b85c4-c21c-7215-b374-47b05605d1b3",
    "serial_number": "REQ-CMT-001/2026",
    "request_detail": [
        {
            "model_id": "019b85c4-ceea-715a-9f5b-1b1b1b1b1b1b",
            "color_id": "019b85c4-ceea-715a-9f5b-2c2c2c2c2c2c",
            "variant_detail": [
                {
                    "size_id": "019b85c4-ceea-715a-9f5b-3d3d3d3d3d3d",
                    "dozen_qty": 10,
                    "piece_qty": 3
                },
                {
                    "size_id": "019b85c4-ceea-715a-9f5b-4e4e4e4e4e4e",
                    "dozen_qty": 5,
                    "piece_qty": 0
                }
            ]
        },
        {
            "model_id": "019b85c4-ceea-715a-9f5b-5f5f5f5f5f5f",
            "color_id": "019b85c4-ceea-715a-9f5b-6a6a6a6a6a6a",
            "variant_detail": [
                {
                    "size_id": "019b85c4-ceea-715a-9f5b-3d3d3d3d3d3d",
                    "dozen_qty": 0,
                    "piece_qty": 15
                }
            ]
        }
    ]
}
```

### Aturan & Keterangan Payload:
- `cmt_id`: **Wajib**. UUID valid dari master tabel CMT (`mdx_cmts`).
- `serial_number`: **Wajib**. String representasi nomor dokumen request yang di-input / di-*generate* secara manual oleh operator.
- `request_detail`: Array berisikan objek kombinasi Model dan Warna. Minimal 1 elemen.
  - `model_id`: **Wajib**. UUID master Model.
  - `color_id`: **Wajib**. UUID master Warna.
  - `variant_detail`: Konfigurasi per Model+Warna tentang rincian Size beserta kuantitas lusinan & satuannya (*piece*).
      - `size_id`: **Wajib**. UUID master Size.
      - `dozen_qty`: **Wajib**. Integer >= 0 (Jika kosong, kirim `0`).
      - `piece_qty`: **Wajib**. Integer >= 0 (Jika kosong, kirim `0`).

### Validasi Backend:
- Backend akan otomatis mengecek validitas kombinasi color dan size. Apabila suatu warna atau ukuran tidak terdaftar (bukan milik) Model bersangkutan, request akan **ditolak** dengan error `422`.
- Total Requirement Kuantitas per baris (*req_qty*) otomatis dihitung di latar belakang menggunakan rumus pendataan absolut Pcs: `(dozen_qty * 12) + piece_qty`.

### Response Success (200)
```json
{
    "success": true,
    "message": "Data saved successfully",
    "data": {
        "id": "uuid",
        "cmt_id": "uuid",
        "serial_number": "REQ-CMT-001/2026",
        "status": "OPEN",
        "created_at": "YYYY-MM-DD HH:mm:ss"
    }
}
```

---

## 5. Delete Request
Menghapus data spesifik Request. Hanya berlaku jika status belum terlanjur in-progress / divalidasi oleh sistem yang punya constraint restrict terhadap Inbound.

- **Endpoint:** `DELETE /api/request/{id}`
- **Tipe:** DELETE
- **Parameter:** `id` (UUID dari Request)

### Response Success (200)
```json
{
    "success": true,
    "message": "Data deleted successfully"
}
```
