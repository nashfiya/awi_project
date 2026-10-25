# TODO & OPERATIONAL CHECKLIST
## Sistem Operasional AWI Tour Haji & Umrah Yogyakarta

Dokumen ini memuat daftar fitur yang telah selesai diimplementasikan, panduan checklist harian operasional admin, serta roadmap rencana pengembangan lanjutan.

---

### 1. Fitur Operasional yang Telah Selesai (Completed MVP)

- [x] **Manajemen Batch & Kuota Kursi Pesawat (Live Seat Tracker)**
  - [x] Pembuatan dan pengelolaan jadwal kloter keberangkatan (Maskapai, Hotel Makkah/Madinah, Kuota Seat).
  - [x] Indikator kapasitas kursi real-time (Kapasitas, Terisi, Sisa Kursi, Persentase Terisi).
  - [x] Peringatan visual saat kuota kursi sisa $\le 5$ kursi.

- [x] **Database & Form Input Jamaah Terpandu (Anti-Typo)**
  - [x] Masking otomatis NIK KTP (tepat 16 digit angka).
  - [x] Validasi pola nomor paspor Indonesia (1 huruf kapital + 7/8 angka).
  - [x] Konversi huruf kapital otomatis pada penulisan nama paspor.
  - [x] Deteksi otomatis suku kata nama: badge hijau jika $\ge 3$ kata, badge kuning jika $\le 2$ kata (butuh surat tambah nama/endorsement visa).
  - [x] Deteksi masa berlaku paspor: alert merah jika expired $< 180$ hari (6 bulan) sebelum tanggal keberangkatan.
  - [x] Pengelompokan keluarga menggunakan Nomor Kartu Keluarga (KK).
  - [x] Fitur **Pindah Jadwal (Mutasi Kloter)** tanpa perlu mengulang input data berkas.

- [x] **Halaman Validasi & Audit Kesiapan Dokumen (5 Rules)**
  - [x] Matriks audit kepatuhan otomatis untuk 5 aturan kritis:
    1. Paspor berlaku minimal 6 bulan.
    2. Nama minimal 3 kata.
    3. Kelengkapan 4 dokumen wajib (Paspor, KTP, KK, Vaksin).
    4. Format baku NIK & Paspor.
    5. Vaksinasi Meningitis & Polio terkonfirmasi.
  - [x] Modal pencatatan dan pembaruan nomor e-Visa Arab Saudi saat visa terbit.
  - [x] Filter cepat: Tampilkan Semua, Hanya Bermasalah, dan 100% Siap Berangkat.

- [x] **Generator Ekspor Dokumen Resmi**
  - [x] Ekspor **Manifest Visa (.xlsx)** format resmi provider visa dan muassasah Saudi.
  - [x] Ekspor **Siskopatuh Kemenag (.xlsx)** format resmi Kementerian Agama RI untuk penerbitan ID Card jamaah.
  - [x] Ekspor **Room List Hotel (.xlsx)**.
  - [x] Ekspor **Seat Plan Pesawat (.xlsx)**.

- [x] **Auto-Suggest & Visual Editor Room List (Kamar Hotel)**
  - [x] Algoritma otomatis mengelompokkan keluarga (berdasarkan No KK) ke kamar Quad, Triple, atau Double.
  - [x] Pemisahan ketat jamaah non-keluarga berdasarkan gender (Kamar Pria vs Kamar Wanita).
  - [x] Fitur interaktif *Click-to-Swap* untuk menukar atau memindahkan jamaah antar kamar.

- [x] **Auto-Suggest & Visual Editor Seat Plan (Kursi Pesawat)**
  - [x] Denah fisik kabin pesawat formasi 3 - 3 (Kursi A, B, C [Lorong] D, E, F).
  - [x] Penempatan prioritas lansia di baris depan (Row 1-4) dan posisi kursi lorong (*Aisle*).
  - [x] Penempatan keluarga dalam 1 KK duduk berdampingan.
  - [x] Fitur interaktif *Click-to-Swap* untuk menukar posisi kursi penumpang.

- [x] **Pembayaran (DP/Pelunasan) & Cetak Kuitansi PDF**
  - [x] Pencatatan riwayat transaksi DP, Pelunasan, dan Biaya Tambahan.
  - [x] Perhitungan otomatis total omset, kas masuk, dan sisa piutang.
  - [x] Generator otomatis **Kuitansi / Invoice Pembayaran Resmi AWI Tour (PDF)** lengkap dengan kop surat dan tanda tangan kasir.

- [x] **Distribusi Perlengkapan Jamaah**
  - [x] Ceklis 6 item perlengkapan: Koper Bagasi, Koper Kabin, Tas Selempang, Kain Ihram/Mukena, Batik Seragam, Buku Doa.
  - [x] Pencatatan tanggal penyerahan dan nama penerima.
  - [x] Tombol cepat "Tandai Semua Lengkap (6/6)".

- [x] **Pengarsipan Folder Sepemberangkatan (ZIP Terkategori)**
  - [x] Generator satu klik file ZIP berisi subfolder: `PASPOR/`, `KTP/`, `KK/`, `VAKSIN/`, `VISA/`, serta berkas ringkasan manifest.

- [x] **Batch Print Engine (Cetak Massal Dokumen Kloter)**
  - [x] Tampilan cetak gabungan e-Visa Arab Saudi dan Sertifikat Vaksinasi Internasional (ICV) Kemenkes RI untuk seluruh jamaah kloter berurutan nomor manifest.
  - [x] Tata letak rapi per halaman (`@media print`) siap cetak sekali tekan untuk diselipkan ke paspor fisik jamaah.

- [x] **Role Switcher Pengguna**
  - [x] Mode **Admin Operasional** (Akses penuh input, edit, plotting, validasi, dan cetak).
  - [x] Mode **Pimpinan / Owner** (Akses pantau *read-only* untuk kuota kursi, keuangan, dan audit kesiapan kloter).

---

### 2. Standar Operasional Prosedur (SOP) Harian Admin

Gunakan alur checklist berikut saat memproses jamaah untuk keberangkatan:

- [ ] **Langkah 1: Terima Berkas Pendaftaran dari WhatsApp**
  - [ ] Simpan foto KTP, KK, Scan Paspor Asli, Akta/Nikah, dan Sertifikat Vaksin ke komputer.
- [ ] **Langkah 2: Input Data Jamaah di Menu 'Database Jamaah'**
  - [ ] Ketik Nomor Paspor (pastikan format 1 huruf + 7/8 angka).
  - [ ] Ketik Nama Lengkap (cek indikator: pastikan minimal 3 kata).
  - [ ] Masukkan NIK (16 digit) dan Nomor KK (16 digit).
  - [ ] Periksa tanggal kadaluwarsa paspor (pastikan tidak muncul alert merah $< 6$ bulan).
  - [ ] Centang jenis berkas fisik yang sudah diterima.
- [ ] **Langkah 3: Catat Pembayaran Uang Muka (DP)**
  - [ ] Buka tab *Pembayaran & Perlengkapan*.
  - [ ] Klik `+ Catat Pembayaran / DP`, masukkan nominal pembayaran, dan unduh Kuitansi PDF untuk diserahkan ke jamaah.
- [ ] **Langkah 4: Lakukan Audit di 'Halaman Validasi'**
  - [ ] Buka menu *Validasi, Manifest & Siskopatuh*.
  - [ ] Filter jamaah yang memiliki lampu merah/kuning dan tindak lanjuti (misal: pengurusan surat tambah nama atau perpanjangan paspor).
- [ ] **Langkah 5: Ekspor Dokumen Resmi**
  - [ ] Klik `Download Manifest Visa (.xlsx)` dan serahkan ke bagian/provider pembuatan visa.
  - [ ] Klik `Download Siskopatuh (.xlsx)` untuk pendaftaran ke sistem Kemenag dan penerbitan ID Card.
- [ ] **Langkah 6: Input Nomor Visa Terbit**
  - [ ] Setelah visa terbit dari Kedutaan/Provider, klik tombol `+ No Visa` pada masing-masing jamaah dan masukkan nomor visa.
- [ ] **Langkah 7: Atur Kamar Hotel & Kursi Pesawat**
  - [ ] Buka tab *Room List (Kamar)*, jalankan auto-suggest, lalu sesuaikan jika ada permintaan khusus jamaah.
  - [ ] Buka tab *Seat Plan (Pesawat)*, pastikan lansia di kursi lorong dan keluarga duduk berdampingan.
- [ ] **Langkah 8: Distribusi Perlengkapan**
  - [ ] Centang koper, seragam batik, ihram/mukena, tas selempang, dan buku doa saat diambil jamaah.
- [ ] **Langkah 9: Arsip & Cetak Pra-Keberangkatan (H-3)**
  - [ ] Unduh `Arsip Kloter (ZIP)` untuk dokumentasi dan arsip kantor.
  - [ ] Klik `Cetak Massal Kloter` dan tekan `Ctrl + P` untuk mencetak lembar visa dan sertifikat vaksin seluruh jamaah sekaligus, lalu selipkan ke sampul paspor masing-masing.

---

### 3. Rencana Pengembangan Lanjutan (Future Backlog)

- [ ] **Fase 2: Backend & Database Terpusat Multi-PC**
  - [ ] Pembuatan API backend (Node.js Express / NestJS) dan Database SQL (PostgreSQL / MySQL) agar data tersinkronisasi otomatis antar PC staf kantor.
  - [ ] Manajemen login akun pengguna dengan kata sandi (Password & JWT Auth).
- [ ] **Fase 3: Cloud Storage untuk Berkas Asli**
  - [ ] Integrasi penyimpanan file cloud (Amazon S3 / Google Cloud Storage / Supabase Storage) untuk menyimpan file scan resolusi tinggi paspor dan KTP tanpa membebani memori browser.
- [ ] **Fase 4: Otomatisasi & Integrasi Eksternal**
  - [ ] Integrasi WhatsApp Gateway (WABlas / Fonnte) untuk otomatis mengirimkan kuitansi PDF dan jadwal keberangkatan ke nomor WA jamaah.
  - [ ] Fitur OCR Scanner (Optical Character Recognition) untuk membaca kode MRZ pada foto paspor secara otomatis.
