import React, { useState, useEffect } from 'react';
import { Building2, Users, RefreshCw, Download, ArrowRightLeft, Check, Sparkles } from 'lucide-react';
import { exportRoomListExcel } from '../services/exportService';

export default function RoomListVisualizer({
  batch,
  jamaahList
}) {
  const [rooms, setRooms] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null); // { roomIndex, slotIndex, jamaah }

  // Algoritma Auto-Suggest Kamar Hotel Berdasarkan KK & Gender
  const generateAutoRooms = () => {
    const activeJamaah = jamaahList.filter((j) => j.statusJamaah !== 'BATAL');
    const newRooms = [];
    let roomCounter = 101;

    // 1. Kelompokkan berdasarkan No KK (Keluarga)
    const familyMap = {};
    activeJamaah.forEach((j) => {
      if (!familyMap[j.noKk]) {
        familyMap[j.noKk] = [];
      }
      familyMap[j.noKk].push(j);
    });

    const unassignedSinglesMale = [];
    const unassignedSinglesFemale = [];

    // Proses keluarga yang memiliki 2 orang atau lebih
    Object.keys(familyMap).forEach((noKk) => {
      const members = familyMap[noKk];
      if (members.length >= 2) {
        // Tentukan tipe kamar
        const type = members.length >= 4 ? 'QUAD' : (members.length === 3 ? 'TRIPLE' : 'DOUBLE');
        const capacity = type === 'QUAD' ? 4 : (type === 'TRIPLE' ? 3 : 2);

        // Jika jumlah anggota lebih dari kapasitas, bagi ke beberapa kamar keluarga
        for (let i = 0; i < members.length; i += capacity) {
          const chunk = members.slice(i, i + capacity);
          newRooms.push({
            id: `ROOM-${roomCounter}`,
            roomNumber: `Kamar ${roomCounter}`,
            roomType: type,
            capacity: capacity,
            category: `Keluarga (KK: ...${noKk.slice(-4)})`,
            jamaahList: chunk,
          });
          roomCounter++;
        }
      } else {
        // Anggota mandiri / single
        const single = members[0];
        if (single.jenisKelamin === 'L') {
          unassignedSinglesMale.push(single);
        } else {
          unassignedSinglesFemale.push(single);
        }
      }
    });

    // 2. Gabungkan jamaah pria non-keluarga (Ikhwan)
    for (let i = 0; i < unassignedSinglesMale.length; i += 4) {
      const chunk = unassignedSinglesMale.slice(i, i + 4);
      newRooms.push({
        id: `ROOM-${roomCounter}`,
        roomNumber: `Kamar ${roomCounter}`,
        roomType: 'QUAD',
        capacity: 4,
        category: 'Ikhwan (Laki-Laki)',
        jamaahList: chunk,
      });
      roomCounter++;
    }

    // 3. Gabungkan jamaah wanita non-keluarga (Akhwat)
    for (let i = 0; i < unassignedSinglesFemale.length; i += 4) {
      const chunk = unassignedSinglesFemale.slice(i, i + 4);
      newRooms.push({
        id: `ROOM-${roomCounter}`,
        roomNumber: `Kamar ${roomCounter}`,
        roomType: 'QUAD',
        capacity: 4,
        category: 'Akhwat (Perempuan)',
        jamaahList: chunk,
      });
      roomCounter++;
    }

    setRooms(newRooms);
  };

  useEffect(() => {
    generateAutoRooms();
  }, [batch.id, jamaahList.length]);

  // Penanganan Tukar / Pindah Kamar Interaktif (Click to Swap)
  const handleSlotClick = (roomIndex, slotIndex, currentJamaah) => {
    if (!selectedSlot) {
      // Pilih jamaah pertama untuk dipindahkan
      if (currentJamaah) {
        setSelectedSlot({ roomIndex, slotIndex, jamaah: currentJamaah });
      }
    } else {
      // Eksekusi penukaran slot
      const updatedRooms = [...rooms];
      const sourceRoom = updatedRooms[selectedSlot.roomIndex];
      const targetRoom = updatedRooms[roomIndex];

      // Ambil jamaah target (jika ada)
      const targetJamaah = targetRoom.jamaahList[slotIndex];

      // Ganti di target
      if (slotIndex < targetRoom.jamaahList.length) {
        targetRoom.jamaahList[slotIndex] = selectedSlot.jamaah;
      } else {
        targetRoom.jamaahList.push(selectedSlot.jamaah);
      }

      // Ganti di source
      if (targetJamaah) {
        sourceRoom.jamaahList[selectedSlot.slotIndex] = targetJamaah;
      } else {
        sourceRoom.jamaahList.splice(selectedSlot.slotIndex, 1);
      }

      setRooms(updatedRooms);
      setSelectedSlot(null);
    }
  };

  const handleDownloadExcel = () => {
    exportRoomListExcel(batch, rooms);
  };

  return (
    <div>
      {/* Header Info Hotel & Kontrol */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Building2 size={24} color="var(--primary)" />
              <h2 style={{ fontSize: '1.35rem', margin: 0 }}>
                Room List Hotel Makkah &amp; Madinah
              </h2>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Hotel Makkah: <strong>{batch.hotelMakkah}</strong> &bull; Hotel Madinah: <strong>{batch.hotelMadinah}</strong>
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={generateAutoRooms}
              title="Susun ulang alokasi kamar otomatis berdasarkan KK keluarga dan gender"
            >
              <Sparkles size={15} color="var(--accent-gold)" />
              Auto-Suggest Ulang
            </button>

            <button 
              className="btn btn-primary btn-sm"
              onClick={handleDownloadExcel}
              title="Unduh Room List dalam format Excel"
            >
              <Download size={15} />
              Unduh Room List (.xlsx)
            </button>
          </div>
        </div>

        {/* Petunjuk Penggunaan Tukar Kamar */}
        {selectedSlot ? (
          <div style={{ marginTop: '1rem', padding: '0.65rem 1rem', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', color: '#92400e' }}>
            <span>
              Sedang memilih <strong>{selectedSlot.jamaah.namaPaspor}</strong>. Silakan klik pada kasur/slot di kamar lain untuk menukar atau memindahkan jamaah ini.
            </span>
            <button className="btn btn-sm btn-secondary" onClick={() => setSelectedSlot(null)}>
              Batalkan
            </button>
          </div>
        ) : (
          <div style={{ marginTop: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            💡 <em>Tips Admin:</em> Klik nama jamaah mana pun untuk memilihnya, lalu klik slot kamar lain untuk memindahkan/menukar posisi secara langsung.
          </div>
        )}
      </div>

      {/* Grid Kamar-Kamar Hotel */}
      <div className="rooms-grid">
        {rooms.map((room, roomIdx) => {
          const isFull = room.jamaahList.length >= room.capacity;

          return (
            <div key={room.id} className="room-card">
              <div className="room-header">
                <div>
                  <h4 style={{ fontSize: '0.95rem', margin: 0, color: 'var(--text-main)' }}>
                    {room.roomNumber}
                  </h4>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {room.category}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-warning" style={{ fontSize: '0.68rem', fontWeight: 700 }}>
                    {room.roomType}
                  </span>
                  <div style={{ fontSize: '0.68rem', color: isFull ? 'var(--primary)' : '#dc2626', fontWeight: 700, marginTop: '0.15rem' }}>
                    {room.jamaahList.length} / {room.capacity} Kasur
                  </div>
                </div>
              </div>

              {/* Slot Kasur */}
              <div className="room-slot-list">
                {Array.from({ length: room.capacity }).map((_, slotIdx) => {
                  const currentJamaah = room.jamaahList[slotIdx];
                  const isSelected = selectedSlot && selectedSlot.roomIndex === roomIdx && selectedSlot.slotIndex === slotIdx;

                  if (currentJamaah) {
                    return (
                      <div
                        key={slotIdx}
                        className="room-slot filled"
                        style={{
                          cursor: 'pointer',
                          border: isSelected ? '2px solid #d97706' : undefined,
                          background: isSelected ? '#fef3c7' : undefined
                        }}
                        onClick={() => handleSlotClick(roomIdx, slotIdx, currentJamaah)}
                        title="Klik untuk memilih dan menukar ke kamar lain"
                      >
                        <div style={{ overflow: 'hidden' }}>
                          <div style={{ fontWeight: 700, fontSize: '0.8rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                            {currentJamaah.namaPaspor}
                          </div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                            {currentJamaah.noPaspor} &bull; KK: ...{currentJamaah.noKk.slice(-4)}
                          </div>
                        </div>
                        <span className={`badge ${currentJamaah.jenisKelamin === 'L' ? 'badge-blue' : 'badge-purple'}`} style={{ fontSize: '0.65rem', flexShrink: 0 }}>
                          {currentJamaah.jenisKelamin === 'L' ? 'L' : 'P'}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={slotIdx}
                      className="room-slot empty"
                      style={{
                        cursor: selectedSlot ? 'pointer' : 'default',
                        borderStyle: 'dashed',
                        borderColor: selectedSlot ? '#d97706' : undefined,
                        background: selectedSlot ? '#fffbeb' : undefined
                      }}
                      onClick={() => selectedSlot && handleSlotClick(roomIdx, slotIdx, null)}
                    >
                      {selectedSlot ? '↳ Klik untuk Taruh di Sini' : '+ Kasur Kosong'}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
