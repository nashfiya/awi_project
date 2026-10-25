import React from 'react';
import { 
  Users, 
  Plane, 
  Calendar, 
  Building2, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileCheck, 
  Download, 
  CreditCard,
  Luggage,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export default function DashboardView({
  batch,
  jamaahList,
  documents,
  payments,
  userRole,
  onNavigateTab
}) {
  // Hitung Kuota Seat
  const totalKuota = batch.kuotaSeat || 45;
  const totalTerisi = jamaahList.filter((j) => j.statusJamaah !== 'BATAL').length;
  const sisaSeat = Math.max(0, totalKuota - totalTerisi);
  const persentaseTerisi = Math.min(100, Math.round((totalTerisi / totalKuota) * 100));

  // Hitung Keuangan (DP vs Lunas)
  const lunasCount = jamaahList.filter((j) => j.statusJamaah === 'LUNAS').length;
  const dpCount = jamaahList.filter((j) => j.statusJamaah === 'DP').length;
  const terdaftarCount = jamaahList.filter((j) => j.statusJamaah === 'TERDAFTAR').length;

  // Analisis Validasi Dokumen
  const departureDate = new Date(batch.tanggalBerangkat);
  const issues = [];

  jamaahList.forEach((j) => {
    // 1. Cek Paspor < 6 bulan (180 hari)
    const expiryDate = new Date(j.masaBerlakuPaspor);
    const diffDays = Math.ceil((expiryDate - departureDate) / (1000 * 60 * 60 * 24));
    if (diffDays < 180) {
      issues.push({
        type: 'DANGER',
        text: `Paspor Kadaluwarsa < 6 Bulan (${diffDays} hari tersisa)`,
        jamaah: j.namaPaspor,
        noPaspor: j.noPaspor,
        id: j.id,
      });
    }

    // 2. Cek Nama 3 suku kata
    const words = j.namaPaspor.trim().split(/\s+/).filter(Boolean);
    if (words.length < 3) {
      issues.push({
        type: 'WARNING',
        text: `Nama Paspor Hanya ${words.length} Kata (Butuh Surat Tambah Nama / Endorsement Visa)`,
        jamaah: j.namaPaspor,
        noPaspor: j.noPaspor,
        id: j.id,
      });
    }

    // 3. Cek Dokumen Lengkap
    const docMeta = documents[j.id] || {};
    if (!docMeta.paspor || !docMeta.ktp || !docMeta.kk || !docMeta.vaksin) {
      issues.push({
        type: 'INFO',
        text: 'Berkas Wajib Belum Lengkap (Cek Paspor, KTP, KK, atau Vaksin)',
        jamaah: j.namaPaspor,
        noPaspor: j.noPaspor,
        id: j.id,
      });
    }
  });

  const totalSiapBerangkat = jamaahList.filter((j) => {
    const docMeta = documents[j.id] || {};
    const words = j.namaPaspor.trim().split(/\s+/).filter(Boolean);
    const expiryDate = new Date(j.masaBerlakuPaspor);
    const diffDays = Math.ceil((expiryDate - departureDate) / (1000 * 60 * 60 * 24));
    return (
      j.statusJamaah === 'LUNAS' &&
      diffDays >= 180 &&
      words.length >= 3 &&
      docMeta.paspor &&
      docMeta.ktp &&
      docMeta.kk &&
      docMeta.vaksin &&
      j.noVisa
    );
  }).length;

  return (
    <div>
      {/* Banner Ringkasan Batch */}
      <div 
        className="card" 
        style={{ 
          background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)', 
          borderLeft: '5px solid var(--primary)', 
          marginBottom: '1.5rem',
          padding: '1.25rem 1.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-success">KLOTER AKTIF</span>
              <h2 style={{ fontSize: '1.35rem', color: 'var(--primary-dark)', margin: 0 }}>
                {batch.namaPaket}
              </h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.82rem', color: 'var(--text-secondary)', flexWrap: 'wrap', marginTop: '0.4rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Calendar size={14} color="var(--primary)" />
                <strong>Berangkat:</strong> {batch.tanggalBerangkat} s/d {batch.tanggalPulang}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Plane size={14} color="var(--primary)" />
                <strong>Maskapai:</strong> {batch.maskapai}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Building2 size={14} color="var(--primary)" />
                <strong>Hotel:</strong> {batch.hotelMakkah} &amp; {batch.hotelMadinah}
              </span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>
              Kapasitas Terisi
            </span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-dark)' }}>
              {persentaseTerisi}%
            </div>
          </div>
        </div>

        {/* Live Seat Quota Progress Bar */}
        <div style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.35rem', fontWeight: 600 }}>
            <span style={{ color: 'var(--text-secondary)' }}>
              Terisi: <strong>{totalTerisi} Kursi</strong>
            </span>
            <span style={{ color: sisaSeat <= 5 ? '#dc2626' : 'var(--primary)', fontWeight: 700 }}>
              Sisa Kuota: <strong>{sisaSeat} Kursi Tersedia</strong> dari {totalKuota}
            </span>
          </div>
          <div style={{ height: '10px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
            <div 
              style={{ 
                height: '100%', 
                width: `${persentaseTerisi}%`, 
                background: persentaseTerisi >= 90 ? 'linear-gradient(90deg, #059669, #dc2626)' : 'linear-gradient(90deg, #10b981, #047857)', 
                borderRadius: '999px',
                transition: 'width 0.4s ease'
              }} 
            />
          </div>
        </div>
      </div>

      {/* Grid Kartu Metrik Utama */}
      <div className="stats-grid">
        <div className="stat-card green">
          <div className="stat-icon-wrapper">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-title">Total Jamaah Terdaftar</div>
            <div className="stat-value">{totalTerisi} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>/ {totalKuota}</span></div>
            <div className="stat-subtitle">{lunasCount} Lunas, {dpCount} Bayar DP</div>
          </div>
        </div>

        <div className="stat-card gold">
          <div className="stat-icon-wrapper">
            <Plane size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-title">Sisa Kursi Pesawat</div>
            <div className="stat-value">{sisaSeat}</div>
            <div className="stat-subtitle">Slot tiket masih bisa dijual</div>
          </div>
        </div>

        <div className="stat-card blue">
          <div className="stat-icon-wrapper">
            <FileCheck size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-title">100% Siap Berangkat</div>
            <div className="stat-value">{totalSiapBerangkat}</div>
            <div className="stat-subtitle">Visa, Vaksin, Lunas &amp; Berkas OK</div>
          </div>
        </div>

        <div className="stat-card red">
          <div className="stat-icon-wrapper">
            <ShieldAlert size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-title">Peringatan Berkas / Audit</div>
            <div className="stat-value">{issues.length}</div>
            <div className="stat-subtitle">Perlu penanganan admin segera</div>
          </div>
        </div>
      </div>

      {/* Pusat Peringatan Validasi (Alert Center) */}
      {issues.length > 0 && (
        <div className="card" style={{ marginBottom: '1.75rem', borderLeft: '4px solid #ef4444' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <AlertTriangle size={18} color="#ef4444" />
              Peringatan Kritis Kelayakan Dokumen ({issues.length} Temuan)
            </h3>
            <button 
              className="btn btn-sm btn-outline-primary"
              onClick={() => onNavigateTab('validation')}
            >
              Buka Halaman Validasi &rarr;
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {issues.slice(0, 5).map((issue, idx) => (
              <div 
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  background: issue.type === 'DANGER' ? '#fef2f2' : (issue.type === 'WARNING' ? '#fffbeb' : '#eff6ff'),
                  border: `1px solid ${issue.type === 'DANGER' ? '#fecaca' : (issue.type === 'WARNING' ? '#fde68a' : '#bfdbfe')}`,
                  fontSize: '0.8rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span 
                    className={`badge ${issue.type === 'DANGER' ? 'badge-danger' : (issue.type === 'WARNING' ? 'badge-warning' : 'badge-info')}`}
                  >
                    {issue.type === 'DANGER' ? 'KRITIS' : (issue.type === 'WARNING' ? 'PERHATIAN' : 'INFO')}
                  </span>
                  <div>
                    <strong>{issue.jamaah}</strong> (Paspor: {issue.noPaspor}) &mdash; <span style={{ color: 'var(--text-secondary)' }}>{issue.text}</span>
                  </div>
                </div>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => onNavigateTab('validation')}
                >
                  Periksa
                </button>
              </div>
            ))}
            {issues.length > 5 && (
              <div style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', paddingTop: '0.25rem' }}>
                + {issues.length - 5} temuan lainnya. Klik tombol "Buka Halaman Validasi" untuk melihat semua rincian.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigasi Cepat Operasional (Quick Links) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
        <div 
          className="card" 
          style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
          onClick={() => onNavigateTab('jamaah')}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: '#ecfdf5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={20} />
            </div>
            <ArrowRight size={16} color="var(--text-muted)" />
          </div>
          <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Database &amp; Input Jamaah</h4>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Input berkas terpandu anti-typo, pencarian data, serta mutasi pindah kloter.
          </p>
        </div>

        <div 
          className="card" 
          style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
          onClick={() => onNavigateTab('validation')}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileCheck size={20} />
            </div>
            <ArrowRight size={16} color="var(--text-muted)" />
          </div>
          <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Validasi, Manifest &amp; Siskopatuh</h4>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Audit 5 rules paspor, download Excel resmi visa &amp; Kemenag, serta arsip ZIP.
          </p>
        </div>

        <div 
          className="card" 
          style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
          onClick={() => onNavigateTab('rooms')}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={20} />
            </div>
            <ArrowRight size={16} color="var(--text-muted)" />
          </div>
          <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Room List (Kamar Hotel)</h4>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Auto-suggest kamar Quad/Triple/Double berdasarkan KK keluarga dan pemisahan gender.
          </p>
        </div>

        <div 
          className="card" 
          style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
          onClick={() => onNavigateTab('seats')}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: '#faf5ff', color: '#7e22ce', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Plane size={20} />
            </div>
            <ArrowRight size={16} color="var(--text-muted)" />
          </div>
          <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Seat Plan (Kursi Pesawat)</h4>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Denah kabin pesawat visual, keluarga berdampingan, dan prioritas akses lansia.
          </p>
        </div>
      </div>
    </div>
  );
}
