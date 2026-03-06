# Master Data Configuration API Documentation

Dokumentasi ini mencakup endpoint yang berhubungan dengan master data Konfigurasi (`configurations`). Endpoint ini dibuat berdasarkan file `app/Http/Controllers/MasterData/ConfigurationController.php` dan didefinisikan di `routes/api.php`.

Fitur ini digunakan untuk menyimpan pengaturan aplikasi secara dinamis (misalnya: apakah butuh checker, minimum quantity gudang, dll). Setiap perubahan `config_value` akan otomatis tercatat di tabel history.

## Base URL
Semua endpoint berada dengan prefix `/api/configuration` dan membutuhkan middleware `checkrole:admin`.

## Data Type (Enum)
Setiap konfigurasi memiliki `data_type` yang menentukan tipe datanya:

| data_type | Keterangan | Contoh config_value |
|-----------|------------|---------------------|
| `boolean` | Nilai benar/salah | `"true"`, `"false"` |
| `integer` | Bilangan bulat | `"10"`, `"50"` |
| `decimal` | Bilangan desimal | `"99.5"`, `"0.75"` |
| `string` | Teks bebas | `"Gudang Utama"` |

> **Catatan**: `config_value` selalu dikirim dan diterima sebagai **string**. Konversi ke tipe asli dilakukan di backend sesuai `data_type`.

## Seed Data (Konfigurasi Awal)
Berikut adalah data konfigurasi yang sudah di-seed:

| config_key | data_type | config_value | description |
|------------|-----------|--------------|-------------|
| `is_need_checker` | boolean | `"true"` | Apakah membutuhkan checker dalam proses operasional |
| `min_qty_gudang_kecil` | integer | `"10"` | Minimum quantity yang harus tersedia di gudang kecil |
| `min_qty_gudang_besar` | integer | `"50"` | Minimum quantity untuk mengambil langsung dari gudang besar |

---

## 1. Get All Configurations (Paginated)
Mengambil daftar master data konfigurasi dengan format paginasi, mendukung pencarian dan filter.

- **Endpoint:** `GET /api/configuration`
- **Tipe:** GET
- **Middleware:** `checkrole:admin`

### Query Parameters (Opsional)
- `per_page`: Jumlah item per halaman (default: sesuai konfigurasi sistem).
- `search`: Kata kunci pencarian. Pencarian dilakukan pada kolom `config_key`, `data_type`, dan `description`.
- `config_key`: Memfilter berdasarkan config_key secara persis.
- `data_type`: Memfilter berdasarkan tipe data secara persis (`boolean`, `integer`, `decimal`, `string`).
- `description`: Memfilter berdasarkan deskripsi secara persis.

### Response
Berupa paginasi standar, dengan setiap item memiliki struktur berikut:
```json
{
    "data": [
        {
            "id": "uuid",
            "config_key": "is_need_checker",
            "config_value": "true",
            "data_type": "boolean",
            "description": "Apakah membutuhkan checker dalam proses operasional",
            "created_by": {
                "id": "uuid",
                "name": "Admin"
            },
            "updated_by": {
                "id": "uuid",
                "name": "Admin"
            }
        }
    ],
    "current_page": 1,
    "last_page": 1,
    "per_page": 10,
    "total": 3
}
```

> **Catatan untuk frontend**: `created_by` dan `updated_by` bisa bernilai `null` jika data dibuat melalui seeder (tanpa user login).

---

## 2. Get All Configurations (Master Data List)
Mengambil daftar master data konfigurasi untuk keperluan list/dropdown, menyertakan data yang di-*soft delete* (`withTrashed`).

- **Endpoint:** `GET /api/configuration/master`
- **Tipe:** GET
- **Middleware:** `checkrole:admin`

### Query Parameters (Opsional)
- Mendukung filter pencarian pada kolom `config_key`, `data_type`, dan `description`.
- `per_page`: Jumlah item per halaman.

### Response
Sama dengan endpoint index, dengan tambahan status `deleted_at`:
```json
{
    "id": "uuid",
    "config_key": "is_need_checker",
    "config_value": "true",
    "data_type": "boolean",
    "description": "Apakah membutuhkan checker",
    "created_by": { "id": "uuid", "name": "Admin" },
    "updated_by": null,
    "deleted_at": false
}
```
`deleted_at` bernilai `true` jika item sudah di-soft delete, `false` jika masih aktif.

---

## 3. Get Configuration Detail (Show)
Mengambil detail satu konfigurasi spesifik berdasarkan ID, **beserta seluruh riwayat perubahannya**.

- **Endpoint:** `GET /api/configuration/{id}`
- **Tipe:** GET
- **Middleware:** `checkrole:admin`
- **Parameter URL:** `{id}` (UUID dari tabel mdx_configurations)

### Response
```json
{
    "success": true,
    "data": {
        "id": "uuid",
        "config_key": "min_qty_gudang_kecil",
        "config_value": "15",
        "data_type": "integer",
        "description": "Minimum quantity yang harus tersedia di gudang kecil",
        "created_by": {
            "id": "uuid",
            "name": "Admin"
        },
        "updated_by": {
            "id": "uuid",
            "name": "Manager"
        },
        "histories": [
            {
                "id": "uuid",
                "old_value": "10",
                "new_value": "15",
                "changed_by": {
                    "id": "uuid",
                    "name": "Manager"
                },
                "changed_at": "2026-03-06T12:30:00.000000Z"
            },
            {
                "id": "uuid",
                "old_value": "5",
                "new_value": "10",
                "changed_by": {
                    "id": "uuid",
                    "name": "Admin"
                },
                "changed_at": "2026-03-01T09:00:00.000000Z"
            }
        ]
    }
}
```

> **Catatan**: `histories` diurutkan dari yang terbaru ke terlama (`changed_at` DESC). Jika belum pernah diubah, array `histories` akan kosong `[]`.

---

## 4. Get Configuration Histories (Paginated)
Mengambil daftar riwayat perubahan dari satu konfigurasi spesifik, dengan format paginasi.

- **Endpoint:** `GET /api/configuration/{id}/histories`
- **Tipe:** GET
- **Middleware:** `checkrole:admin`
- **Parameter URL:** `{id}` (UUID dari tabel mdx_configurations)

### Query Parameters (Opsional)
- `per_page`: Jumlah item per halaman.

### Response
```json
{
    "data": [
        {
            "id": "uuid",
            "old_value": "10",
            "new_value": "15",
            "changed_by": {
                "id": "uuid",
                "name": "Manager"
            },
            "changed_at": "2026-03-06T12:30:00.000000Z"
        }
    ],
    "current_page": 1,
    "last_page": 1,
    "per_page": 10,
    "total": 2
}
```

> **Gunakan endpoint ini** jika ingin menampilkan history dengan paginasi (misalnya history sangat banyak). Untuk menampilkan history ringkas, gunakan endpoint Show (`GET /api/configuration/{id}`) yang sudah menyertakan seluruh history.

---

## 5. Create New Configuration (Store)
Menyimpan data konfigurasi baru. `created_by` dan `updated_by` otomatis diisi dari user yang sedang login.

- **Endpoint:** `POST /api/configuration`
- **Tipe:** POST
- **Middleware:** `checkrole:admin`

### Request Body
```json
{
    "config_key": "max_retry_count",
    "config_value": "3",
    "data_type": "integer",
    "description": "Jumlah maksimum retry untuk proses otomatis"
}
```

### Validation Rules

| Field | Rules | Keterangan |
|-------|-------|------------|
| `config_key` | **required**, string, max:100, unique | Harus unik di seluruh tabel |
| `config_value` | nullable, string | Nilai konfigurasi (selalu string) |
| `data_type` | **required**, string, in:boolean,integer,decimal,string | Harus salah satu dari 4 tipe |
| `description` | nullable, string | Deskripsi konfigurasi |

### Response (Success)
```json
{
    "success": true,
    "data": {
        "id": "uuid-generated",
        "config_key": "max_retry_count",
        "config_value": "3",
        "data_type": "integer",
        "description": "Jumlah maksimum retry untuk proses otomatis",
        "created_by": "uuid-user",
        "updated_by": "uuid-user",
        "created_at": "2026-03-06T12:30:00.000000Z",
        "updated_at": "2026-03-06T12:30:00.000000Z"
    }
}
```

### Response (Validation Error)
```json
{
    "success": false,
    "message": "The config key has already been taken."
}
```

---

## 6. Update Configuration
Mengubah/update data konfigurasi. **Jika `config_value` berubah**, sistem otomatis mencatat riwayat perubahan ke tabel `mdx_configurations_histories`.

- **Endpoint:** `PATCH /api/configuration/{id}`
- **Tipe:** PATCH
- **Middleware:** `checkrole:admin`
- **Parameter URL:** `{id}` (UUID dari tabel mdx_configurations)

### Request Body
```json
{
    "config_key": "min_qty_gudang_kecil",
    "config_value": "15",
    "data_type": "integer",
    "description": "Minimum quantity yang harus tersedia di gudang kecil"
}
```

### Validation Rules
Sama seperti Create (Store). Aturan keunikan `config_key` akan mengabaikan record ID saat ini agar tidak bentrok.

### Perilaku Auto-History
Ketika endpoint ini dipanggil dan `config_value` **berubah** dari nilai sebelumnya:
1. Nilai lama (`old_value`) dan baru (`new_value`) dicatat
2. User yang mengubah (`changed_by`) dicatat dari token login
3. Waktu perubahan (`changed_at`) dicatat otomatis

Jika `config_value` **tidak berubah** (misalnya hanya update `description`), history **tidak** akan dicatat.

### Response (Success)
```json
{
    "success": true,
    "data": {
        "id": "uuid",
        "config_key": "min_qty_gudang_kecil",
        "config_value": "15",
        "data_type": "integer",
        "description": "Minimum quantity yang harus tersedia di gudang kecil",
        "created_by": "uuid-user",
        "updated_by": "uuid-user-yang-update",
        "created_at": "2026-03-06T12:00:00.000000Z",
        "updated_at": "2026-03-06T12:30:00.000000Z"
    }
}
```

---

## 7. Delete Configuration (Single)
Menghapus master data konfigurasi (*Soft Delete*).

- **Endpoint:** `DELETE /api/configuration/{id}`
- **Tipe:** DELETE
- **Middleware:** `checkrole:admin`
- **Parameter URL:** `{id}` (UUID data)

---

## 8. Restore Configuration
Mengembalikan data konfigurasi yang sudah terhapus (*Soft delete -> Restore*).

- **Endpoint:** `POST /api/configuration/{id}/restore`
- **Tipe:** POST
- **Middleware:** `checkrole:admin`
- **Parameter URL:** `{id}` (UUID data terhapus)

---

## 9. Multi Delete Configurations
Menghapus sekumpulan data konfigurasi sekaligus dalam satu request menggunakan kumpulan array ID.

- **Endpoint:** `DELETE /api/configuration`
- **Tipe:** DELETE
- **Middleware:** `checkrole:admin`

### Request Body
Mengirimkan Array of string UUID:
```json
[
    "uuid-config-1",
    "uuid-config-2",
    "uuid-config-3"
]
```

---

## Ringkasan Endpoint

| # | Method | Endpoint | Fungsi |
|---|--------|----------|--------|
| 1 | `GET` | `/api/configuration` | List semua konfigurasi (paginated) |
| 2 | `GET` | `/api/configuration/master` | List termasuk yang soft-deleted |
| 3 | `GET` | `/api/configuration/{id}` | Detail konfigurasi + history |
| 4 | `GET` | `/api/configuration/{id}/histories` | History perubahan (paginated) |
| 5 | `POST` | `/api/configuration` | Tambah konfigurasi baru |
| 6 | `PATCH` | `/api/configuration/{id}` | Update konfigurasi (auto-history) |
| 7 | `DELETE` | `/api/configuration/{id}` | Soft delete konfigurasi |
| 8 | `POST` | `/api/configuration/{id}/restore` | Restore soft-deleted |
| 9 | `DELETE` | `/api/configuration` | Multi delete konfigurasi |

## Catatan Implementasi Frontend

### Halaman List Konfigurasi
- Gunakan `GET /api/configuration` untuk tabel utama
- Filter by `data_type` untuk menampilkan grup konfigurasi tertentu
- Tampilkan `config_key`, `config_value`, `data_type`, `description`, dan `updated_by.name`

### Form Edit Konfigurasi
- Gunakan `GET /api/configuration/{id}` untuk data detail + history
- Render input sesuai `data_type`:
  - `boolean` → Toggle/Switch (kirim `"true"` atau `"false"`)
  - `integer` → Input number tanpa desimal (kirim sebagai string, contoh: `"10"`)
  - `decimal` → Input number dengan desimal (kirim sebagai string, contoh: `"99.5"`)
  - `string` → Input text biasa
- Submit via `PATCH /api/configuration/{id}`
- Semua `config_value` dikirim sebagai **string**

### Panel History
- Tampilkan di bawah form edit atau di tab terpisah
- Gunakan `histories` dari response Show, atau `GET /api/configuration/{id}/histories` jika butuh paginasi
- Tampilkan: `old_value` → `new_value`, `changed_by.name`, `changed_at`
