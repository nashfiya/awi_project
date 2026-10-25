import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { jsPDF } from 'jspdf';

// 1. Ekspor Format Manifest Visa (Standar Provider Visa & Muassasah Saudi)
export const exportManifestExcel = (batch, jamaahList) => {
  const manifestData = jamaahList.map((j, index) => {
    // hitung umur
    const birthYear = new Date(j.tanggalLahir).getFullYear();
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;

    return {
      'NO': index + 1,
      'FULL NAME (SESUAI PASPOR)': j.namaPaspor,
      'PASSPORT NUMBER': j.noPaspor,
      'NATIONALITY': 'INDONESIA',
      'GENDER': j.jenisKelamin === 'L' ? 'MALE' : 'FEMALE',
      'DATE OF BIRTH': j.tanggalLahir,
      'AGE': age,
      'PASSPORT EXIRY DATE': j.masaBerlakuPaspor,
      'ROOM TYPE': j.paketKamar,
      'FAMILY RELATION / KK': j.statusDalamKk + ` (No KK: ${j.noKk})`,
      'VISA STATUS': j.noVisa ? `ISSUED (${j.noVisa})` : 'PENDING',
      'REMARKS / SPECIAL REQUEST': j.catatan || '-',
    };
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(manifestData);

  // set header styling & width
  const wscols = [
    { wch: 5 },  // No
    { wch: 32 }, // Name
    { wch: 18 }, // Passport No
    { wch: 14 }, // Nationality
    { wch: 10 }, // Gender
    { wch: 15 }, // DOB
    { wch: 8 },  // Age
    { wch: 18 }, // Expire
    { wch: 12 }, // Room
    { wch: 30 }, // Family
    { wch: 22 }, // Visa
    { wch: 30 }, // Remarks
  ];
  ws['!cols'] = wscols;

  XLSX.utils.book_append_sheet(wb, ws, 'MANIFEST_VISA');
  const filename = `MANIFEST_VISA_${batch.namaPaket.replace(/\s+/g, '_')}_${batch.tanggalBerangkat}.xlsx`;
  XLSX.writeFile(wb, filename);
};

// 2. Ekspor Format Siskopatuh Resmi Kemenag
export const exportSiskopatuhExcel = (batch, jamaahList) => {
  const siskopatuhData = jamaahList.map((j, index) => {
    return {
      'NO': index + 1,
      'NOMOR PORSI / REG': `AWI-${batch.tanggalBerangkat.replace(/-/g, '')}-${String(index + 1).padStart(3, '0')}`,
      'NIK': j.nik,
      'NO PASPOR': j.noPaspor,
      'NAMA LENGKAP': j.namaPaspor,
      'JENIS KELAMIN': j.jenisKelamin === 'L' ? 'LAKI-LAKI' : 'PEREMPUAN',
      'TEMPAT LAHIR': 'YOGYAKARTA',
      'TANGGAL LAHIR': j.tanggalLahir,
      'NOMOR KK': j.noKk,
      'STATUS DALAM KELUARGA': j.statusDalamKk,
      'STATUS VAKSIN MENINGITIS & POLIO': j.statusVaksin,
      'TGL BERLAKU PASPOR': j.masaBerlakuPaspor,
      'PAKET UMRAH': batch.namaPaket,
      'TANGGAL BERANGKAT': batch.tanggalBerangkat,
      'TANGGAL KEPULANGAN': batch.tanggalPulang,
      'MASKAPAI': batch.maskapai,
      'HOTEL MAKKAH': batch.hotelMakkah,
      'HOTEL MADINAH': batch.hotelMadinah,
    };
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(siskopatuhData);

  ws['!cols'] = [
    { wch: 5 },  // No
    { wch: 22 }, // Reg
    { wch: 20 }, // NIK
    { wch: 16 }, // Paspor
    { wch: 30 }, // Nama
    { wch: 14 }, // JK
    { wch: 16 }, // Tempat Lahir
    { wch: 14 }, // Tgl Lahir
    { wch: 20 }, // No KK
    { wch: 20 }, // Hub KK
    { wch: 30 }, // Vaksin
    { wch: 18 }, // Berlaku Paspor
    { wch: 32 }, // Paket
    { wch: 16 }, // Berangkat
    { wch: 16 }, // Pulang
    { wch: 25 }, // Maskapai
    { wch: 25 }, // Hotel Makkah
    { wch: 25 }, // Hotel Madinah
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'SISKOPATUH_KEMENAG');
  const filename = `SISKOPATUH_KEMENAG_${batch.namaPaket.replace(/\s+/g, '_')}_${batch.tanggalBerangkat}.xlsx`;
  XLSX.writeFile(wb, filename);
};

// 3. Ekspor Room List Hotel Excel
export const exportRoomListExcel = (batch, rooms) => {
  const roomData = [];
  rooms.forEach((room) => {
    room.jamaahList.forEach((j, idx) => {
      roomData.push({
        'NO KAMAR': room.roomNumber,
        'TIPE KAMAR': room.roomType,
        'GENDER / KELUARGA': room.category,
        'BED NO': idx + 1,
        'NAMA JAMAAH': j.namaPaspor,
        'NO PASPOR': j.noPaspor,
        'JENIS KELAMIN': j.jenisKelamin === 'L' ? 'LAKI-LAKI' : 'PEREMPUAN',
        'NO KK': j.noKk,
        'STATUS KK': j.statusDalamKk,
      });
    });
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(roomData);
  ws['!cols'] = [
    { wch: 12 }, { wch: 12 }, { wch: 20 }, { wch: 8 }, { wch: 30 }, { wch: 16 }, { wch: 14 }, { wch: 20 }, { wch: 16 }
  ];
  XLSX.utils.book_append_sheet(wb, ws, 'ROOM_LIST');
  XLSX.writeFile(wb, `ROOM_LIST_${batch.namaPaket.replace(/\s+/g, '_')}.xlsx`);
};

// 4. Ekspor Seat Plan Pesawat Excel
export const exportSeatPlanExcel = (batch, seats) => {
  const seatData = seats.map((s) => ({
    'KURSI': s.seatCode,
    'BARIS': s.row,
    'KOLOM': s.col,
    'TIPE SEAT': s.isAisle ? 'AISLE / LORONG' : 'REGULER',
    'NAMA JAMAAH': s.jamaah ? s.jamaah.namaPaspor : 'KOSONG',
    'NO PASPOR': s.jamaah ? s.jamaah.noPaspor : '-',
    'GENDER': s.jamaah ? (s.jamaah.jenisKelamin === 'L' ? 'L' : 'P') : '-',
    'NO KK (KELUARGA)': s.jamaah ? s.jamaah.noKk : '-',
    'CATATAN': s.isElderly ? 'LANSIA PRIORITAS' : '-',
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(seatData);
  ws['!cols'] = [
    { wch: 10 }, { wch: 8 }, { wch: 8 }, { wch: 16 }, { wch: 30 }, { wch: 16 }, { wch: 10 }, { wch: 20 }, { wch: 18 }
  ];
  XLSX.utils.book_append_sheet(wb, ws, 'SEAT_PLAN');
  XLSX.writeFile(wb, `SEAT_PLAN_${batch.namaPaket.replace(/\s+/g, '_')}.xlsx`);
};

// 5. Ekspor Folder Sepemberangkatan (ZIP Terkategori)
export const exportZipPackage = async (batch, jamaahList, documents) => {
  const zip = new JSZip();
  const rootFolderName = `BATCH_${batch.tanggalBerangkat}_${batch.namaPaket.replace(/\s+/g, '_')}`;
  const rootFolder = zip.folder(rootFolderName);

  // Buat subfolder kategori berkas
  const pasporFolder = rootFolder.folder('PASPOR');
  const ktpFolder = rootFolder.folder('KTP');
  const kkFolder = rootFolder.folder('KK');
  const vaksinFolder = rootFolder.folder('VAKSIN');
  const visaFolder = rootFolder.folder('VISA');
  const aktaFolder = rootFolder.folder('AKTA_DAN_BUKU_NIKAH');

  // Isi file placeholder / scan asli per jamaah
  jamaahList.forEach((j) => {
    const safeName = j.namaPaspor.replace(/\s+/g, '_');
    const docMeta = documents[j.id] || {};

    if (docMeta.paspor) {
      pasporFolder.file(
        `${j.noPaspor}_${safeName}_PASPOR.txt`,
        `ARSIP DOKUMEN PASPOR RESMI\nNama: ${j.namaPaspor}\nNo Paspor: ${j.noPaspor}\nMasa Berlaku: ${j.masaBerlakuPaspor}\nAWI Tour Haji & Umrah Yogyakarta`
      );
    }
    if (docMeta.ktp) {
      ktpFolder.file(
        `${j.nik}_${safeName}_KTP.txt`,
        `ARSIP KTP ELEKTRONIK\nNama: ${j.namaPaspor}\nNIK: ${j.nik}\nAWI Tour Haji & Umrah Yogyakarta`
      );
    }
    if (docMeta.kk) {
      kkFolder.file(
        `${j.noKk}_${safeName}_KK.txt`,
        `ARSIP KARTU KELUARGA\nNo KK: ${j.noKk}\nNama Anggota: ${j.namaPaspor}\nHubungan: ${j.statusDalamKk}`
      );
    }
    if (docMeta.vaksin) {
      vaksinFolder.file(
        `VAKSIN_${safeName}.txt`,
        `SERTIFIKAT VAKSINASI INTERNASIONAL (ICV)\nNama: ${j.namaPaspor}\nJenis Vaksin: ${j.statusVaksin}\nStatus: Terverifikasi Kemenkes`
      );
    }
    if (j.noVisa) {
      visaFolder.file(
        `VISA_${j.noVisa}_${safeName}.txt`,
        `ELECTRONIC VISA ARAB SAUDI\nNama: ${j.namaPaspor}\nNo Visa: ${j.noVisa}\nNo Paspor: ${j.noPaspor}\nMuassasah / Provider: AWI Tour Yogyakarta`
      );
    }
  });

  // Tambahkan file info Manifest Ringkasan ke dalam ZIP
  const manifestSummary = `RINGKASAN BATCH OPERASIONAL AWI TOUR YOGYAKARTA\n` +
    `Paket: ${batch.namaPaket}\n` +
    `Tanggal: ${batch.tanggalBerangkat} s/d ${batch.tanggalPulang}\n` +
    `Total Jamaah Terdaftar: ${jamaahList.length} orang\n` +
    `Maskapai: ${batch.maskapai}\n` +
    `Hotel Makkah: ${batch.hotelMakkah}\n` +
    `Hotel Madinah: ${batch.hotelMadinah}\n\n` +
    `DAFTAR JAMAAH:\n` +
    jamaahList.map((j, i) => `${i + 1}. [${j.noPaspor}] ${j.namaPaspor} - Status: ${j.statusJamaah}`).join('\n');

  rootFolder.file('README_RINGKASAN_KLOTER.txt', manifestSummary);

  // Generate ZIP blob and trigger download
  const content = await zip.generateAsync({ type: 'blob' });
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(content);
  downloadLink.download = `${rootFolderName}.zip`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
};

// 6. Generate Invoice PDF Resmi AWI Tour
export const generateInvoicePDF = (jamaah, payment, batch) => {
  const doc = new jsPDF();

  // Header Travel
  doc.setFillColor(6, 78, 59); // deep emerald
  doc.rect(0, 0, 210, 36, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('AWI TOUR HAJI & UMRAH', 15, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Kantor Operasional: Jl. Kaliurang KM 9, Sleman, D.I. Yogyakarta', 15, 26);
  doc.text('Telepon: (0274) 889977 | WhatsApp: 0812-3456-7890 | Izin PPIU Kemenag RI', 15, 31);

  // Judul Bukti Pembayaran
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('KUITANSI BUKTI PEMBAYARAN', 15, 48);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Nomor Invoice : ${payment.noInvoice}`, 15, 56);
  doc.text(`Tanggal Bayar : ${payment.tanggal}`, 15, 62);
  doc.text(`Tipe Bayar    : ${payment.tipe}`, 15, 68);

  // Kotak Rincian Jamaah & Paket
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, 74, 180, 48, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('DATA JAMAAH & PAKET', 20, 83);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Nama Lengkap   : ${jamaah.namaPaspor}`, 20, 91);
  doc.text(`Nomor Paspor   : ${jamaah.noPaspor}`, 20, 98);
  doc.text(`NIK            : ${jamaah.nik}`, 20, 105);
  doc.text(`Paket Kamar    : ${jamaah.paketKamar}`, 20, 112);

  doc.text(`Paket Umrah    : ${batch.namaPaket}`, 110, 91);
  doc.text(`Keberangkatan  : ${batch.tanggalBerangkat}`, 110, 98);
  doc.text(`Maskapai       : ${batch.maskapai}`, 110, 105);

  // Rincian Pembayaran
  doc.setFillColor(236, 253, 245);
  doc.setDrawColor(167, 243, 208);
  doc.roundedRect(15, 128, 180, 32, 3, 3, 'FD');

  doc.setTextColor(4, 120, 87);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('JUMLAH DITERIMA:', 22, 140);
  doc.setFontSize(16);
  doc.text(`Rp ${payment.nominal.toLocaleString('id-ID')}`, 22, 150);

  // Tanda Tangan
  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Yogyakarta, ' + new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }), 140, 180);
  doc.text('Bagian Keuangan AWI Tour,', 140, 186);

  doc.setFont('helvetica', 'bold');
  doc.text('( Bagian Kasir & Admin Operasional )', 130, 215);

  doc.save(`INVOICE_${payment.noInvoice}_${jamaah.namaPaspor.replace(/\s+/g, '_')}.pdf`);
};
