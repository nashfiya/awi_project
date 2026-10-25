import React, { useState } from 'react';
import { X, Printer, CheckCircle, ShieldCheck, QrCode } from 'lucide-react';

export default function BatchPrintModal({
  isOpen,
  onClose,
  batch,
  jamaahList
}) {
  const [filterVisaOnly, setFilterVisaOnly] = useState(true);

  if (!isOpen) return null;

  const printableJamaah = jamaahList.filter((j) => {
    if (j.statusJamaah === 'BATAL') return false;
    if (filterVisaOnly) return Boolean(j.noVisa);
    return true;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content full-print">
        {/* Modal Header (Hidden on actual print via CSS) */}
        <div className="modal-header no-print">
          <div>
            <h3>
              <Printer size={20} color="var(--primary)" />
              Cetak Massal Berkas Kloter (Visa &amp; Sertifikat Vaksin)
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
              Batch: <strong>{batch.namaPaket}</strong> &bull; Total {printableJamaah.length} Berkas Siap Cetak
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <label style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={filterVisaOnly} 
                onChange={(e) => setFilterVisaOnly(e.target.checked)} 
              />
              Hanya yang sudah terbit visa ({jamaahList.filter(j => j.noVisa).length})
            </label>

            <button className="btn btn-primary btn-sm" onClick={handlePrint}>
              <Printer size={15} /> Cetak Sekarang (Ctrl + P)
            </button>

            <button 
              onClick={onClose} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div className="modal-body" style={{ background: '#f1f5f9', padding: '1.5rem' }}>
          {printableJamaah.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: 'var(--radius-lg)' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Tidak ada jamaah dengan visa terbit untuk dicetak. Hapus centang filter di atas jika ingin mencetak template berkas seluruh jamaah.
              </p>
            </div>
          ) : (
            printableJamaah.map((j, idx) => {
              return (
                <div 
                  key={j.id} 
                  className="print-page-break"
                  style={{
                    background: 'white',
                    padding: '2.5rem',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-md)',
                    marginBottom: '2rem',
                    border: '1px solid var(--border-color)',
                    position: 'relative'
                  }}
                >
                  {/* Header Lembar Cetak */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #064e3b', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
                    <div>
                      <h2 style={{ fontSize: '1.25rem', color: '#064e3b', margin: 0 }}>
                        AWI TOUR HAJI &amp; UMRAH YOGYAKARTA
                      </h2>
                      <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
                        Dokumen Keberangkatan Resmi: Saudi e-Visa &amp; International Vaccine Certificate
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#047857' }}>
                        MANIFEST NO: #{idx + 1}
                      </span>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        Kloter: {batch.tanggalBerangkat}
                      </div>
                    </div>
                  </div>

                  {/* BAGIAN 1: SAUDI ARABIA ELECTRONIC VISA */}
                  <div style={{ border: '2px solid #047857', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem', background: '#fafffd' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px dashed #047857', paddingBottom: '0.5rem', marginBottom: '0.85rem' }}>
                      <div>
                        <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#065f46', fontWeight: 800, letterSpacing: '0.05em' }}>
                          KINGDOM OF SAUDI ARABIA &bull; MINISTRY OF HAJJ AND UMRAH
                        </div>
                        <h4 style={{ fontSize: '1.1rem', color: '#064e3b', margin: 0 }}>
                          ELECTRONIC UMRAH VISA (تأشيرة العمرة)
                        </h4>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.68rem', color: '#64748b', display: 'block' }}>VISA NUMBER:</span>
                        <strong style={{ fontSize: '1rem', fontFamily: 'monospace', color: '#047857' }}>
                          {j.noVisa || 'PENDING ISSUANCE'}
                        </strong>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', fontSize: '0.8rem' }}>
                      <div>
                        <span style={{ color: '#64748b', fontSize: '0.7rem', display: 'block' }}>FULL NAME / PILGRIM:</span>
                        <strong style={{ fontSize: '0.9rem' }}>{j.namaPaspor}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b', fontSize: '0.7rem', display: 'block' }}>PASSPORT NUMBER:</span>
                        <strong style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>{j.noPaspor}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b', fontSize: '0.7rem', display: 'block' }}>NATIONALITY:</span>
                        <strong>INDONESIA (IDN)</strong>
                      </div>

                      <div>
                        <span style={{ color: '#64748b', fontSize: '0.7rem', display: 'block' }}>DATE OF BIRTH:</span>
                        <strong>{j.tanggalLahir}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b', fontSize: '0.7rem', display: 'block' }}>GENDER:</span>
                        <strong>{j.jenisKelamin === 'L' ? 'MALE' : 'FEMALE'}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b', fontSize: '0.7rem', display: 'block' }}>PASSPORT EXPIRY:</span>
                        <strong>{j.masaBerlakuPaspor}</strong>
                      </div>

                      <div>
                        <span style={{ color: '#64748b', fontSize: '0.7rem', display: 'block' }}>PACKAGE / TIERS:</span>
                        <strong>{batch.namaPaket} ({j.paketKamar})</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b', fontSize: '0.7rem', display: 'block' }}>ENTRY FLIGHT:</span>
                        <strong>{batch.maskapai}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b', fontSize: '0.7rem', display: 'block' }}>AUTHORIZED OPERATOR:</span>
                        <strong>AWI TOUR YOGYAKARTA</strong>
                      </div>
                    </div>
                  </div>

                  {/* BAGIAN 2: SERTIFIKAT VAKSINASI INTERNASIONAL (ICV) */}
                  <div style={{ border: '2px solid #2563eb', borderRadius: '10px', padding: '1.25rem', background: '#f8faff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px dashed #2563eb', paddingBottom: '0.5rem', marginBottom: '0.85rem' }}>
                      <div>
                        <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#1e40af', fontWeight: 800, letterSpacing: '0.05em' }}>
                          KEMENTERIAN KESEHATAN REPUBLIK INDONESIA &bull; WHO ICV
                        </div>
                        <h4 style={{ fontSize: '1.1rem', color: '#1e3a8a', margin: 0 }}>
                          INTERNATIONAL CERTIFICATE OF VACCINATION (ICV)
                        </h4>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white', padding: '0.35rem 0.65rem', borderRadius: '6px', border: '1px solid #bfdbfe' }}>
                        <ShieldCheck size={20} color="#2563eb" />
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1e40af' }}>
                          TERVERIFIKASI RESMI
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', fontSize: '0.8rem' }}>
                      <div>
                        <span style={{ color: '#64748b', fontSize: '0.7rem', display: 'block' }}>JENIS VAKSINASI WAJIB:</span>
                        <strong style={{ color: '#1e40af' }}>{j.statusVaksin}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b', fontSize: '0.7rem', display: 'block' }}>NIK KTP:</span>
                        <strong style={{ fontFamily: 'monospace' }}>{j.nik}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b', fontSize: '0.7rem', display: 'block' }}>NO KARTU KELUARGA:</span>
                        <strong style={{ fontFamily: 'monospace' }}>{j.noKk}</strong>
                      </div>

                      <div style={{ gridColumn: 'span 2' }}>
                        <span style={{ color: '#64748b', fontSize: '0.7rem', display: 'block' }}>STATUS IMUNISASI MENINGITIS MENINGOKOKUS &amp; POLIO:</span>
                        <div style={{ fontSize: '0.78rem', color: '#047857', fontWeight: 700 }}>
                          ✓ Dosis Lengkap Sesuai Ketentuan Surat Edaran Kemenkes &amp; Otoritas Kesehatan Saudi
                        </div>
                      </div>

                      <div>
                        <span style={{ color: '#64748b', fontSize: '0.7rem', display: 'block' }}>KANTOR KESEHATAN PELABUHAN:</span>
                        <strong>KKP Kelas II Yogyakarta</strong>
                      </div>
                    </div>
                  </div>

                  {/* Footer Tanda Pengenal Passport Sleeve */}
                  <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94a3b8' }}>
                    <span>Lembar resmi untuk disisipkan ke dalam sampul fisik paspor jamaah AWI Tour Yogyakarta.</span>
                    <span>Dicetak otomatis oleh Sistem Operasional AWI Tour</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
