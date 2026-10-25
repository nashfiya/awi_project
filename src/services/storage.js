// Local Storage Service for AWI Tour Haji & Umrah Yogyakarta
const STORAGE_KEYS = {
  BATCHES: 'awi_batches_v1',
  JAMAAH: 'awi_jamaah_v1',
  PAYMENTS: 'awi_payments_v1',
  EQUIPMENT: 'awi_equipment_v1',
  DOCUMENTS: 'awi_documents_v1',
  ROOMS: 'awi_rooms_v1',
  SEATS: 'awi_seats_v1',
  ACTIVE_BATCH_ID: 'awi_active_batch_v1',
  USER_ROLE: 'awi_user_role_v1',
};

const DEFAULT_BATCHES = [
  {
    id: 'BATCH-2026-12-15',
    namaPaket: 'Umrah Reguler Awal Ramadhan 9 Hari',
    tanggalBerangkat: '2026-12-15',
    tanggalPulang: '2026-12-24',
    kuotaSeat: 45,
    maskapai: 'Saudia Airlines (SV-819)',
    hotelMakkah: 'Pullman Zamzam Makkah (Bintang 5)',
    hotelMadinah: 'Madinah Hilton (Bintang 5)',
    hargaQuad: 32500000,
    hargaTriple: 34500000,
    hargaDouble: 37500000,
    status: 'OPEN',
  },
  {
    id: 'BATCH-2027-01-20',
    namaPaket: 'Umrah Plus Turki 12 Hari',
    tanggalBerangkat: '2027-01-20',
    tanggalPulang: '2027-02-01',
    kuotaSeat: 40,
    maskapai: 'Turkish Airlines (TK-57)',
    hotelMakkah: 'Swissotel Al Maqam Makkah',
    hotelMadinah: 'Movenpick Anwar Madinah',
    hargaQuad: 38500000,
    hargaTriple: 40500000,
    hargaDouble: 43500000,
    status: 'OPEN',
  }
];

const DEFAULT_JAMAAH = [
  {
    id: 'JAMAAH-001',
    batchId: 'BATCH-2026-12-15',
    noPaspor: 'B1234567',
    namaPaspor: 'AHMAD DAHLAN PRATAMA',
    nik: '3404011504820001',
    noKk: '3404011203850001',
    statusDalamKk: 'Kepala Keluarga',
    tanggalLahir: '1982-04-15',
    jenisKelamin: 'L',
    masaBerlakuPaspor: '2032-05-10',
    statusVaksin: 'Lengkap (Meningitis & Polio)',
    paketKamar: 'QUAD',
    statusJamaah: 'LUNAS',
    noVisa: 'VISA-SA-982104',
    catatan: 'Keluarga Ahmad',
  },
  {
    id: 'JAMAAH-002',
    batchId: 'BATCH-2026-12-15',
    noPaspor: 'B1234568',
    namaPaspor: 'SITI AISYAH NURJANAH',
    nik: '3404015208850002',
    noKk: '3404011203850001',
    statusDalamKk: 'Istri',
    tanggalLahir: '1985-08-12',
    jenisKelamin: 'P',
    masaBerlakuPaspor: '2032-05-10',
    statusVaksin: 'Lengkap (Meningitis & Polio)',
    paketKamar: 'QUAD',
    statusJamaah: 'LUNAS',
    noVisa: 'VISA-SA-982105',
    catatan: 'Keluarga Ahmad',
  },
  {
    id: 'JAMAAH-003',
    batchId: 'BATCH-2026-12-15',
    noPaspor: 'B1234569',
    namaPaspor: 'MUHAMMAD FAIZ PRATAMA',
    nik: '3404011002100003',
    noKk: '3404011203850001',
    statusDalamKk: 'Anak',
    tanggalLahir: '2010-02-10',
    jenisKelamin: 'L',
    masaBerlakuPaspor: '2030-08-15',
    statusVaksin: 'Lengkap (Meningitis & Polio)',
    paketKamar: 'QUAD',
    statusJamaah: 'LUNAS',
    noVisa: 'VISA-SA-982106',
    catatan: 'Keluarga Ahmad',
  },
  {
    id: 'JAMAAH-004',
    batchId: 'BATCH-2026-12-15',
    noPaspor: 'B1234570',
    namaPaspor: 'FATIMAH AZ ZAHRA',
    nik: '3404016507140004',
    noKk: '3404011203850001',
    statusDalamKk: 'Anak',
    tanggalLahir: '2014-07-25',
    jenisKelamin: 'P',
    masaBerlakuPaspor: '2030-08-15',
    statusVaksin: 'Lengkap (Meningitis & Polio)',
    paketKamar: 'QUAD',
    statusJamaah: 'LUNAS',
    noVisa: 'VISA-SA-982107',
    catatan: 'Keluarga Ahmad',
  },
  {
    id: 'JAMAAH-005',
    batchId: 'BATCH-2026-12-15',
    noPaspor: 'B2345678',
    namaPaspor: 'BAMBANG PAMUNGKAS', // 2 words (Warning Endorsement)
    nik: '3404021203800001',
    noKk: '3404021203800002',
    statusDalamKk: 'Kepala Keluarga',
    tanggalLahir: '1980-03-12',
    jenisKelamin: 'L',
    masaBerlakuPaspor: '2031-11-20',
    statusVaksin: 'Lengkap (Meningitis & Polio)',
    paketKamar: 'DOUBLE',
    statusJamaah: 'DP',
    noVisa: '',
    catatan: 'Butuh surat endorsement nama 3 kata',
  },
  {
    id: 'JAMAAH-006',
    batchId: 'BATCH-2026-12-15',
    noPaspor: 'B2345679',
    namaPaspor: 'ENDAH LESTARI WIDODO',
    nik: '3404025005830002',
    noKk: '3404021203800002',
    statusDalamKk: 'Istri',
    tanggalLahir: '1983-05-10',
    jenisKelamin: 'P',
    masaBerlakuPaspor: '2031-11-20',
    statusVaksin: 'Lengkap (Meningitis & Polio)',
    paketKamar: 'DOUBLE',
    statusJamaah: 'DP',
    noVisa: '',
    catatan: '',
  },
  {
    id: 'JAMAAH-007',
    batchId: 'BATCH-2026-12-15',
    noPaspor: 'A9876543',
    namaPaspor: 'HADI SURYO PRANOTO',
    nik: '3404031908750001',
    noKk: '3404031908750003',
    statusDalamKk: 'Kepala Keluarga',
    tanggalLahir: '1975-08-19',
    jenisKelamin: 'L',
    masaBerlakuPaspor: '2027-02-10', // CRITICAL: < 6 months from 2026-12-15!
    statusVaksin: 'Hanya Meningitis (Polio Belum)',
    paketKamar: 'TRIPLE',
    statusJamaah: 'DP',
    noVisa: '',
    catatan: 'PERINGATAN: Paspor expired kurang dari 6 bulan!',
  },
  {
    id: 'JAMAAH-008',
    batchId: 'BATCH-2026-12-15',
    noPaspor: 'B3456789',
    namaPaspor: 'RATNA DEWI KUSUMA',
    nik: '3404044101900001',
    noKk: '3404044101900004',
    statusDalamKk: 'Kepala Keluarga',
    tanggalLahir: '1990-01-01',
    jenisKelamin: 'P',
    masaBerlakuPaspor: '2033-01-12',
    statusVaksin: 'Belum Vaksin',
    paketKamar: 'TRIPLE',
    statusJamaah: 'TERDAFTAR',
    noVisa: '',
    catatan: 'Belum setor sertifikat vaksin',
  },
  {
    id: 'JAMAAH-009',
    batchId: 'BATCH-2026-12-15',
    noPaspor: 'B4567890',
    namaPaspor: 'SUTRISNO WARDOYO KARTODIRJO', // Lansia (Usia 74)
    nik: '3404051204520001',
    noKk: '3404051204520005',
    statusDalamKk: 'Kepala Keluarga',
    tanggalLahir: '1952-04-12',
    jenisKelamin: 'L',
    masaBerlakuPaspor: '2031-07-22',
    statusVaksin: 'Lengkap (Meningitis & Polio)',
    paketKamar: 'TRIPLE',
    statusJamaah: 'LUNAS',
    noVisa: 'VISA-SA-982108',
    catatan: 'Prioritas kursi lorong & dekat pintu (Lansia)',
  },
  {
    id: 'JAMAAH-010',
    batchId: 'BATCH-2026-12-15',
    noPaspor: 'B5678901',
    namaPaspor: 'RUDI HARTONO WIJAYA',
    nik: '3404061806880001',
    noKk: '3404061806880006',
    statusDalamKk: 'Kepala Keluarga',
    tanggalLahir: '1988-06-18',
    jenisKelamin: 'L',
    masaBerlakuPaspor: '2032-09-01',
    statusVaksin: 'Lengkap (Meningitis & Polio)',
    paketKamar: 'QUAD',
    statusJamaah: 'DP',
    noVisa: '',
    catatan: '',
  },
  {
    id: 'JAMAAH-011',
    batchId: 'BATCH-2026-12-15',
    noPaspor: 'B6789012',
    namaPaspor: 'JOKO ANWAR SASMITO',
    nik: '3404071510860001',
    noKk: '3404071510860007',
    statusDalamKk: 'Kepala Keluarga',
    tanggalLahir: '1986-10-15',
    jenisKelamin: 'L',
    masaBerlakuPaspor: '2032-10-15',
    statusVaksin: 'Lengkap (Meningitis & Polio)',
    paketKamar: 'QUAD',
    statusJamaah: 'DP',
    noVisa: '',
    catatan: '',
  },
  {
    id: 'JAMAAH-012',
    batchId: 'BATCH-2026-12-15',
    noPaspor: 'B7890123',
    namaPaspor: 'NURUL HIDAYAH FITRI',
    nik: '3404086003920001',
    noKk: '3404086003920008',
    statusDalamKk: 'Kepala Keluarga',
    tanggalLahir: '1992-03-20',
    jenisKelamin: 'P',
    masaBerlakuPaspor: '2032-03-20',
    statusVaksin: 'Lengkap (Meningitis & Polio)',
    paketKamar: 'QUAD',
    statusJamaah: 'DP',
    noVisa: '',
    catatan: '',
  }
];

const DEFAULT_DOCUMENTS = {
  'JAMAAH-001': { paspor: true, ktp: true, kk: true, aktaNikah: true, vaksin: true, visa: true },
  'JAMAAH-002': { paspor: true, ktp: true, kk: true, aktaNikah: true, vaksin: true, visa: true },
  'JAMAAH-003': { paspor: true, ktp: true, kk: true, aktaNikah: true, vaksin: true, visa: true },
  'JAMAAH-004': { paspor: true, ktp: true, kk: true, aktaNikah: true, vaksin: true, visa: true },
  'JAMAAH-005': { paspor: true, ktp: true, kk: true, aktaNikah: true, vaksin: true, visa: false },
  'JAMAAH-006': { paspor: true, ktp: true, kk: true, aktaNikah: true, vaksin: true, visa: false },
  'JAMAAH-007': { paspor: true, ktp: true, kk: true, aktaNikah: false, vaksin: true, visa: false },
  'JAMAAH-008': { paspor: true, ktp: true, kk: false, aktaNikah: false, vaksin: false, visa: false }, // Belum lengkap!
  'JAMAAH-009': { paspor: true, ktp: true, kk: true, aktaNikah: true, vaksin: true, visa: true },
  'JAMAAH-010': { paspor: true, ktp: true, kk: true, aktaNikah: true, vaksin: true, visa: false },
  'JAMAAH-011': { paspor: true, ktp: true, kk: true, aktaNikah: true, vaksin: true, visa: false },
  'JAMAAH-012': { paspor: true, ktp: true, kk: true, aktaNikah: true, vaksin: true, visa: false },
};

const DEFAULT_PAYMENTS = [
  { id: 'PAY-001', jamaahId: 'JAMAAH-001', nominal: 10000000, tipe: 'DP', tanggal: '2026-09-01', noInvoice: 'INV-AWI-001' },
  { id: 'PAY-002', jamaahId: 'JAMAAH-001', nominal: 22500000, tipe: 'PELUNASAN', tanggal: '2026-10-15', noInvoice: 'INV-AWI-002' },
  { id: 'PAY-003', jamaahId: 'JAMAAH-002', nominal: 32500000, tipe: 'PELUNASAN', tanggal: '2026-10-15', noInvoice: 'INV-AWI-003' },
  { id: 'PAY-004', jamaahId: 'JAMAAH-005', nominal: 10000000, tipe: 'DP', tanggal: '2026-09-10', noInvoice: 'INV-AWI-004' },
  { id: 'PAY-005', jamaahId: 'JAMAAH-007', nominal: 10000000, tipe: 'DP', tanggal: '2026-09-12', noInvoice: 'INV-AWI-005' },
];

const DEFAULT_EQUIPMENT = {
  'JAMAAH-001': { koperBagasi: true, koperKabin: true, tasSelempang: true, kainIhramMukena: true, batik: true, bukuDoa: true, tglAmbil: '2026-10-18', penerima: 'Ahmad Dahlan' },
  'JAMAAH-002': { koperBagasi: true, koperKabin: true, tasSelempang: true, kainIhramMukena: true, batik: true, bukuDoa: true, tglAmbil: '2026-10-18', penerima: 'Ahmad Dahlan' },
  'JAMAAH-003': { koperBagasi: true, koperKabin: true, tasSelempang: true, kainIhramMukena: true, batik: true, bukuDoa: true, tglAmbil: '2026-10-18', penerima: 'Ahmad Dahlan' },
  'JAMAAH-004': { koperBagasi: true, koperKabin: true, tasSelempang: true, kainIhramMukena: true, batik: true, bukuDoa: true, tglAmbil: '2026-10-18', penerima: 'Ahmad Dahlan' },
  'JAMAAH-005': { koperBagasi: true, koperKabin: false, tasSelempang: true, kainIhramMukena: false, batik: true, bukuDoa: false, tglAmbil: '', penerima: '' },
  'JAMAAH-009': { koperBagasi: true, koperKabin: true, tasSelempang: true, kainIhramMukena: true, batik: true, bukuDoa: true, tglAmbil: '2026-10-20', penerima: 'Sutrisno Wardoyo' },
};

// Storage Helpers
export const storage = {
  getBatches: () => {
    const data = localStorage.getItem(STORAGE_KEYS.BATCHES);
    return data ? JSON.parse(data) : DEFAULT_BATCHES;
  },
  saveBatches: (batches) => {
    localStorage.setItem(STORAGE_KEYS.BATCHES, JSON.stringify(batches));
  },
  
  getJamaah: () => {
    const data = localStorage.getItem(STORAGE_KEYS.JAMAAH);
    return data ? JSON.parse(data) : DEFAULT_JAMAAH;
  },
  saveJamaah: (jamaahList) => {
    localStorage.setItem(STORAGE_KEYS.JAMAAH, JSON.stringify(jamaahList));
  },

  getDocuments: () => {
    const data = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
    return data ? JSON.parse(data) : DEFAULT_DOCUMENTS;
  },
  saveDocuments: (docs) => {
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(docs));
  },

  getPayments: () => {
    const data = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    return data ? JSON.parse(data) : DEFAULT_PAYMENTS;
  },
  savePayments: (payments) => {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
  },

  getEquipment: () => {
    const data = localStorage.getItem(STORAGE_KEYS.EQUIPMENT);
    return data ? JSON.parse(data) : DEFAULT_EQUIPMENT;
  },
  saveEquipment: (eq) => {
    localStorage.setItem(STORAGE_KEYS.EQUIPMENT, JSON.stringify(eq));
  },

  getActiveBatchId: () => {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_BATCH_ID) || DEFAULT_BATCHES[0].id;
  },
  setActiveBatchId: (id) => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_BATCH_ID, id);
  },

  getUserRole: () => {
    return localStorage.getItem(STORAGE_KEYS.USER_ROLE) || 'ADMIN'; // 'ADMIN' or 'OWNER'
  },
  setUserRole: (role) => {
    localStorage.setItem(STORAGE_KEYS.USER_ROLE, role);
  },

  resetToDefault: () => {
    localStorage.clear();
    window.location.reload();
  }
};
