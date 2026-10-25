import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  ArrowRightLeft, 
  AlertTriangle, 
  CheckCircle2, 
  FileCheck,
  FileX,
  User,
  Users
} from 'lucide-react';

export default function JamaahListView({
  batch,
  batches,
  jamaahList,
  documents,
  userRole,
  onOpenAddModal,
  onOpenEditModal,
  onDeleteJamaah,
  onMoveBatch
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [movingJamaah, setMovingJamaah] = useState(null);
  const [targetBatchId, setTargetBatchId] = useState('');

  const departureDate = new Date(batch.tanggalBerangkat);

  // Filter & Search Logic
  const filteredJamaah = jamaahList.filter((j) => {
    const matchesSearch = 
      j.namaPaspor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.noPaspor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.nik.includes(searchTerm) ||
      j.noKk.includes(searchTerm);

    if (!matchesSearch) return false;

    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'LUNAS') return j.statusJamaah === 'LUNAS';
    if (filterStatus === 'DP') return j.statusJamaah === 'DP';
    if (filterStatus === 'TERDAFTAR') return j.statusJamaah === 'TERDAFTAR';
    if (filterStatus === 'ATTENTION') {
      const words = j.namaPaspor.trim().split(/\s+/).filter(Boolean);
      const expiryDate = new Date(j.masaBerlakuPaspor);
      const diffDays = Math.ceil((expiryDate - departureDate) / (1000 * 60 * 60 * 24));
      const docMeta = documents[j.id] || {};
      return diffDays < 180 || words.length < 3 || !docMeta.paspor || !docMeta.vaksin;
    }
    return true;
  });

  const handleOpenMoveModal = (jamaah) => {
    setMovingJamaah(jamaah);
    const otherBatches = batches.filter((b) => b.id !== batch.id);
    if (otherBatches.length > 0) {
      setTargetBatchId(otherBatches[0].id);
    }
  };

  const handleConfirmMove = () => {
    if (movingJamaah && targetBatchId) {
      onMoveBatch(movingJamaah.id, targetBatchId);
      setMovingJamaah(null);
    }
  };

  return (
    <div>
      {/* Header Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', margin: 0, color: 'var(--text-main)' }}>
            Database Jamaah Kloter
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Total terdaftar: <strong>{filteredJamaah.length}</strong> jamaah pada batch ini
          </p>
        </div>

        {userRole === 'ADMIN' && (
          <button className="btn btn-primary" onClick={onOpenAddModal}>
            <Plus size={16} /> Tambah Jamaah Baru
          </button>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="card" style={{ padding: '0.85rem 1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: '1', minWidth: '260px' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Cari nama jamaah, nomor paspor, NIK, atau nomor KK..."
              style={{ paddingLeft: '2.2rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, marginRight: '0.25rem' }}>
              Filter:
            </span>
            <button 
              className={`btn btn-sm ${filterStatus === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterStatus('ALL')}
            >
              Semua ({jamaahList.length})
            </button>
            <button 
              className={`btn btn-sm ${filterStatus === 'LUNAS' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterStatus('LUNAS')}
            >
              Lunas
            </button>
            <button 
              className={`btn btn-sm ${filterStatus === 'DP' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterStatus('DP')}
            >
              Sudah DP
            </button>
            <button 
              className={`btn btn-sm ${filterStatus === 'TERDAFTAR' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterStatus('TERDAFTAR')}
            >
              Belum DP
            </button>
            <button 
              className={`btn btn-sm ${filterStatus === 'ATTENTION' ? 'btn-danger' : 'btn-secondary'}`}
              onClick={() => setFilterStatus('ATTENTION')}
              title="Paspor < 6 bulan, nama 2 kata, atau berkas kurang"
            >
              <AlertTriangle size={13} /> Perlu Perhatian
            </button>
          </div>
        </div>
      </div>

      {/* Tabel Jamaah */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Lengkap (Paspor)</th>
              <th>No Paspor &amp; Expired</th>
              <th>NIK / No KK</th>
              <th>Gender &amp; Usia</th>
              <th>Paket Kamar</th>
              <th>Kelengkapan Berkas</th>
              <th>Status Bayar</th>
              <th>Status Visa</th>
              {userRole === 'ADMIN' && <th style={{ textAlign: 'center' }}>Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {filteredJamaah.length === 0 ? (
              <tr>
                <td colSpan={10} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  Tidak ada data jamaah yang sesuai dengan filter pencarian.
                </td>
              </tr>
            ) : (
              filteredJamaah.map((j, index) => {
                const words = j.namaPaspor.trim().split(/\s+/).filter(Boolean);
                const expiryDate = new Date(j.masaBerlakuPaspor);
                const diffDays = Math.ceil((expiryDate - departureDate) / (1000 * 60 * 60 * 24));
                const isPassportExpiredSoon = diffDays < 180;
                const docMeta = documents[j.id] || {};

                // Umur & Lansia
                const birthYear = new Date(j.tanggalLahir).getFullYear();
                const age = new Date().getFullYear() - birthYear;
                const isElderly = age >= 60;

                return (
                  <tr key={j.id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-muted)' }}>{index + 1}</td>
                    
                    {/* Nama & Badge Suku Kata */}
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.88rem' }}>
                        {j.namaPaspor}
                      </div>
                      <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.2rem' }}>
                        {words.length >= 3 ? (
                          <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>
                            ✓ 3 Kata
                          </span>
                        ) : (
                          <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>
                            ⚠ {words.length} Kata (Butuh Endorsement)
                          </span>
                        )}
                        <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>
                          {j.statusDalamKk}
                        </span>
                      </div>
                    </td>

                    {/* No Paspor & Validitas */}
                    <td>
                      <div style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.9rem' }}>
                        {j.noPaspor}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: isPassportExpiredSoon ? '#dc2626' : 'var(--text-muted)', fontWeight: isPassportExpiredSoon ? 700 : 500 }}>
                        Exp: {j.masaBerlakuPaspor}
                        {isPassportExpiredSoon && (
                          <span style={{ display: 'block', color: '#dc2626' }}>
                            ⚠ &lt; 6 Bln ({diffDays} hari)
                          </span>
                        )}
                      </div>
                    </td>

                    {/* NIK & KK */}
                    <td>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        <strong>NIK:</strong> {j.nik}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <strong>KK:</strong> {j.noKk}
                      </div>
                    </td>

                    {/* Gender & Usia */}
                    <td>
                      <span className={`badge ${j.jenisKelamin === 'L' ? 'badge-blue' : 'badge-purple'}`} style={{ marginRight: '0.3rem' }}>
                        {j.jenisKelamin === 'L' ? 'L' : 'P'}
                      </span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                        {age} Thn
                      </span>
                      {isElderly && (
                        <div style={{ fontSize: '0.68rem', color: '#b91c1c', fontWeight: 700, marginTop: '0.15rem' }}>
                          Lansia
                        </div>
                      )}
                    </td>

                    {/* Paket Kamar */}
                    <td>
                      <span className="badge badge-warning" style={{ fontWeight: 700 }}>
                        {j.paketKamar}
                      </span>
                    </td>

                    {/* Ceklis Berkas */}
                    <td>
                      <div style={{ display: 'flex', gap: '0.25rem', fontSize: '0.68rem' }}>
                        <span title="Paspor" style={{ padding: '0.15rem 0.35rem', borderRadius: 4, background: docMeta.paspor ? '#ecfdf5' : '#fef2f2', color: docMeta.paspor ? '#047857' : '#dc2626', fontWeight: 700 }}>
                          PASPOR
                        </span>
                        <span title="KTP" style={{ padding: '0.15rem 0.35rem', borderRadius: 4, background: docMeta.ktp ? '#ecfdf5' : '#fef2f2', color: docMeta.ktp ? '#047857' : '#dc2626', fontWeight: 700 }}>
                          KTP
                        </span>
                        <span title="KK" style={{ padding: '0.15rem 0.35rem', borderRadius: 4, background: docMeta.kk ? '#ecfdf5' : '#fef2f2', color: docMeta.kk ? '#047857' : '#dc2626', fontWeight: 700 }}>
                          KK
                        </span>
                        <span title="Vaksin" style={{ padding: '0.15rem 0.35rem', borderRadius: 4, background: docMeta.vaksin ? '#ecfdf5' : '#fef2f2', color: docMeta.vaksin ? '#047857' : '#dc2626', fontWeight: 700 }}>
                          VAKSIN
                        </span>
                      </div>
                    </td>

                    {/* Status Bayar */}
                    <td>
                      <span className={`badge ${j.statusJamaah === 'LUNAS' ? 'badge-success' : (j.statusJamaah === 'DP' ? 'badge-warning' : 'badge-danger')}`}>
                        {j.statusJamaah}
                      </span>
                    </td>

                    {/* Status Visa */}
                    <td>
                      {j.noVisa ? (
                        <div>
                          <span className="badge badge-success" style={{ fontSize: '0.68rem' }}>
                            ✓ Terbit
                          </span>
                          <div style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                            {j.noVisa}
                          </div>
                        </div>
                      ) : (
                        <span className="badge badge-warning" style={{ fontSize: '0.68rem' }}>
                          Belum Terbit
                        </span>
                      )}
                    </td>

                    {/* Aksi Admin */}
                    {userRole === 'ADMIN' && (
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => onOpenEditModal(j)}
                            title="Edit Data Jamaah"
                          >
                            <Edit3 size={13} />
                          </button>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => handleOpenMoveModal(j)}
                            title="Pindah Jadwal / Batch Lain"
                          >
                            <ArrowRightLeft size={13} />
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => onDeleteJamaah(j.id)}
                            title="Hapus / Batalkan Jamaah"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Pindah Jadwal / Batch */}
      {movingJamaah && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>
                <ArrowRightLeft size={20} color="var(--primary)" />
                Pindah Jadwal Keberangkatan (Mutasi Batch)
              </h3>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
                Pindahkan jamaah <strong>{movingJamaah.namaPaspor}</strong> (Paspor: {movingJamaah.noPaspor}) ke tanggal batch keberangkatan lain tanpa perlu mengulang input data berkas:
              </p>

              <div className="form-group">
                <label className="form-label">Pilih Batch Keberangkatan Tujuan:</label>
                <select
                  className="form-control"
                  value={targetBatchId}
                  onChange={(e) => setTargetBatchId(e.target.value)}
                >
                  {batches
                    .filter((b) => b.id !== batch.id)
                    .map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.tanggalBerangkat} | {b.namaPaket} (Kuota Seat: {b.kuotaSeat})
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setMovingJamaah(null)}>
                Batal
              </button>
              <button className="btn btn-primary" onClick={handleConfirmMove}>
                Konfirmasi Pindah Kloter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
