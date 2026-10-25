import React, { useState } from 'react';
import { CreditCard, Luggage, Plus, Printer, CheckCircle, Clock, AlertCircle, FileText } from 'lucide-react';
import { generateInvoicePDF } from '../services/exportService';

export default function PaymentEquipmentView({
  batch,
  jamaahList,
  payments,
  equipment,
  onAddPayment,
  onUpdateEquipment
}) {
  const [activeSubTab, setActiveSubTab] = useState('PAYMENT'); // 'PAYMENT' or 'EQUIPMENT'
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [newPayment, setNewPayment] = useState({
    jamaahId: '',
    nominal: 10000000,
    tipe: 'DP',
    tanggal: new Date().toISOString().split('T')[0],
  });

  // Kalkulasi Keuangan
  const hargaPaketDefault = batch.hargaQuad || 32500000;
  const activeJamaah = jamaahList.filter((j) => j.statusJamaah !== 'BATAL');
  const totalTargetOmset = activeJamaah.length * hargaPaketDefault;
  const totalDiterima = payments.reduce((acc, curr) => acc + (Number(curr.nominal) || 0), 0);
  const sisaPiutang = Math.max(0, totalTargetOmset - totalDiterima);

  const handleOpenPaymentModal = (jamaahId = '') => {
    setNewPayment({
      jamaahId: jamaahId || (activeJamaah[0] ? activeJamaah[0].id : ''),
      nominal: 10000000,
      tipe: 'DP',
      tanggal: new Date().toISOString().split('T')[0],
    });
    setIsPaymentModalOpen(true);
  };

  const handleSavePaymentSubmit = (e) => {
    e.preventDefault();
    if (!newPayment.jamaahId || !newPayment.nominal) return;

    const noInvoice = `INV-AWI-${Date.now().toString().slice(-6)}`;
    const paymentRecord = {
      id: `PAY-${Date.now()}`,
      jamaahId: newPayment.jamaahId,
      nominal: Number(newPayment.nominal),
      tipe: newPayment.tipe,
      tanggal: newPayment.tanggal,
      noInvoice: noInvoice,
    };

    onAddPayment(paymentRecord);
    setIsPaymentModalOpen(false);

    // Auto generate PDF
    const targetJamaah = jamaahList.find((j) => j.id === newPayment.jamaahId);
    if (targetJamaah) {
      generateInvoicePDF(targetJamaah, paymentRecord, batch);
    }
  };

  const handlePrintInvoice = (payment) => {
    const targetJamaah = jamaahList.find((j) => j.id === payment.jamaahId);
    if (targetJamaah) {
      generateInvoicePDF(targetJamaah, payment, batch);
    }
  };

  const handleToggleItem = (jamaahId, itemKey) => {
    const current = equipment[jamaahId] || {
      koperBagasi: false,
      koperKabin: false,
      tasSelempang: false,
      kainIhramMukena: false,
      batik: false,
      bukuDoa: false,
      tglAmbil: '',
      penerima: ''
    };

    const updated = {
      ...current,
      [itemKey]: !current[itemKey],
      tglAmbil: current.tglAmbil || new Date().toISOString().split('T')[0]
    };
    onUpdateEquipment(jamaahId, updated);
  };

  const handleSetAllEquipmentComplete = (jamaahId, jamaahName) => {
    const updated = {
      koperBagasi: true,
      koperKabin: true,
      tasSelempang: true,
      kainIhramMukena: true,
      batik: true,
      bukuDoa: true,
      tglAmbil: new Date().toISOString().split('T')[0],
      penerima: jamaahName
    };
    onUpdateEquipment(jamaahId, updated);
  };

  return (
    <div>
      {/* Sub-Tab Navigasi */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <button
          className={`btn ${activeSubTab === 'PAYMENT' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveSubTab('PAYMENT')}
        >
          <CreditCard size={16} /> Pembayaran, DP &amp; Invoice
        </button>
        <button
          className={`btn ${activeSubTab === 'EQUIPMENT' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveSubTab('EQUIPMENT')}
        >
          <Luggage size={16} /> Ceklis Distribusi Perlengkapan
        </button>
      </div>

      {/* ================= TAB 1: PEMBAYARAN ================= */}
      {activeSubTab === 'PAYMENT' && (
        <div>
          {/* Ringkasan Keuangan */}
          <div className="stats-grid">
            <div className="stat-card green">
              <div className="stat-icon-wrapper">
                <CreditCard size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-title">Total Kas Masuk</div>
                <div className="stat-value">Rp {totalDiterima.toLocaleString('id-ID')}</div>
                <div className="stat-subtitle">{payments.length} transaksi tercatat</div>
              </div>
            </div>

            <div className="stat-card gold">
              <div className="stat-icon-wrapper">
                <Clock size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-title">Sisa Piutang / Belum Lunas</div>
                <div className="stat-value">Rp {sisaPiutang.toLocaleString('id-ID')}</div>
                <div className="stat-subtitle">Target omset: Rp {totalTargetOmset.toLocaleString('id-ID')}</div>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.15rem', margin: 0 }}>
              Riwayat Pembayaran &amp; Terbit Kuitansi
            </h3>
            <button className="btn btn-primary btn-sm" onClick={() => handleOpenPaymentModal('')}>
              <Plus size={15} /> + Catat Pembayaran / DP
            </button>
          </div>

          {/* Tabel Riwayat Pembayaran */}
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>No Invoice</th>
                  <th>Tanggal Bayar</th>
                  <th>Nama Jamaah</th>
                  <th>No Paspor</th>
                  <th>Tipe Bayar</th>
                  <th>Nominal Bayar</th>
                  <th style={{ textAlign: 'center' }}>Cetak Kuitansi</th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                      Belum ada transaksi pembayaran yang tercatat pada batch ini.
                    </td>
                  </tr>
                ) : (
                  payments.map((p) => {
                    const j = jamaahList.find((item) => item.id === p.jamaahId);
                    return (
                      <tr key={p.id}>
                        <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary)' }}>
                          {p.noInvoice}
                        </td>
                        <td>{p.tanggal}</td>
                        <td style={{ fontWeight: 700 }}>{j ? j.namaPaspor : 'Jamaah Tidak Ditemukan'}</td>
                        <td style={{ fontFamily: 'monospace' }}>{j ? j.noPaspor : '-'}</td>
                        <td>
                          <span className={`badge ${p.tipe === 'PELUNASAN' ? 'badge-success' : 'badge-warning'}`}>
                            {p.tipe}
                          </span>
                        </td>
                        <td style={{ fontWeight: 700, color: 'var(--primary-dark)' }}>
                          Rp {p.nominal.toLocaleString('id-ID')}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => handlePrintInvoice(p)}
                            title="Unduh & Cetak Kuitansi Resmi PDF"
                          >
                            <Printer size={13} /> Cetak PDF
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 2: PERLENGKAPAN ================= */}
      {activeSubTab === 'EQUIPMENT' && (
        <div>
          <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', margin: 0 }}>
                Checklist Distribusi Perlengkapan Jamaah
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Centang setiap item yang sudah diserahkan kepada jamaah atau perwakilan keluarga.
              </p>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Standard Item: Koper Bagasi, Koper Kabin, Tas Selempang, Ihram/Mukena, Batik, Buku Doa.
            </div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama Jamaah &amp; Paspor</th>
                  <th style={{ textAlign: 'center' }}>Koper Bagasi</th>
                  <th style={{ textAlign: 'center' }}>Koper Kabin</th>
                  <th style={{ textAlign: 'center' }}>Tas Selempang</th>
                  <th style={{ textAlign: 'center' }}>Ihram / Mukena</th>
                  <th style={{ textAlign: 'center' }}>Batik Seragam</th>
                  <th style={{ textAlign: 'center' }}>Buku Doa</th>
                  <th>Tanggal Penyerahan</th>
                  <th style={{ textAlign: 'center' }}>Aksi Cepat</th>
                </tr>
              </thead>
              <tbody>
                {activeJamaah.map((j, index) => {
                  const eq = equipment[j.id] || {
                    koperBagasi: false,
                    koperKabin: false,
                    tasSelempang: false,
                    kainIhramMukena: false,
                    batik: false,
                    bukuDoa: false,
                    tglAmbil: '',
                    penerima: ''
                  };

                  const countComplete = [
                    eq.koperBagasi,
                    eq.koperKabin,
                    eq.tasSelempang,
                    eq.kainIhramMukena,
                    eq.batik,
                    eq.bukuDoa
                  ].filter(Boolean).length;

                  return (
                    <tr key={j.id}>
                      <td style={{ fontWeight: 600, color: 'var(--text-muted)' }}>{index + 1}</td>
                      <td>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{j.namaPaspor}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          Paspor: {j.noPaspor} &bull; {j.jenisKelamin === 'L' ? 'Kain Ihram' : 'Mukena'}
                        </div>
                      </td>

                      {/* 1. Koper Bagasi */}
                      <td style={{ textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={Boolean(eq.koperBagasi)}
                          onChange={() => handleToggleItem(j.id, 'koperBagasi')}
                          style={{ cursor: 'pointer', width: 16, height: 16 }}
                        />
                      </td>

                      {/* 2. Koper Kabin */}
                      <td style={{ textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={Boolean(eq.koperKabin)}
                          onChange={() => handleToggleItem(j.id, 'koperKabin')}
                          style={{ cursor: 'pointer', width: 16, height: 16 }}
                        />
                      </td>

                      {/* 3. Tas Selempang */}
                      <td style={{ textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={Boolean(eq.tasSelempang)}
                          onChange={() => handleToggleItem(j.id, 'tasSelempang')}
                          style={{ cursor: 'pointer', width: 16, height: 16 }}
                        />
                      </td>

                      {/* 4. Ihram / Mukena */}
                      <td style={{ textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={Boolean(eq.kainIhramMukena)}
                          onChange={() => handleToggleItem(j.id, 'kainIhramMukena')}
                          style={{ cursor: 'pointer', width: 16, height: 16 }}
                        />
                      </td>

                      {/* 5. Batik */}
                      <td style={{ textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={Boolean(eq.batik)}
                          onChange={() => handleToggleItem(j.id, 'batik')}
                          style={{ cursor: 'pointer', width: 16, height: 16 }}
                        />
                      </td>

                      {/* 6. Buku Doa */}
                      <td style={{ textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={Boolean(eq.bukuDoa)}
                          onChange={() => handleToggleItem(j.id, 'bukuDoa')}
                          style={{ cursor: 'pointer', width: 16, height: 16 }}
                        />
                      </td>

                      {/* Tanggal & Penerima */}
                      <td>
                        {eq.tglAmbil ? (
                          <div style={{ fontSize: '0.75rem' }}>
                            <div>{eq.tglAmbil}</div>
                            <div style={{ color: 'var(--text-muted)' }}>Penerima: {eq.penerima || j.namaPaspor.split(' ')[0]}</div>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontStyle: 'italic' }}>Belum diambil</span>
                        )}
                      </td>

                      {/* Status & Aksi Cepat */}
                      <td style={{ textAlign: 'center' }}>
                        {countComplete === 6 ? (
                          <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                            ✓ 6/6 Lengkap
                          </span>
                        ) : (
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => handleSetAllEquipmentComplete(j.id, j.namaPaspor)}
                            title="Tandai seluruh item perlengkapan sudah diserahkan"
                          >
                            Set Semua ({countComplete}/6)
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Catat Pembayaran Baru */}
      {isPaymentModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>
                <CreditCard size={20} color="var(--primary)" />
                Catat Transaksi Pembayaran / DP
              </h3>
            </div>
            <form onSubmit={handleSavePaymentSubmit}>
              <div className="modal-body">
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Pilih Jamaah *</label>
                  <select
                    className="form-control"
                    value={newPayment.jamaahId}
                    onChange={(e) => setNewPayment({ ...newPayment, jamaahId: e.target.value })}
                    required
                  >
                    {activeJamaah.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.namaPaspor} ({j.noPaspor}) &mdash; Status: {j.statusJamaah}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Tipe Pembayaran</label>
                  <select
                    className="form-control"
                    value={newPayment.tipe}
                    onChange={(e) => setNewPayment({ ...newPayment, tipe: e.target.value })}
                  >
                    <option value="DP">Uang Muka / DP</option>
                    <option value="PELUNASAN">Pelunasan Penuh</option>
                    <option value="TAMBAHAN">Biaya Tambahan / Upgrade Kamar</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Nominal Pembayaran (Rp) *</label>
                  <input
                    type="number"
                    className="form-control"
                    step={500000}
                    value={newPayment.nominal}
                    onChange={(e) => setNewPayment({ ...newPayment, nominal: e.target.value })}
                    required
                  />
                  <span className="form-hint">
                    Terbilang: Rp {Number(newPayment.nominal || 0).toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label">Tanggal Transaksi</label>
                  <input
                    type="date"
                    className="form-control"
                    value={newPayment.tanggal}
                    onChange={(e) => setNewPayment({ ...newPayment, tanggal: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsPaymentModalOpen(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  <Printer size={15} /> Simpan &amp; Unduh Kuitansi PDF
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
