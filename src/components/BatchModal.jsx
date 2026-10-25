import React, { useState } from 'react';
import { X, Plane, Plus, Check } from 'lucide-react';

export default function BatchModal({
  isOpen,
  onClose,
  onSave
}) {
  const [formData, setFormData] = useState({
    namaPaket: '',
    tanggalBerangkat: '2027-02-15',
    tanggalPulang: '2027-02-24',
    kuotaSeat: 45,
    maskapai: 'Saudia Airlines',
    hotelMakkah: 'Pullman Zamzam Makkah',
    hotelMadinah: 'Madinah Hilton',
    hargaQuad: 32500000,
    hargaTriple: 34500000,
    hargaDouble: 37500000,
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.namaPaket) {
      alert('Nama paket wajib diisi!');
      return;
    }

    const newBatch = {
      ...formData,
      id: `BATCH-${formData.tanggalBerangkat}-${Date.now().toString().slice(-4)}`,
      kuotaSeat: Number(formData.kuotaSeat),
      status: 'OPEN',
    };

    onSave(newBatch);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>
            <Plane size={20} color="var(--primary)" />
            Buka Batch / Jadwal Keberangkatan Baru
          </h3>
          <button 
            onClick={onClose} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Nama Paket Umrah / Haji *</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="Contoh: Umrah Syawal 9 Hari Bintang 5"
                value={formData.namaPaket}
                onChange={(e) => setFormData({ ...formData, namaPaket: e.target.value })}
              />
            </div>

            <div className="form-grid" style={{ marginBottom: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Tanggal Berangkat *</label>
                <input
                  type="date"
                  required
                  className="form-control"
                  value={formData.tanggalBerangkat}
                  onChange={(e) => setFormData({ ...formData, tanggalBerangkat: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tanggal Kepulangan *</label>
                <input
                  type="date"
                  required
                  className="form-control"
                  value={formData.tanggalPulang}
                  onChange={(e) => setFormData({ ...formData, tanggalPulang: e.target.value })}
                />
              </div>
            </div>

            <div className="form-grid" style={{ marginBottom: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Alokasi Kuota Kursi Pesawat *</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={500}
                  className="form-control"
                  value={formData.kuotaSeat}
                  onChange={(e) => setFormData({ ...formData, kuotaSeat: e.target.value })}
                />
                <span className="form-hint">Jumlah tiket pesawat yang dibooking travel</span>
              </div>

              <div className="form-group">
                <label className="form-label">Maskapai Penerbangan</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Contoh: Saudia Airlines (SV-819)"
                  value={formData.maskapai}
                  onChange={(e) => setFormData({ ...formData, maskapai: e.target.value })}
                />
              </div>
            </div>

            <div className="form-grid" style={{ marginBottom: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Hotel Makkah</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Contoh: Pullman Zamzam Makkah"
                  value={formData.hotelMakkah}
                  onChange={(e) => setFormData({ ...formData, hotelMakkah: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Hotel Madinah</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Contoh: Madinah Hilton"
                  value={formData.hotelMadinah}
                  onChange={(e) => setFormData({ ...formData, hotelMadinah: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Estimasi Harga Paket Standar Quad (Rp)</label>
              <input
                type="number"
                step={500000}
                className="form-control"
                value={formData.hargaQuad}
                onChange={(e) => setFormData({ ...formData, hargaQuad: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              <Check size={16} /> Buat Batch Baru
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
