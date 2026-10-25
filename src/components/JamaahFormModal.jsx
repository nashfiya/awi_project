import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, ShieldAlert, UploadCloud, FileText } from 'lucide-react';

export default function JamaahFormModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  batch,
  documents,
  onUpdateDocument
}) {
  const [formData, setFormData] = useState({
    noPaspor: '',
    namaPaspor: '',
    nik: '',
    noKk: '',
    statusDalamKk: 'Kepala Keluarga',
    tanggalLahir: '1985-01-01',
    jenisKelamin: 'L',
    masaBerlakuPaspor: '2032-01-01',
    statusVaksin: 'Lengkap (Meningitis & Polio)',
    paketKamar: 'QUAD',
    statusJamaah: 'TERDAFTAR',
    noVisa: '',
    catatan: '',
  });

  const [docUploads, setDocUploads] = useState({
    paspor: true,
    ktp: true,
    kk: true,
    aktaNikah: false,
    vaksin: true,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      if (documents && documents[initialData.id]) {
        setDocUploads(documents[initialData.id]);
      }
    } else {
      setFormData({
        noPaspor: '',
        namaPaspor: '',
        nik: '',
        noKk: '',
        statusDalamKk: 'Kepala Keluarga',
        tanggalLahir: '1985-01-01',
        jenisKelamin: 'L',
        masaBerlakuPaspor: '2032-01-01',
        statusVaksin: 'Lengkap (Meningitis & Polio)',
        paketKamar: 'QUAD',
        statusJamaah: 'TERDAFTAR',
        noVisa: '',
        catatan: '',
      });
      setDocUploads({
        paspor: true,
        ktp: true,
        kk: true,
        aktaNikah: false,
        vaksin: true,
      });
    }
  }, [initialData, documents, isOpen]);

  if (!isOpen) return null;

  // 1. Validasi Nama (Suku Kata)
  const words = formData.namaPaspor.trim().split(/\s+/).filter(Boolean);
  const isThreeWords = words.length >= 3;

  // 2. Validasi Format Paspor (1 huruf kapital + 7/8 digit)
  const isPassportFormatValid = /^[A-Z][0-9]{7,8}$/.test(formData.noPaspor);

  // 3. Validasi NIK 16 digit
  const isNikValid = /^[0-9]{16}$/.test(formData.nik);

  // 4. Validasi Masa Berlaku Paspor Minimal 6 Bulan (180 hari dari tgl berangkat)
  const departureDate = new Date(batch.tanggalBerangkat);
  const expiryDate = new Date(formData.masaBerlakuPaspor);
  const diffDays = Math.ceil((expiryDate - departureDate) / (1000 * 60 * 60 * 24));
  const isPassportExpiredSoon = diffDays < 180;

  // 5. Hitung Umur & Status Lansia
  const birthYear = new Date(formData.tanggalLahir).getFullYear();
  const currentYear = new Date().getFullYear();
  const age = currentYear - birthYear;
  const isElderly = age >= 60;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.namaPaspor || !formData.noPaspor) {
      alert('Nama dan Nomor Paspor wajib diisi!');
      return;
    }
    onSave(formData, docUploads);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content wide">
        <div className="modal-header">
          <h3>
            <FileText size={20} color="var(--primary)" />
            {initialData ? 'Edit Data Jamaah' : 'Pendaftaran & Input Berkas Jamaah Baru'}
          </h3>
          <button 
            onClick={onClose} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div className="modal-body">
            {/* Peringatan Kritis Jika Paspor < 6 Bulan */}
            {isPassportExpiredSoon && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#b91c1c', fontSize: '0.82rem' }}>
                <ShieldAlert size={22} color="#dc2626" style={{ flexShrink: 0 }} />
                <div>
                  <strong>PERINGATAN KRITIS:</strong> Masa berlaku paspor kurang dari 6 bulan sebelum tanggal keberangkatan ({diffDays} hari tersisa). Sesuai regulasi Imigrasi Arab Saudi, jamaah wajib memperpanjang paspor sebelum proses visa dapat diajukan!
                </div>
              </div>
            )}

            <div className="form-grid">
              {/* No Paspor */}
              <div className="form-group">
                <label className="form-label">
                  Nomor Paspor *
                  {formData.noPaspor && (
                    <span style={{ fontSize: '0.7rem', color: isPassportFormatValid ? '#059669' : '#dc2626' }}>
                      {isPassportFormatValid ? '✓ Format Baku' : '⚠ Wajib 1 Huruf + 7/8 Angka'}
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: B1234567"
                  className="form-control uppercase"
                  maxLength={9}
                  value={formData.noPaspor}
                  onChange={(e) => setFormData({ ...formData, noPaspor: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') })}
                />
                <span className="form-hint">Format paspor Indonesia standar (1 huruf kapital + 7/8 angka)</span>
              </div>

              {/* Nama Paspor */}
              <div className="form-group">
                <label className="form-label">
                  Nama Lengkap Sesuai Paspor *
                  {formData.namaPaspor && (
                    <span 
                      className={`badge ${isThreeWords ? 'badge-success' : 'badge-warning'}`}
                      style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}
                    >
                      {isThreeWords ? `✓ ${words.length} Kata (Lengkap)` : `⚠ ${words.length} Kata (Butuh Endorsement)`}
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: AHMAD DAHLAN PRATAMA"
                  className="form-control uppercase"
                  value={formData.namaPaspor}
                  onChange={(e) => setFormData({ ...formData, namaPaspor: e.target.value.toUpperCase() })}
                />
                <span className="form-hint">Syarat visa umrah/haji Saudi: nama dianjurkan minimal 3 kata.</span>
              </div>

              {/* NIK */}
              <div className="form-group">
                <label className="form-label">
                  NIK (KTP) *
                  <span style={{ fontSize: '0.7rem', color: isNikValid ? '#059669' : '#dc2626' }}>
                    {formData.nik.length}/16 Digit
                  </span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={16}
                  placeholder="16 digit angka sesuai KTP"
                  className="form-control"
                  value={formData.nik}
                  onChange={(e) => setFormData({ ...formData, nik: e.target.value.replace(/[^0-9]/g, '') })}
                />
              </div>

              {/* No Kartu Keluarga (KK) */}
              <div className="form-group">
                <label className="form-label">
                  Nomor Kartu Keluarga (KK) *
                  <span className="form-hint">(Acuan Kamar &amp; Kursi Keluarga)</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={16}
                  placeholder="16 digit nomor KK"
                  className="form-control"
                  value={formData.noKk}
                  onChange={(e) => setFormData({ ...formData, noKk: e.target.value.replace(/[^0-9]/g, '') })}
                />
              </div>

              {/* Hubungan dalam KK */}
              <div className="form-group">
                <label className="form-label">Hubungan dalam Keluarga / KK</label>
                <select
                  className="form-control"
                  value={formData.statusDalamKk}
                  onChange={(e) => setFormData({ ...formData, statusDalamKk: e.target.value })}
                >
                  <option value="Kepala Keluarga">Kepala Keluarga</option>
                  <option value="Istri">Istri</option>
                  <option value="Anak">Anak</option>
                  <option value="Orang Tua">Orang Tua / Mertua</option>
                  <option value="Famili Lain">Famili Lain / Jamaah Mandiri</option>
                </select>
              </div>

              {/* Jenis Kelamin */}
              <div className="form-group">
                <label className="form-label">Jenis Kelamin</label>
                <select
                  className="form-control"
                  value={formData.jenisKelamin}
                  onChange={(e) => setFormData({ ...formData, jenisKelamin: e.target.value })}
                >
                  <option value="L">Laki-Laki (Ikhwan)</option>
                  <option value="P">Perempuan (Akhwat)</option>
                </select>
              </div>

              {/* Tanggal Lahir */}
              <div className="form-group">
                <label className="form-label">
                  Tanggal Lahir
                  <span style={{ fontSize: '0.72rem', color: isElderly ? '#dc2626' : 'var(--text-muted)' }}>
                    Usia: {age} Tahun {isElderly && '(Lansia Prioritas)'}
                  </span>
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.tanggalLahir}
                  onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })}
                />
              </div>

              {/* Masa Berlaku Paspor */}
              <div className="form-group">
                <label className="form-label">
                  Masa Berlaku Paspor
                  <span style={{ fontSize: '0.72rem', color: isPassportExpiredSoon ? '#dc2626' : '#059669', fontWeight: 700 }}>
                    {isPassportExpiredSoon ? '⚠ Kurang dari 6 Bulan!' : '✓ Aman (> 6 Bulan)'}
                  </span>
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.masaBerlakuPaspor}
                  onChange={(e) => setFormData({ ...formData, masaBerlakuPaspor: e.target.value })}
                />
              </div>

              {/* Status Vaksin */}
              <div className="form-group">
                <label className="form-label">Status Vaksinasi</label>
                <select
                  className="form-control"
                  value={formData.statusVaksin}
                  onChange={(e) => setFormData({ ...formData, statusVaksin: e.target.value })}
                >
                  <option value="Lengkap (Meningitis & Polio)">Lengkap (Meningitis &amp; Polio)</option>
                  <option value="Hanya Meningitis (Polio Belum)">Hanya Meningitis (Polio Belum)</option>
                  <option value="Belum Vaksin">Belum Vaksin</option>
                </select>
              </div>

              {/* Paket Kamar */}
              <div className="form-group">
                <label className="form-label">Pilihan Paket Kamar</label>
                <select
                  className="form-control"
                  value={formData.paketKamar}
                  onChange={(e) => setFormData({ ...formData, paketKamar: e.target.value })}
                >
                  <option value="QUAD">QUAD (Sekamar Ber-4)</option>
                  <option value="TRIPLE">TRIPLE (Sekamar Ber-3)</option>
                  <option value="DOUBLE">DOUBLE (Sekamar Ber-2)</option>
                </select>
              </div>

              {/* Status Jamaah */}
              <div className="form-group">
                <label className="form-label">Status Jamaah</label>
                <select
                  className="form-control"
                  value={formData.statusJamaah}
                  onChange={(e) => setFormData({ ...formData, statusJamaah: e.target.value })}
                >
                  <option value="TERDAFTAR">Terdaftar (Belum DP)</option>
                  <option value="DP">Sudah DP</option>
                  <option value="LUNAS">Lunas</option>
                  <option value="SIAP_BERANGKAT">Siap Berangkat (Lengkap)</option>
                  <option value="BATAL">Batal</option>
                </select>
              </div>

              {/* Nomor Visa */}
              <div className="form-group">
                <label className="form-label">Nomor Visa (Diisi Saat Terbit)</label>
                <input
                  type="text"
                  placeholder="Contoh: VISA-SA-982104"
                  className="form-control uppercase"
                  value={formData.noVisa}
                  onChange={(e) => setFormData({ ...formData, noVisa: e.target.value })}
                />
              </div>

              {/* Checklist Dokumen Berkas Fisik/Scan */}
              <div className="form-group full" style={{ marginTop: '0.5rem' }}>
                <label className="form-label" style={{ marginBottom: '0.5rem' }}>
                  Ceklis Berkas Fisik / Scan Digital yang Sudah Diterima Admin:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.65rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', cursor: 'pointer', background: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                    <input 
                      type="checkbox" 
                      checked={docUploads.paspor}
                      onChange={(e) => setDocUploads({ ...docUploads, paspor: e.target.checked })} 
                    />
                    <strong>Scan Paspor Asli</strong>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', cursor: 'pointer', background: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                    <input 
                      type="checkbox" 
                      checked={docUploads.ktp}
                      onChange={(e) => setDocUploads({ ...docUploads, ktp: e.target.checked })} 
                    />
                    <strong>Scan KTP</strong>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', cursor: 'pointer', background: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                    <input 
                      type="checkbox" 
                      checked={docUploads.kk}
                      onChange={(e) => setDocUploads({ ...docUploads, kk: e.target.checked })} 
                    />
                    <strong>Scan KK</strong>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', cursor: 'pointer', background: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                    <input 
                      type="checkbox" 
                      checked={docUploads.vaksin}
                      onChange={(e) => setDocUploads({ ...docUploads, vaksin: e.target.checked })} 
                    />
                    <strong>Sertifikat Vaksin</strong>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', cursor: 'pointer', background: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                    <input 
                      type="checkbox" 
                      checked={docUploads.aktaNikah}
                      onChange={(e) => setDocUploads({ ...docUploads, aktaNikah: e.target.checked })} 
                    />
                    <span>Buku Nikah / Akta Lahir</span>
                  </label>
                </div>
              </div>

              {/* Catatan Tambahan */}
              <div className="form-group full">
                <label className="form-label">Catatan Operasional Admin</label>
                <textarea
                  rows={2}
                  className="form-control"
                  placeholder="Contoh: Permintaan kursi roda di bandara, alergi makanan, atau titipan dokumen"
                  value={formData.catatan}
                  onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              <CheckCircle size={16} />
              Simpan Data Jamaah
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
