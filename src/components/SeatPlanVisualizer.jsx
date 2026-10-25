import React, { useState, useEffect } from 'react';
import { Plane, Users, Download, Sparkles, AlertCircle, Info } from 'lucide-react';
import { exportSeatPlanExcel } from '../services/exportService';

export default function SeatPlanVisualizer({
  batch,
  jamaahList
}) {
  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null); // { seatIndex, seat }

  // Buat denah pesawat standar Umrah (Konfigurasi 3 - 3: A B C [Lorong] D E F)
  const generateAutoSeats = () => {
    const activeJamaah = jamaahList.filter((j) => j.statusJamaah !== 'BATAL');
    const cols = ['A', 'B', 'C', 'D', 'E', 'F'];
    const totalRows = 10;
    const initialGrid = [];

    for (let r = 1; r <= totalRows; r++) {
      cols.forEach((c) => {
        const isAisle = c === 'C' || c === 'D';
        initialGrid.push({
          seatCode: `${r}${c}`,
          row: r,
          col: c,
          isAisle: isAisle,
          jamaah: null,
          isFamily: false,
          isElderly: false,
        });
      });
    }

    // Pilah Jamaah: Lansia, Keluarga, Single
    const elderlyList = [];
    const familyMap = {};
    const singlesList = [];

    activeJamaah.forEach((j) => {
      const birthYear = new Date(j.tanggalLahir).getFullYear();
      const age = new Date().getFullYear() - birthYear;
      if (age >= 60) {
        elderlyList.push(j);
      } else {
        if (!familyMap[j.noKk]) familyMap[j.noKk] = [];
        familyMap[j.noKk].push(j);
      }
    });

    let seatIdx = 0;

    // 1. Alokasi Lansia di baris awal (Row 1-3) posisi Lorong / Dekat Pintu
    elderlyList.forEach((j) => {
      // Cari seat lorong kosong di baris depan
      const aisleSeat = initialGrid.find((s) => s.isAisle && !s.jamaah && s.row <= 4);
      if (aisleSeat) {
        aisleSeat.jamaah = j;
        aisleSeat.isElderly = true;
      } else {
        // Fallback seat kosong pertama
        const emptySeat = initialGrid.find((s) => !s.jamaah);
        if (emptySeat) {
          emptySeat.jamaah = j;
          emptySeat.isElderly = true;
        }
      }
    });

    // 2. Alokasi Keluarga berdampingan dalam 1 baris
    Object.keys(familyMap).forEach((noKk) => {
      const members = familyMap[noKk];
      if (members.length >= 2) {
        // Cari baris yang punya cukup kursi berdampingan
        members.forEach((m) => {
          const emptySeat = initialGrid.find((s) => !s.jamaah);
          if (emptySeat) {
            emptySeat.jamaah = m;
            emptySeat.isFamily = true;
          }
        });
      } else {
        singlesList.push(members[0]);
      }
    });

    // 3. Alokasi Jamaah Mandiri / Sisanya
    singlesList.forEach((s) => {
      const emptySeat = initialGrid.find((s) => !s.jamaah);
      if (emptySeat) {
        emptySeat.jamaah = s;
      }
    });

    setSeats(initialGrid);
  };

  useEffect(() => {
    generateAutoSeats();
  }, [batch.id, jamaahList.length]);

  // Penanganan Tukar Kursi Interaktif
  const handleSeatClick = (seat, index) => {
    if (!selectedSeat) {
      if (seat.jamaah) {
        setSelectedSeat({ index, seat });
      }
    } else {
      const updatedSeats = [...seats];
      const sourceSeat = updatedSeats[selectedSeat.index];
      const targetSeat = updatedSeats[index];

      // Tukar objek jamaah
      const tempJamaah = targetSeat.jamaah;
      const tempElderly = targetSeat.isElderly;
      const tempFamily = targetSeat.isFamily;

      targetSeat.jamaah = sourceSeat.jamaah;
      targetSeat.isElderly = sourceSeat.isElderly;
      targetSeat.isFamily = sourceSeat.isFamily;

      sourceSeat.jamaah = tempJamaah;
      sourceSeat.isElderly = tempElderly;
      sourceSeat.isFamily = tempFamily;

      setSeats(updatedSeats);
      setSelectedSeat(null);
    }
  };

  const handleDownloadExcel = () => {
    exportSeatPlanExcel(batch, seats);
  };

  // Hitung jumlah baris
  const rows = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div>
      {/* Header Info Pesawat & Kontrol */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Plane size={24} color="var(--primary)" />
              <h2 style={{ fontSize: '1.35rem', margin: 0 }}>
                Seat Plan Kabin Pesawat
              </h2>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Penerbangan: <strong>{batch.maskapai}</strong> &bull; Total Kapasitas Kursi: <strong>{batch.kuotaSeat} Seat</strong>
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={generateAutoSeats}
              title="Susun ulang otomatis (Prioritas Lansia di lorong & keluarga berdampingan)"
            >
              <Sparkles size={15} color="var(--accent-gold)" />
              Auto-Suggest Ulang
            </button>

            <button 
              className="btn btn-primary btn-sm"
              onClick={handleDownloadExcel}
              title="Unduh denah kursi dalam format Excel"
            >
              <Download size={15} />
              Unduh Seat Plan (.xlsx)
            </button>
          </div>
        </div>

        {/* Legend / Keterangan Warna */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap', fontSize: '0.78rem', background: '#f8fafc', padding: '0.65rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: 14, height: 14, background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 3 }} />
            <span><strong>Lansia:</strong> Prioritas Lorong (Aisle) / Depan</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: 14, height: 14, background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 3 }} />
            <span><strong>Keluarga:</strong> Duduk Bersebelahan (Acuan No KK)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: 14, height: 14, background: '#dbeafe', border: '1px solid #93c5fd', borderRadius: 3 }} />
            <span><strong>Reguler:</strong> Jamaah Mandiri</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: 14, height: 14, background: 'white', border: '1px solid #cbd5e1', borderRadius: 3 }} />
            <span><strong>Kosong:</strong> Kursi Tersedia</span>
          </div>
        </div>

        {/* Interaktif Selection Notice */}
        {selectedSeat && (
          <div style={{ marginTop: '0.75rem', padding: '0.5rem 0.85rem', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: '#92400e' }}>
            <span>
              Sedang memilih kursi <strong>{selectedSeat.seat.seatCode} ({selectedSeat.seat.jamaah?.namaPaspor})</strong>. Klik pada kursi lain untuk menukar posisi.
            </span>
            <button className="btn btn-sm btn-secondary" onClick={() => setSelectedSeat(null)}>
              Batal
            </button>
          </div>
        )}
      </div>

      {/* Denah Fisik Kabin Pesawat */}
      <div className="airplane-cabin">
        <div className="cockpit-indicator">
          &uarr; DEPAN PESAWAT / KOKPIT &uarr;
        </div>

        {/* Header Huruf Kursi */}
        <div className="seat-row" style={{ fontWeight: 800, color: '#64748b', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
          <div style={{ width: 48, textAlign: 'center' }}>A</div>
          <div style={{ width: 48, textAlign: 'center' }}>B</div>
          <div style={{ width: 48, textAlign: 'center' }}>C</div>
          <div className="seat-aisle">LORONG</div>
          <div style={{ width: 48, textAlign: 'center' }}>D</div>
          <div style={{ width: 48, textAlign: 'center' }}>E</div>
          <div style={{ width: 48, textAlign: 'center' }}>F</div>
        </div>

        {/* Render Baris Kursi */}
        {rows.map((rowNum) => {
          const rowSeats = seats.filter((s) => s.row === rowNum);
          const leftSeats = rowSeats.filter((s) => ['A', 'B', 'C'].includes(s.col));
          const rightSeats = rowSeats.filter((s) => ['D', 'E', 'F'].includes(s.col));

          return (
            <div key={rowNum} className="seat-row">
              {/* Sisi Kiri (A, B, C) */}
              {leftSeats.map((seat) => {
                const idx = seats.findIndex((s) => s.seatCode === seat.seatCode);
                const isSelected = selectedSeat && selectedSeat.seat.seatCode === seat.seatCode;
                let seatClass = 'seat-btn';
                if (seat.isElderly) seatClass += ' elderly';
                else if (seat.isFamily) seatClass += ' family';
                else if (seat.jamaah) seatClass += ' filled';

                return (
                  <button
                    key={seat.seatCode}
                    className={seatClass}
                    style={{
                      border: isSelected ? '2px solid #b45309' : undefined,
                      transform: isSelected ? 'scale(1.1)' : undefined,
                      boxShadow: isSelected ? '0 0 0 3px rgba(245, 158, 11, 0.4)' : undefined,
                    }}
                    onClick={() => handleSeatClick(seat, idx)}
                    title={seat.jamaah ? `${seat.seatCode}: ${seat.jamaah.namaPaspor} (${seat.jamaah.noPaspor})` : `${seat.seatCode}: Kosong`}
                  >
                    <span>{seat.seatCode}</span>
                    <span style={{ fontSize: '0.58rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', whiteSpace: 'nowrap', padding: '0 2px' }}>
                      {seat.jamaah ? seat.jamaah.namaPaspor.split(' ')[0] : '-'}
                    </span>
                  </button>
                );
              })}

              {/* Lorong Pesawat */}
              <div className="seat-aisle">
                {rowNum}
              </div>

              {/* Sisi Kanan (D, E, F) */}
              {rightSeats.map((seat) => {
                const idx = seats.findIndex((s) => s.seatCode === seat.seatCode);
                const isSelected = selectedSeat && selectedSeat.seat.seatCode === seat.seatCode;
                let seatClass = 'seat-btn';
                if (seat.isElderly) seatClass += ' elderly';
                else if (seat.isFamily) seatClass += ' family';
                else if (seat.jamaah) seatClass += ' filled';

                return (
                  <button
                    key={seat.seatCode}
                    className={seatClass}
                    style={{
                      border: isSelected ? '2px solid #b45309' : undefined,
                      transform: isSelected ? 'scale(1.1)' : undefined,
                      boxShadow: isSelected ? '0 0 0 3px rgba(245, 158, 11, 0.4)' : undefined,
                    }}
                    onClick={() => handleSeatClick(seat, idx)}
                    title={seat.jamaah ? `${seat.seatCode}: ${seat.jamaah.namaPaspor} (${seat.jamaah.noPaspor})` : `${seat.seatCode}: Kosong`}
                  >
                    <span>{seat.seatCode}</span>
                    <span style={{ fontSize: '0.58rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', whiteSpace: 'nowrap', padding: '0 2px' }}>
                      {seat.jamaah ? seat.jamaah.namaPaspor.split(' ')[0] : '-'}
                    </span>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
