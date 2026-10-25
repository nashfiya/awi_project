import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardView from './components/DashboardView';
import JamaahListView from './components/JamaahListView';
import JamaahFormModal from './components/JamaahFormModal';
import ValidationView from './components/ValidationView';
import RoomListVisualizer from './components/RoomListVisualizer';
import SeatPlanVisualizer from './components/SeatPlanVisualizer';
import PaymentEquipmentView from './components/PaymentEquipmentView';
import BatchPrintModal from './components/BatchPrintModal';
import BatchModal from './components/BatchModal';
import { storage } from './services/storage';
import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  Building2, 
  Plane, 
  CreditCard,
  Luggage
} from 'lucide-react';

export default function App() {
  const [batches, setBatches] = useState(() => storage.getBatches());
  const [activeBatchId, setActiveBatchId] = useState(() => storage.getActiveBatchId());
  const [jamaahList, setJamaahList] = useState(() => storage.getJamaah());
  const [documents, setDocuments] = useState(() => storage.getDocuments());
  const [payments, setPayments] = useState(() => storage.getPayments());
  const [equipment, setEquipment] = useState(() => storage.getEquipment());
  const [userRole, setUserRole] = useState(() => storage.getUserRole());
  const [activeTab, setActiveTab] = useState('dashboard');

  // Modal States
  const [isJamaahModalOpen, setIsJamaahModalOpen] = useState(false);
  const [selectedJamaahForEdit, setSelectedJamaahForEdit] = useState(null);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [isBatchPrintOpen, setIsBatchPrintOpen] = useState(false);

  // Active Batch Object
  const activeBatch = batches.find((b) => b.id === activeBatchId) || batches[0];

  // Jamaah yang terdaftar pada batch aktif
  const currentBatchJamaah = jamaahList.filter((j) => j.batchId === activeBatch.id);
  const currentBatchPayments = payments.filter((p) => {
    const j = jamaahList.find((item) => item.id === p.jamaahId);
    return j && j.batchId === activeBatch.id;
  });

  // Hitung jumlah issue audit untuk badge tab
  const departureDate = new Date(activeBatch.tanggalBerangkat);
  const issueCount = currentBatchJamaah.filter((j) => {
    const words = j.namaPaspor.trim().split(/\s+/).filter(Boolean);
    const expiryDate = new Date(j.masaBerlakuPaspor);
    const diffDays = Math.ceil((expiryDate - departureDate) / (1000 * 60 * 60 * 24));
    const docMeta = documents[j.id] || {};
    return diffDays < 180 || words.length < 3 || !docMeta.paspor || !docMeta.vaksin;
  }).length;

  // Handlers
  const handleSelectBatch = (id) => {
    setActiveBatchId(id);
    storage.setActiveBatchId(id);
  };

  const handleToggleRole = (role) => {
    setUserRole(role);
    storage.setUserRole(role);
  };

  const handleResetData = () => {
    if (confirm('Apakah Anda yakin ingin me-reset seluruh data ke data demo bawaan AWI Tour?')) {
      storage.resetToDefault();
    }
  };

  // Simpan Jamaah (Tambah / Edit)
  const handleSaveJamaah = (formData, docUploads) => {
    if (selectedJamaahForEdit) {
      // Edit
      const updatedList = jamaahList.map((j) => 
        j.id === selectedJamaahForEdit.id ? { ...formData, id: selectedJamaahForEdit.id, batchId: activeBatch.id } : j
      );
      setJamaahList(updatedList);
      storage.saveJamaah(updatedList);

      const updatedDocs = { ...documents, [selectedJamaahForEdit.id]: docUploads };
      setDocuments(updatedDocs);
      storage.saveDocuments(updatedDocs);
    } else {
      // Tambah Baru
      const newId = `JAMAAH-${Date.now().toString().slice(-4)}`;
      const newRecord = {
        ...formData,
        id: newId,
        batchId: activeBatch.id,
      };
      const updatedList = [...jamaahList, newRecord];
      setJamaahList(updatedList);
      storage.saveJamaah(updatedList);

      const updatedDocs = { ...documents, [newId]: docUploads };
      setDocuments(updatedDocs);
      storage.saveDocuments(updatedDocs);
    }

    setIsJamaahModalOpen(false);
    setSelectedJamaahForEdit(null);
  };

  const handleDeleteJamaah = (id) => {
    if (confirm('Hapus atau batalkan jamaah ini dari kloter?')) {
      const updated = jamaahList.filter((j) => j.id !== id);
      setJamaahList(updated);
      storage.saveJamaah(updated);
    }
  };

  const handleMoveBatch = (jamaahId, targetBatchId) => {
    const updated = jamaahList.map((j) => {
      if (j.id === jamaahId) {
        return { ...j, batchId: targetBatchId };
      }
      return j;
    });
    setJamaahList(updated);
    storage.saveJamaah(updated);
    alert('Jamaah berhasil dipindahkan ke batch tujuan!');
  };

  const handleUpdateVisa = (jamaahId, visaNumber) => {
    const updated = jamaahList.map((j) => {
      if (j.id === jamaahId) {
        return { ...j, noVisa: visaNumber };
      }
      return j;
    });
    setJamaahList(updated);
    storage.saveJamaah(updated);
  };

  const handleAddPayment = (newPaymentRecord) => {
    const updated = [newPaymentRecord, ...payments];
    setPayments(updated);
    storage.savePayments(updated);

    // Update status jamaah ke DP atau LUNAS jika perlu
    const targetJamaah = jamaahList.find((j) => j.id === newPaymentRecord.jamaahId);
    if (targetJamaah && targetJamaah.statusJamaah === 'TERDAFTAR') {
      const updatedJamaah = jamaahList.map((j) => {
        if (j.id === newPaymentRecord.jamaahId) {
          return { ...j, statusJamaah: newPaymentRecord.tipe === 'PELUNASAN' ? 'LUNAS' : 'DP' };
        }
        return j;
      });
      setJamaahList(updatedJamaah);
      storage.saveJamaah(updatedJamaah);
    }
  };

  const handleUpdateEquipment = (jamaahId, eqRecord) => {
    const updated = { ...equipment, [jamaahId]: eqRecord };
    setEquipment(updated);
    storage.saveEquipment(updated);
  };

  const handleCreateBatch = (newBatch) => {
    const updated = [...batches, newBatch];
    setBatches(updated);
    storage.saveBatches(updated);
    setActiveBatchId(newBatch.id);
    storage.setActiveBatchId(newBatch.id);
    setIsBatchModalOpen(false);
    alert(`Batch baru "${newBatch.namaPaket}" berhasil dibuat dan diaktifkan!`);
  };

  return (
    <div className="app-container">
      {/* Header Utama & Navigasi */}
      <Navbar
        batches={batches}
        activeBatchId={activeBatch.id}
        onSelectBatch={handleSelectBatch}
        userRole={userRole}
        onToggleRole={handleToggleRole}
        onOpenNewBatchModal={() => setIsBatchModalOpen(true)}
        onResetData={handleResetData}
      />

      {/* Nav Tabs */}
      <div className="nav-tabs-wrapper">
        <button
          className={`nav-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard size={16} />
          Ringkasan &amp; Kuota
        </button>

        <button
          className={`nav-tab-btn ${activeTab === 'jamaah' ? 'active' : ''}`}
          onClick={() => setActiveTab('jamaah')}
        >
          <Users size={16} />
          Database Jamaah
          <span className="tab-badge green">{currentBatchJamaah.length}</span>
        </button>

        <button
          className={`nav-tab-btn ${activeTab === 'validation' ? 'active' : ''}`}
          onClick={() => setActiveTab('validation')}
        >
          <ShieldCheck size={16} />
          Validasi, Manifest &amp; Siskopatuh
          {issueCount > 0 && <span className="tab-badge">{issueCount}</span>}
        </button>

        <button
          className={`nav-tab-btn ${activeTab === 'rooms' ? 'active' : ''}`}
          onClick={() => setActiveTab('rooms')}
        >
          <Building2 size={16} />
          Room List (Kamar)
        </button>

        <button
          className={`nav-tab-btn ${activeTab === 'seats' ? 'active' : ''}`}
          onClick={() => setActiveTab('seats')}
        >
          <Plane size={16} />
          Seat Plan (Pesawat)
        </button>

        <button
          className={`nav-tab-btn ${activeTab === 'payments' ? 'active' : ''}`}
          onClick={() => setActiveTab('payments')}
        >
          <CreditCard size={16} />
          Pembayaran &amp; Perlengkapan
        </button>
      </div>

      {/* Body Konten */}
      <main className="main-body">
        {activeTab === 'dashboard' && (
          <DashboardView
            batch={activeBatch}
            jamaahList={currentBatchJamaah}
            documents={documents}
            payments={currentBatchPayments}
            userRole={userRole}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'jamaah' && (
          <JamaahListView
            batch={activeBatch}
            batches={batches}
            jamaahList={currentBatchJamaah}
            documents={documents}
            userRole={userRole}
            onOpenAddModal={() => {
              setSelectedJamaahForEdit(null);
              setIsJamaahModalOpen(true);
            }}
            onOpenEditModal={(j) => {
              setSelectedJamaahForEdit(j);
              setIsJamaahModalOpen(true);
            }}
            onDeleteJamaah={handleDeleteJamaah}
            onMoveBatch={handleMoveBatch}
          />
        )}

        {activeTab === 'validation' && (
          <ValidationView
            batch={activeBatch}
            jamaahList={currentBatchJamaah}
            documents={documents}
            onUpdateJamaahVisa={handleUpdateVisa}
            onOpenBatchPrint={() => setIsBatchPrintOpen(true)}
          />
        )}

        {activeTab === 'rooms' && (
          <RoomListVisualizer
            batch={activeBatch}
            jamaahList={currentBatchJamaah}
          />
        )}

        {activeTab === 'seats' && (
          <SeatPlanVisualizer
            batch={activeBatch}
            jamaahList={currentBatchJamaah}
          />
        )}

        {activeTab === 'payments' && (
          <PaymentEquipmentView
            batch={activeBatch}
            jamaahList={currentBatchJamaah}
            payments={currentBatchPayments}
            equipment={equipment}
            onAddPayment={handleAddPayment}
            onUpdateEquipment={handleUpdateEquipment}
          />
        )}
      </main>

      {/* MODAL-MODAL INTERAKTIF */}
      <JamaahFormModal
        isOpen={isJamaahModalOpen}
        onClose={() => {
          setIsJamaahModalOpen(false);
          setSelectedJamaahForEdit(null);
        }}
        onSave={handleSaveJamaah}
        initialData={selectedJamaahForEdit}
        batch={activeBatch}
        documents={documents}
      />

      <BatchPrintModal
        isOpen={isBatchPrintOpen}
        onClose={() => setIsBatchPrintOpen(false)}
        batch={activeBatch}
        jamaahList={currentBatchJamaah}
      />

      <BatchModal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        onSave={handleCreateBatch}
      />
    </div>
  );
}
