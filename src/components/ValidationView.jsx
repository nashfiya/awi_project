import React, { useState } from 'react';
import { 
  FileCheck, 
  Download, 
  Printer, 
  Archive, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  FileSpreadsheet,
  Upload,
  Eye,
  Check,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { 
  exportManifestExcel, 
  exportSiskopatuhExcel, 
  exportZipPackage 
} from '../services/exportService';

export default function ValidationView({
  batch,
  jamaahList,
  documents,
  onUpdateJamaahVisa,
  onOpenBatchPrint
}) {
  const [filterMode, setFilterMode] = useState('ALL'); // 'ALL', 'ISSUES_ONLY', 'READY_ONLY'
  const [selectedVisaJamaah, setSelectedVisaJamaah] = useState(null);
  const [visaInputNumber, setVisaInputNumber] = useState('');
  const [isZipping, setIsZipping] = useState(false);

  const departureDate = new Date(batch.tanggalBerangkat);

  // Evaluasi 5 Aturan Validasi untuk Tiap Jamaah
  const auditedJamaah = jamaahList.map((j) => {
    // 1. Paspor Minimal 6 Bulan (180 hari)
    const expiryDate = new Date(j.masaBerlakuPaspor);
    const diffDays = Math.ceil((expiryDate - departureDate) / (1000 * 60 * 60 * 24));
    const rulePassportValid = diffDays >= 180;

    // 2. Nama Minimal 3 Suku Kata
    const words = j.namaPaspor.trim().split(/\s+/).filter(Boolean);
    const ruleNameThreeWords = words.length >= 3;

    // 3. Kelengkapan 4 Dokumen Wajib
    const docMeta = documents[j.id] || {};
    const missingDocs = [];
    if (!docMeta.paspor) missingDocs.push('Paspor');
    if (!docMeta.ktp) missingDocs.push('KTP');
    if (!docMeta.kk) missingDocs.push('KK');
    if (!docMeta.vaksin) missingDocs.push('Vaksin');
    const ruleDocsComplete = missingDocs.length === 0;

    // 4. Format Digit Baku (NIK 16 digit & Paspor 1 huruf + 7/8 digit)
    const rulePassportFormat = /^[A-Z][0-9]{7,8}$/.test(j.noPaspor);
    const ruleNikFormat = /^[0-9]{16}$/.test(j.nik);
    const ruleFormatValid = rulePassportFormat && ruleNikFormat;

    // 5. Verifikasi Vaksin Meningitis & Polio
    const ruleVaccineValid = j.statusVaksin.includes('Meningitis & Polio');

    // Status Visa Terbit
    const hasVisa = Boolean(j.noVisa);

    // Kesiapan Menyeluruh (100% Lolos)
    const isReadyForFlight = rulePassportValid && ruleNameThreeWords && ruleDocsComplete && ruleFormatValid && ruleVaccineValid && hasVisa;
    const hasAnyIssue = !rulePassportValid || !ruleNameThreeWords || !ruleDocsComplete || !ruleFormatValid || !ruleVaccineValid;

    return {
      ...j,
      diffDays,
      wordsCount: words.length,
      missingDocs,
      rulePassportValid,
      ruleNameThreeWords,
      ruleDocsComplete,
      ruleFormatValid,
      ruleVaccineValid,
      hasVisa,
      isReadyForFlight,
      hasAnyIssue
    };
  });

  const totalReady = auditedJamaah.filter((j) => j.isReadyForFlight).length;
  const totalIssues = auditedJamaah.filter((j) => j.hasAnyIssue).length;

  const filteredList = auditedJamaah.filter((j) => {
    if (filterMode === 'ISSUES_ONLY') return j.hasAnyIssue;
    if (filterMode === 'READY_ONLY') return j.isReadyForFlight;
    return true;
  });

  // Handler Downloads
  const handleDownloadManifest = () => {
    exportManifestExcel(batch, jamaahList);
  };

  const handleDownloadSiskopatuh = () => {
    exportSiskopatuhExcel(batch, jamaahList);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      await exportZipPackage(batch, jamaahList, documents);
    } catch (err) {
      alert('Gagal membuat ZIP arsip berkas: ' + err.message);
    } finally {
      setIsZipping(false);
    }
  };

  const handleSaveVisa = () => {
    if (selectedVisaJamaah && visaInputNumber) {
      onUpdateJamaahVisa(selectedVisaJamaah.id, visaInputNumber);
      setSelectedVisaJamaah(null);
      setVisaInputNumber('');
    }
  };

  return (
    <div>
      {/* Header & Status Banner */}
      <div className="card" style={{ marginBottom: '1.5rem', background: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <ShieldCheck size={24} color="var(--primary)" />
              <h2 style={{ fontSize: '1.35rem', margin: 0 }}>
                Halaman Validasi Visa, Manifest &amp; Siskopatuh
              </h2>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Audit kepatuhan data sebelum berkas diajukan ke provider visa Arab Saudi dan sistem Siskopatuh Kemenag RI.
            </p>
          </div>

          {/* Tombol Ekspor Berkas Resmi */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={handleDownloadManifest}
              title="Unduh format Manifest Excel untuk Pembuatan Visa"
            >
              <FileSpreadsheet size={15} color="#059669" />
              Manifest Visa (.xlsx)
            </button>

            <button 
              className="btn btn-secondary btn-sm"
              onClick={handleDownloadSiskopatuh}
              title="Unduh format Siskopatuh Excel Resmi Kemenag"
            >
              <FileSpreadsheet size={15} color="#2563eb" />
              Siskopatuh (.xlsx)
            </button>

            <button 
              className="btn btn-gold btn-sm"
              onClick={handleDownloadZip}
              disabled={isZipping}
              title="Unduh seluruh arsip berkas foto/scan dikelompokkan per kategori dokumen"
            >
              <Archive size={15} />
              {isZipping ? 'Mengompres ZIP...' : 'Arsip Kloter (ZIP)'}
            </button>

            <button 
              className="btn btn-primary btn-sm"
              onClick={onOpenBatchPrint}
              title="Cetak sekaligus seluruh Visa dan Sertifikat Vaksin satu batch berurutan nomor manifest"
            >
              <Printer size={15} />
              Cetak Massal Kloter
            </button>
          </div>
        </div>

        {/* Ringkasan Status Audit */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.85rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#047857', fontWeight: 700 }}>
              <CheckCircle2 size={16} /> {totalReady} Jamaah Siap Berangkat &amp; Visa Terbit
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: totalIssues > 0 ? '#b91c1c' : '#64748b', fontWeight: 700 }}>
              <AlertTriangle size={16} /> {totalIssues} Jamaah Membutuhkan Penanganan
            </span>
          </div>

          {/* Filter Mode */}
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            <button 
              className={`btn btn-sm ${filterMode === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterMode('ALL')}
            >
              Tampilkan Semua ({auditedJamaah.length})
            </button>
            <button 
              className={`btn btn-sm ${filterMode === 'ISSUES_ONLY' ? 'btn-danger' : 'btn-secondary'}`}
              onClick={() => setFilterMode('ISSUES_ONLY')}
            >
              Hanya Bermasalah ({totalIssues})
            </button>
            <button 
              className={`btn btn-sm ${filterMode === 'READY_ONLY' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterMode('READY_ONLY')}
            >
              100% Lengkap ({totalReady})
            </button>
          </div>
        </div>
      </div>

      {/* Tabel Matriks Validasi 5 Aturan Kritis */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Jamaah &amp; No Paspor</th>
              <th>Rule 1: Paspor &ge; 6 Bln</th>
              <th>Rule 2: Nama &ge; 3 Kata</th>
              <th>Rule 3: 4 Berkas Wajib</th>
              <th>Rule 4: Format NIK/Paspor</th>
              <th>Rule 5: Vaksin Lengkap</th>
              <th>Status e-Visa</th>
              <th style={{ textAlign: 'center' }}>Aksi Input Visa</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.map((j, index) => {
              return (
                <tr key={j.id} style={{ background: j.hasAnyIssue ? '#fffdfb' : 'white' }}>
                  <td style={{ fontWeight: 600, color: 'var(--text-muted)' }}>{index + 1}</td>
                  
                  {/* Nama & Paspor */}
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.85rem' }}>
                      {j.namaPaspor}
                    </div>
                    <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                      No Paspor: {j.noPaspor}
                    </div>
                  </td>

                  {/* Rule 1: Paspor >= 6 Bulan */}
                  <td>
                    {j.rulePassportValid ? (
                      <span className="badge badge-success">
                        ✓ Valid ({j.diffDays} hari)
                      </span>
                    ) : (
                      <span className="badge badge-danger" title="Masa berlaku paspor kurang dari 180 hari dari tanggal keberangkatan">
                        ⚠ Expired ({j.diffDays} hari)
                      </span>
                    )}
                  </td>

                  {/* Rule 2: Nama >= 3 Kata */}
                  <td>
                    {j.ruleNameThreeWords ? (
                      <span className="badge badge-success">
                        ✓ {j.wordsCount} Kata
                      </span>
                    ) : (
                      <span className="badge badge-warning" title="Nama kurang dari 3 kata, wajib melampirkan surat tambah nama / endorsement">
                        ⚠ {j.wordsCount} Kata (Endorse)
                      </span>
                    )}
                  </td>

                  {/* Rule 3: Berkas Lengkap */}
                  <td>
                    {j.ruleDocsComplete ? (
                      <span className="badge badge-success">
                        ✓ 4/4 Lengkap
                      </span>
                    ) : (
                      <span className="badge badge-danger" title={`Kurang: ${j.missingDocs.join(', ')}`}>
                        Kurang: {j.missingDocs.join(', ')}
                      </span>
                    )}
                  </td>

                  {/* Rule 4: Format Digit NIK & Paspor */}
                  <td>
                    {j.ruleFormatValid ? (
                      <span className="badge badge-success">
                        ✓ Sesuai Baku
                      </span>
                    ) : (
                      <span className="badge badge-danger">
                        ⚠ Digit Invalid
                      </span>
                    )}
                  </td>

                  {/* Rule 5: Vaksin */}
                  <td>
                    {j.ruleVaccineValid ? (
                      <span className="badge badge-success">
                        ✓ Meningitis &amp; Polio
                      </span>
                    ) : (
                      <span className="badge badge-warning">
                        {j.statusVaksin}
                      </span>
                    )}
                  </td>

                  {/* Status Visa */}
                  <td>
                    {j.noVisa ? (
                      <div>
                        <span className="badge badge-success" style={{ fontWeight: 700 }}>
                          ✓ VISA TERBIT
                        </span>
                        <div style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                          {j.noVisa}
                        </div>
                      </div>
                    ) : (
                      <span className="badge badge-warning">
                        Proses Pengajuan
                      </span>
                    )}
                  </td>

                  {/* Aksi Input Visa */}
                  <td style={{ textAlign: 'center' }}>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => {
                        setSelectedVisaJamaah(j);
                        setVisaInputNumber(j.noVisa || '');
                      }}
                      title="Update Nomor Visa atau Catat e-Visa yang Diterima"
                    >
                      <Upload size={13} /> {j.noVisa ? 'Edit Visa' : '+ No Visa'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal Input Nomor Visa */}
      {selectedVisaJamaah && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>
                <FileCheck size={20} color="var(--primary)" />
                Pencatatan e-Visa Terbit (Saudi Visa Portal)
              </h3>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
                Masukkan nomor e-Visa yang telah diterbitkan oleh provider visa untuk jamaah:
                <br />
                <strong>{selectedVisaJamaah.namaPaspor}</strong> (Paspor: {selectedVisaJamaah.noPaspor})
              </p>

              <div className="form-group">
                <label className="form-label">Nomor e-Visa Arab Saudi:</label>
                <input
                  type="text"
                  className="form-control uppercase"
                  placeholder="Contoh: VISA-SA-982104"
                  value={visaInputNumber}
                  onChange={(e) => setVisaInputNumber(e.target.value.toUpperCase())}
                  autoFocus
                />
                <span className="form-hint">Nomor ini akan tercantum di Manifest dan lembar cetak paspor.</span>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelectedVisaJamaah(null)}>
                Batal
              </button>
              <button className="btn btn-primary" onClick={handleSaveVisa}>
                <Check size={16} /> Simpan Nomor Visa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
