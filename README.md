# AWI TOUR HAJI & UMRAH YOGYAKARTA
### Sistem Informasi & Dashboard Operasional Manajemen Keberangkatan

Aplikasi web operasional terpadu yang dirancang khusus untuk mempermudah tugas **Admin Operasional** dan **Pimpinan Travel** di **AWI Tour Haji & Umrah (Yogyakarta)**. Sistem ini menggantikan proses pengelolaan berkas yang sebelumnya serba manual via WhatsApp menjadi sistem digital otomatis, meminimalisir kesalahan ketik (*anti-human error* 0%), serta mempercepat penerbitan berkas resmi seperti Manifest Visa, Siskopatuh Kemenag, pembagian kamar hotel, denah kursi pesawat, dan cetak massal berkas keberangkatan.

---

## 🌟 Fitur Utama Sistem

### 1. 📊 Dashboard & Live Seat Tracker
- **Pelacak Sisa Kursi Pesawat Real-Time:** Menampilkan total kuota kursi yang dibooking travel, jumlah jamaah terkonfirmasi (DP/Lunas), dan sisa kursi kosong yang masih tersedia.
- **Peringatan Kuota Kritis:** Indikator visual otomatis menyala merah saat kuota sisa $\le 5$ kursi.
- **Monitoring Keuangan Kloter:** Rekapitulasi total kas masuk, pembayaran DP, pelunasan, dan piutang.
- **Pusat Peringatan Dini (Alert Center):** Mendeteksi otomatis berkas jamaah yang berisiko menggagalkan keberangkatan (paspor kadaluwarsa $< 6$ bulan atau nama paspor kurang dari 3 kata).

### 2. 📝 Form Input Jamaah Terpandu (Anti-Typo)
- **Masking NIK KTP (16 Digit):** Mencegah kesalahan kelebihan atau kekurangan digit pada NIK.
- **Validasi Format Paspor:** Memastikan format standar paspor Indonesia (1 huruf kapital + 7/8 digit angka).
- **Deteksi Suku Kata Nama:** Otomatis mengubah nama ke huruf kapital dan menghitung jumlah suku kata:
  - `✓ 3 Kata`: Sesuai aturan visa umrah/haji Arab Saudi.
  - `⚠ 2 Kata`: Menandai perlunya surat rekomendasi tambah nama / *endorsement* visa.
- **Peringatan Paspor Kadaluwarsa $< 6$ Bulan:** Alert merah menyala jika masa berlaku paspor kurang dari 180 hari dari tanggal keberangkatan.
- **Pengelompokan Keluarga:** Menggunakan Nomor Kartu Keluarga (KK) sebagai kunci otomatisasi kamar dan kursi keluarga.
- **Fitur Pindah Kloter (Mutasi Batch):** Memindahkan jamaah ke jadwal keberangkatan lain tanpa perlu mengulang input data berkas.

### 3. 🛡️ Halaman Validasi, Manifest & Siskopatuh
- **Matriks Audit 5 Aturan Kritis:**
  1. Masa berlaku paspor $\ge$ 6 bulan dari tanggal terbang.
  2. Nama lengkap paspor $\ge$ 3 suku kata.
  3. Kelengkapan 4 dokumen wajib (Paspor, KTP, KK, Sertifikat Vaksin).
  4. Format baku digit NIK dan nomor paspor.
  5. Vaksinasi Meningitis & Polio terverifikasi.
- **Download Format Resmi Sekali Klik:**
  - 📄 **Manifest Visa (.xlsx):** Format resmi untuk provider visa dan *muassasah* Arab Saudi.
  - 📄 **Siskopatuh Kemenag (.xlsx):** Format resmi Kementerian Agama RI untuk pendaftaran porsi dan penerbitan ID Card jamaah.
- **Input e-Visa Terbit:** Tombol pencatatan nomor visa setelah terbit dari Kedutaan/Provider.

### 4. 🏨 Room List Hotel Visual (Makkah & Madinah)
- **Auto-Suggest Cerdas:** Otomatis mengelompokkan keluarga (berdasarkan No KK) ke kamar bertipe *Quad* (isi 4), *Triple* (isi 3), atau *Double* (isi 2).
- **Pemisahan Gender:** Jamaah mandiri (non-keluarga) dipisahkan secara ketat menjadi Kamar Ikhwan (Pria saja) dan Kamar Akhwat (Wanita saja).
- **Interaksi Tukar Kasur (Click-to-Swap):** Klik kasur jamaah mana pun, lalu klik slot kasur di kamar lain untuk menukar atau memindahkan kamar secara fleksibel.
- **Unduh Format Excel:** Tombol ekspor `ROOM_LIST.xlsx`.

### 5. ✈️ Seat Plan Kabin Pesawat Interaktif
- **Denah Kabin Pesawat:** Layout kabin penerbangan Umrah formasi 3 - 3 (Kursi A, B, C [Lorong] D, E, F).
- **Prioritas Otomatis:**
  - **Lansia (Usia $\ge$ 60 tahun):** Ditempatkan di baris depan (Row 1-4) dan posisi kursi lorong (*Aisle: C atau D*) agar mudah ke toilet.
  - **Keluarga:** Ditempatkan bersebelahan dalam baris yang sama.
- **Interaksi Tukar Kursi:** Klik kursi untuk memilih dan menukar posisi penumpang.
- **Unduh Format Excel:** Tombol ekspor `SEAT_PLAN.xlsx`.

### 6. 💳 Pembayaran & Distribusi Perlengkapan
- **Pencatatan Pembayaran:** Catat transaksi DP, Pelunasan, dan Biaya Tambahan.
- **Cetak Kuitansi / Invoice PDF:** Generator otomatis dokumen bukti pembayaran resmi AWI Tour lengkap dengan kop surat dan tanda tangan kasir.
- **Ceklis 6 Item Perlengkapan:** Koper Bagasi, Koper Kabin, Tas Selempang, Kain Ihram/Mukena, Batik Seragam, dan Buku Doa, lengkap dengan tanggal penyerahan dan nama pengambil.

### 7. 📦 Arsip "Folder Sepemberangkatan" (ZIP) & Batch Print
- **Ekspor ZIP Terkategori:** Menghasilkan satu file ZIP kloter berisi subfolder rapi:
  ```
  📁 BATCH_[Tanggal]_[Nama_Paket]/
  ├── 📁 PASPOR/            # Arsip scan paspor seluruh jamaah
  ├── 📁 KTP/               # Arsip scan KTP seluruh jamaah
  ├── 📁 KK/                # Arsip scan Kartu Keluarga
  ├── 📁 VAKSIN/            # Arsip sertifikat vaksin
  ├── 📁 VISA/              # Arsip dokumen e-Visa
  └── 📄 README_RINGKASAN_KLOTER.txt
  ```
- **Batch Print Engine:** Sekali klik tombol "Cetak Massal Kloter" untuk menggabungkan seluruh dokumen e-Visa Arab Saudi dan Sertifikat Vaksinasi Internasional (ICV) Kemenkes RI berurutan sesuai nomor manifest. Siap dicetak langsung (`Ctrl + P`) untuk diselipkan ke paspor fisik jamaah.

### 8. 👥 Pemisahan Hak Akses (Role Switcher)
- **Admin Operasional:** Akses penuh untuk input data, edit berkas, validasi, plotting kamar & kursi, catat pembayaran, dan cetak dokumen.
- **Pimpinan / Owner:** Tampilan *read-only* untuk memantau kapasitas sisa kursi, arus kas pembayaran, dan audit kesiapan kloter tanpa khawatir mengubah data teknis.

---

## 🚀 Panduan Menjalankan Aplikasi di Komputer Kantor

### Prasyarat:
Pastikan komputer telah terinstal **Node.js** (versi 18 atau lebih baru).

### Langkah-langkah:
1. Buka terminal atau PowerShell di folder proyek:
   ```bash
   cd c:\KAIRAV\awi_project
   ```
2. Pasang dependensi proyek (hanya perlu dijalankan sekali saat setup pertama kali):
   ```bash
   npm install
   ```
3. Jalankan server aplikasi:
   ```bash
   npm run dev
   ```
4. Buka peramban (Google Chrome / Microsoft Edge) dan akses alamat:
   ```
   http://localhost:5175/
   ```

*(Aplikasi juga dapat diakses oleh komputer admin lain dalam satu jaringan WiFi kantor yang sama melalui alamat IP lokal yang tertera di terminal).*

---

## 📖 Panduan Alur Kerja Harian Admin (SOP Singkat)

```
[1. Buka Jadwal / Batch] 
         ↓
[2. Input Data Jamaah dari WA] ──(Sistem Cek Masking & Nama 3 Kata)
         ↓
[3. Catat Pembayaran DP] ──────(Cetak Kuitansi PDF untuk Jamaah)
         ↓
[4. Buka Halaman Validasi] ───(Pastikan 5 Rules Berwarna Hijau)
         ↓
[5. Unduh Manifest & Siskopatuh (.xlsx)] ──(Kirim ke Provider Visa & Kemenag)
         ↓
[6. Input Nomor e-Visa Saat Terbit]
         ↓
[7. Auto-Suggest Kamar Hotel & Kursi Pesawat]
         ↓
[8. Bagikan Perlengkapan (Koper, Batik, Ihram, Buku Doa)]
         ↓
[9. H-3: Unduh Arsip Kloter (ZIP) & Cetak Massal Visa + Vaksin]
```

---

## 📁 Struktur Dokumen Terkait

- 📄 [PRD.md](file:///c:/KAIRAV/awi_project/PRD.md) : Spesifikasi Kebutuhan Produk & Persyaratan Fungsional Bisnis.
- 📄 [todo.md](file:///c:/KAIRAV/awi_project/todo.md) : Daftar Fitur Selesai, SOP Harian Admin, dan Rencana Pengembangan Lanjutan.

---

**AWI TOUR HAJI & UMRAH YOGYAKARTA**  
*Melayani Perjalanan Ibadah dengan Amanah, Profesional, dan Terpercaya.*
