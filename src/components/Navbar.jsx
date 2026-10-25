import React from 'react';
import { Compass, Users, ShieldAlert, FileText, CheckCircle2, RotateCcw, Plus, Bed, Plane } from 'lucide-react';

export default function Navbar({
  batches,
  activeBatchId,
  onSelectBatch,
  userRole,
  onToggleRole,
  onOpenNewBatchModal,
  onResetData
}) {
  const activeBatch = batches.find((b) => b.id === activeBatchId) || batches[0];

  return (
    <header className="main-header">
      <div className="header-top">
        {/* Brand */}
        <div className="brand-wrapper">
          <div className="brand-logo-icon">
            <Compass size={28} />
          </div>
          <div className="brand-info">
            <h1>
              AWI TOUR
              <span style={{ fontSize: '0.65rem', background: '#d97706', color: 'white', padding: '0.15rem 0.5rem', borderRadius: '4px', verticalAlign: 'middle', letterSpacing: '0.05em' }}>
                HAJI & UMRAH
              </span>
            </h1>
            <p>Sistem Operasional & Manajemen Keberangkatan — D.I. Yogyakarta</p>
          </div>
        </div>

        {/* Batch Selector & Actions */}
        <div className="header-actions">
          <div className="batch-selector-box">
            <Plane size={16} color="#fde68a" />
            <select
              value={activeBatchId}
              onChange={(e) => onSelectBatch(e.target.value)}
              title="Pilih Batch Keberangkatan"
            >
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.tanggalBerangkat} | {b.namaPaket} (Kuota: {b.kuotaSeat})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onOpenNewBatchModal}
            className="btn btn-sm"
            style={{ background: 'rgba(255,255,255,0.18)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}
            title="Tambah Jadwal / Batch Baru"
          >
            <Plus size={14} /> Batch Baru
          </button>

          {/* Role Toggle: Admin Operasional vs Pimpinan */}
          <div className="role-badge-toggle">
            <button
              className={`role-btn ${userRole === 'ADMIN' ? 'active' : ''}`}
              onClick={() => onToggleRole('ADMIN')}
              title="Akses Staf Operasional (Input, Edit, Cetak)"
            >
              Admin Operasional
            </button>
            <button
              className={`role-btn ${userRole === 'OWNER' ? 'active' : ''}`}
              onClick={() => onToggleRole('OWNER')}
              title="Akses Pimpinan / Owner (Monitoring Eksekutif)"
            >
              Pimpinan / Owner
            </button>
          </div>

          {/* Reset Demo Data Button */}
          <button
            onClick={onResetData}
            className="btn btn-sm"
            style={{ background: 'rgba(0,0,0,0.2)', color: '#cbd5e1', border: 'none' }}
            title="Reset Data ke Default"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>
    </header>
  );
}
