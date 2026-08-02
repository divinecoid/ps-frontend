# Alur Proses Pembelian Kain

Proses pembelian kain dimulai ketika pengguna masuk ke menu **Pembelian Kain** pada sistem. Di dalam menu ini, pengguna dapat memulai proses pengadaan dengan mengklik tombol **Pengajuan Baru**. Setelah itu, pengguna diarahkan untuk mengisi informasi detail pembelian, yang meliputi pemilihan **Pabrik**, spesifikasi **Gram**, **Ukuran**, serta rincian **Warna dan Jumlah** kain yang dibutuhkan. Setelah semua data terisi dengan benar, pengguna mengklik tombol **Simpan**, yang akan membuat pengajuan tersebut tercatat di dalam sistem dengan status **OPEN**.

Setelah pengajuan disimpan dan masuk ke dalam daftar (list), pengguna dapat memilih tindakan lanjutan terhadap data pengajuan tersebut:

*   **Pilihan Tindakan: Batalkan/Hapus Pengajuan (Cancel)**
    Jika pengguna memutuskan untuk membatalkan pengadaan, pengguna dapat memilih tindakan untuk membatalkan atau menghapus pengajuan tersebut. Tindakan ini akan mengubah status pengajuan menjadi batal/dihapus, dan alur proses untuk pengajuan tersebut dinyatakan selesai (End).

*   **Pilihan Tindakan: Selesaikan Pembelian (Complete Row)**
    Jika proses pembelian tetap dilanjutkan hingga selesai, pengguna memilih tindakan untuk menyelesaikan pembelian. Langkah ini akan memproses transaksi hingga statusnya berubah menjadi selesai (*Complete*), menandakan bahwa seluruh rangkaian pembelian kain telah berhasil dituntaskan hingga tahap akhir (End).
