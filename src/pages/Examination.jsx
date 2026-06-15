import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Stethoscope, Clipboard, Pill, FileText, Camera, Microscope,
  Save, Printer, Download, Send, Plus, Trash2, Edit, X,
  CheckCircle, AlertCircle, User, Calendar, Clock, Activity,
  Smile, Heart, Droplet, Thermometer, Ruler,
  ChevronLeft, ChevronRight, Search, Filter, Image as ImageIcon
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import dentalAPI from '../services/dentalAPI';

const Examination = () => {
  const { id } = useParams(); // patient id
  const navigate = useNavigate();
  
  // ========== STATE ==========
  const [patient, setPatient] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('examination');
  const [showMedicineModal, setShowMedicineModal] = useState(false);
  const [showTreatmentModal, setShowTreatmentModal] = useState(false);
  const [selectedTooth, setSelectedTooth] = useState(null);
  
  // Form Pemeriksaan
  const [examinationData, setExaminationData] = useState({
    chief_complaint: '',
    history_of_illness: '',
    medical_history: '',
    dental_history: '',
    vital_signs: {
      blood_pressure: '',
      heart_rate: '',
      respiratory_rate: '',
      temperature: '',
      oxygen_saturation: ''
    },
    extra_oral: {
      lymph_nodes: 'normal',
      tmj: 'normal',
      salivary_glands: 'normal',
      lips: 'normal',
      skin: 'normal'
    },
    intra_oral: {
      oral_hygiene: 'good',
      gingiva: 'normal',
      mucosa: 'normal',
      palate: 'normal',
      tongue: 'normal',
      tonsils: 'normal',
      caries_risk: 'low'
    },
    teeth_examination: {},
    diagnosis: '',
    treatment_plan: '',
    notes: ''
  });
  
  // List Tindakan yang dipilih
  const [selectedTreatments, setSelectedTreatments] = useState([]);
  
  // List Resep Obat
  const [prescriptions, setPrescriptions] = useState([]);
  const [currentMedicine, setCurrentMedicine] = useState({
    name: '',
    dosage: '',
    frequency: '',
    duration: '',
    notes: ''
  });
  
  // List Dental Chart (gigi)
  const toothNumbers = [
    18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28,
    48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38
  ];
  
  const toothConditions = {
    healthy: { label: 'Sehat', color: 'bg-green-500', icon: '✅' },
    caries: { label: 'Karies', color: 'bg-yellow-500', icon: '🦷' },
    filling: { label: 'Tambalan', color: 'bg-blue-500', icon: '🔧' },
    extraction: { label: 'Cabut', color: 'bg-red-500', icon: '⚠️' },
    crown: { label: 'Crown', color: 'bg-purple-500', icon: '👑' },
    root_canal: { label: 'Perawatan Saluran Akar', color: 'bg-orange-500', icon: '⚡' },
    implant: { label: 'Implan', color: 'bg-teal-500', icon: '💎' },
    missing: { label: 'Hilang', color: 'bg-gray-500', icon: '❌' },
    fracture: { label: 'Fraktur', color: 'bg-red-400', icon: '💔' },
    mobility: { label: 'Mobilitas', color: 'bg-pink-500', icon: '🌀' }
  };

  // ========== FETCH DATA ==========
  const fetchData = async () => {
    setLoading(true);
    try {
      const [patientData, appointmentsData, treatmentsData] = await Promise.all([
        dentalAPI.patients.getById(id),
        dentalAPI.appointments.getByPatientId(id),
        dentalAPI.treatments.getActive()
      ]);
      
      setPatient(patientData);
      setTreatments(treatmentsData);
      
      // Get latest appointment
      const latestAppointment = appointmentsData?.sort((a, b) => 
        new Date(b.appointment_date) - new Date(a.appointment_date)
      )[0];
      setAppointment(latestAppointment);
      
      // Load saved examination if exists
      const savedExam = localStorage.getItem(`exam_${id}`);
      if (savedExam) {
        const parsed = JSON.parse(savedExam);
        setExaminationData(parsed);
        setSelectedTreatments(parsed.selectedTreatments || []);
        setPrescriptions(parsed.prescriptions || []);
      }
      
    } catch (error) {
      console.error('Error fetching examination data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  // ========== HANDLE FUNCTIONS ==========
  const handleExaminationChange = (section, field, value) => {
    if (section) {
      setExaminationData({
        ...examinationData,
        [section]: {
          ...examinationData[section],
          [field]: value
        }
      });
    } else {
      setExaminationData({
        ...examinationData,
        [field]: value
      });
    }
  };

  const handleToothClick = (tooth) => {
    setSelectedTooth(tooth);
    // Open modal for tooth condition
    const condition = window.prompt(
      `Kondisi gigi ${tooth}:\n` +
      Object.entries(toothConditions).map(([key, val]) => `${key}: ${val.label}`).join('\n'),
      examinationData.teeth_examination[tooth] || 'healthy'
    );
    if (condition && toothConditions[condition]) {
      setExaminationData({
        ...examinationData,
        teeth_examination: {
          ...examinationData.teeth_examination,
          [tooth]: condition
        }
      });
    }
  };

  const addTreatment = (treatment) => {
    if (!selectedTreatments.find(t => t.id === treatment.id)) {
      setSelectedTreatments([...selectedTreatments, treatment]);
    }
  };

  const removeTreatment = (treatmentId) => {
    setSelectedTreatments(selectedTreatments.filter(t => t.id !== treatmentId));
  };

  const addPrescription = () => {
    if (currentMedicine.name && currentMedicine.dosage) {
      setPrescriptions([...prescriptions, { ...currentMedicine, id: Date.now() }]);
      setCurrentMedicine({ name: '', dosage: '', frequency: '', duration: '', notes: '' });
      setShowMedicineModal(false);
    }
  };

  const removePrescription = (id) => {
    setPrescriptions(prescriptions.filter(p => p.id !== id));
  };

  const saveExamination = async () => {
    setSaving(true);
    try {
      // Prepare data to save
      const examinationRecord = {
        patient_id: parseInt(id),
        appointment_id: appointment?.id,
        examination_date: new Date().toISOString(),
        chief_complaint: examinationData.chief_complaint,
        history: {
          illness: examinationData.history_of_illness,
          medical: examinationData.medical_history,
          dental: examinationData.dental_history
        },
        vital_signs: examinationData.vital_signs,
        extra_oral: examinationData.extra_oral,
        intra_oral: examinationData.intra_oral,
        teeth_examination: examinationData.teeth_examination,
        diagnosis: examinationData.diagnosis,
        treatment_plan: examinationData.treatment_plan,
        treatments: selectedTreatments,
        prescriptions: prescriptions,
        notes: examinationData.notes
      };
      
      // Save to localStorage
      localStorage.setItem(`exam_${id}`, JSON.stringify({
        ...examinationData,
        selectedTreatments,
        prescriptions,
        last_saved: new Date().toISOString()
      }));
      
      alert('Data pemeriksaan berhasil disimpan!');
      
      // Log activity
      await dentalAPI.activityLogs.log(1, 'CREATE', 'examination', id, null, { patient_id: id });
      
    } catch (error) {
      console.error('Error saving examination:', error);
      alert('Gagal menyimpan data pemeriksaan');
    } finally {
      setSaving(false);
    }
  };

  const printExamination = () => {
    window.print();
  };

  const downloadPDF = () => {
    alert('Fitur download PDF akan segera tersedia');
  };

  // Get tooth color based on condition
  const getToothColor = (tooth) => {
    const condition = examinationData.teeth_examination[tooth];
    return toothConditions[condition]?.color || toothConditions.healthy.color;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500">Memuat data pemeriksaan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate(-1)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <ChevronLeft size={20} />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Pemeriksaan Pasien</h1>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <User size={14} />
                  <span>{patient?.full_name}</span>
                  <span className="text-gray-300">|</span>
                  <span className="font-mono">{patient?.rm_number}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={saveExamination} disabled={saving} className="px-4 py-2 bg-primary text-white rounded-lg flex items-center gap-2">
                <Save size={16} /> {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
              <button onClick={printExamination} className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2">
                <Printer size={16} /> Print
              </button>
              <button onClick={downloadPDF} className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2">
                <Download size={16} /> PDF
              </button>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="px-6 border-t border-gray-100 flex gap-6 overflow-x-auto">
          {[
            { id: 'examination', label: 'Pemeriksaan', icon: Stethoscope },
            { id: 'dental_chart', label: 'Dental Chart', icon: Smile },
            { id: 'treatment', label: 'Tindakan', icon: Activity },
            { id: 'prescription', label: 'Resep Obat', icon: Pill },
            { id: 'summary', label: 'Ringkasan', icon: FileText }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-1 flex items-center gap-2 border-b-2 transition ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* Tab: Pemeriksaan */}
        {activeTab === 'examination' && (
          <div className="space-y-6">
            {/* Keluhan Utama */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clipboard size={20} className="text-primary" /> Keluhan & Riwayat
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Keluhan Utama *</label>
                  <textarea
                    value={examinationData.chief_complaint}
                    onChange={(e) => handleExaminationChange(null, 'chief_complaint', e.target.value)}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    placeholder="Contoh: Sakit gigi kanan bawah sudah 3 hari, terasa berdenyut..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Riwayat Penyakit Sekarang</label>
                    <textarea
                      value={examinationData.history_of_illness}
                      onChange={(e) => handleExaminationChange(null, 'history_of_illness', e.target.value)}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Perkembangan penyakit..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Riwayat Penyakit Dahulu</label>
                    <textarea
                      value={examinationData.medical_history}
                      onChange={(e) => handleExaminationChange(null, 'medical_history', e.target.value)}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Riwayat penyakit sistemik, alergi, dll..."
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Riwayat Kesehatan Gigi</label>
                  <textarea
                    value={examinationData.dental_history}
                    onChange={(e) => handleExaminationChange(null, 'dental_history', e.target.value)}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Riwayat perawatan gigi sebelumnya..."
                  />
                </div>
              </div>
            </div>

            {/* Vital Signs */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Heart size={20} className="text-red-500" /> Tanda Vital
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tekanan Darah</label>
                  <input
                    type="text"
                    value={examinationData.vital_signs.blood_pressure}
                    onChange={(e) => handleExaminationChange('vital_signs', 'blood_pressure', e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-lg"
                    placeholder="120/80"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nadi (/menit)</label>
                  <input
                    type="text"
                    value={examinationData.vital_signs.heart_rate}
                    onChange={(e) => handleExaminationChange('vital_signs', 'heart_rate', e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-lg"
                    placeholder="72"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Respirasi (/menit)</label>
                  <input
                    type="text"
                    value={examinationData.vital_signs.respiratory_rate}
                    onChange={(e) => handleExaminationChange('vital_signs', 'respiratory_rate', e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-lg"
                    placeholder="18"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Suhu (°C)</label>
                  <input
                    type="text"
                    value={examinationData.vital_signs.temperature}
                    onChange={(e) => handleExaminationChange('vital_signs', 'temperature', e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-lg"
                    placeholder="36.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">SpO2 (%)</label>
                  <input
                    type="text"
                    value={examinationData.vital_signs.oxygen_saturation}
                    onChange={(e) => handleExaminationChange('vital_signs', 'oxygen_saturation', e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-lg"
                    placeholder="98"
                  />
                </div>
              </div>
            </div>

            {/* Pemeriksaan Fisik */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Extra Oral */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Pemeriksaan Ekstra Oral</h2>
                <div className="space-y-3">
                  {Object.entries(examinationData.extra_oral).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-600 capitalize">{key.replace('_', ' ')}</label>
                      <select
                        value={value}
                        onChange={(e) => handleExaminationChange('extra_oral', key, e.target.value)}
                        className="px-3 py-1 border rounded-lg text-sm"
                      >
                        <option value="normal">Normal</option>
                        <option value="abnormal">Abnormal</option>
                        <option value="swelling">Pembengkakan</option>
                        <option value="pain">Nyeri</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Intra Oral */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Pemeriksaan Intra Oral</h2>
                <div className="space-y-3">
                  {Object.entries(examinationData.intra_oral).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-600 capitalize">{key.replace('_', ' ')}</label>
                      <select
                        value={value}
                        onChange={(e) => handleExaminationChange('intra_oral', key, e.target.value)}
                        className="px-3 py-1 border rounded-lg text-sm"
                      >
                        <option value="normal">Normal</option>
                        <option value="good">Baik</option>
                        <option value="fair">Sedang</option>
                        <option value="poor">Buruk</option>
                        <option value="inflamed">Peradangan</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Diagnosis & Treatment Plan */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Diagnosis & Rencana Perawatan</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
                  <textarea
                    value={examinationData.diagnosis}
                    onChange={(e) => handleExaminationChange(null, 'diagnosis', e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Diagnosis banding dan diagnosis kerja..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rencana Perawatan</label>
                  <textarea
                    value={examinationData.treatment_plan}
                    onChange={(e) => handleExaminationChange(null, 'treatment_plan', e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Rencana tindakan yang akan dilakukan..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catatan Lain</label>
                  <textarea
                    value={examinationData.notes}
                    onChange={(e) => handleExaminationChange(null, 'notes', e.target.value)}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Catatan tambahan..."
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Dental Chart */}
        {activeTab === 'dental_chart' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Smile size={20} className="text-primary" /> Dental Chart (Peta Gigi)
            </h2>
            <p className="text-sm text-gray-500 mb-6">Klik pada gigi untuk mengubah kondisi</p>
            
            {/* Upper Teeth */}
            <div className="mb-8">
              <div className="text-center mb-2 text-sm font-medium text-gray-500">RAHANG ATAS</div>
              <div className="flex justify-center gap-1 flex-wrap">
                {toothNumbers.filter(t => t >= 11 && t <= 18).map(tooth => (
                  <button
                    key={tooth}
                    onClick={() => handleToothClick(tooth)}
                    className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center transition-all hover:scale-105 ${getToothColor(tooth)} text-white font-bold`}
                  >
                    <span>{tooth}</span>
                    <span className="text-[10px]">{toothConditions[examinationData.teeth_examination[tooth]]?.icon}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Lower Teeth */}
            <div>
              <div className="text-center mb-2 text-sm font-medium text-gray-500">RAHANG BAWAH</div>
              <div className="flex justify-center gap-1 flex-wrap">
                {toothNumbers.filter(t => t >= 31 && t <= 48).map(tooth => (
                  <button
                    key={tooth}
                    onClick={() => handleToothClick(tooth)}
                    className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center transition-all hover:scale-105 ${getToothColor(tooth)} text-white font-bold`}
                  >
                    <span>{tooth}</span>
                    <span className="text-[10px]">{toothConditions[examinationData.teeth_examination[tooth]]?.icon}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="mt-8 pt-4 border-t">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Keterangan Kondisi Gigi:</h3>
              <div className="flex flex-wrap gap-3">
                {Object.entries(toothConditions).map(([key, val]) => (
                  <div key={key} className="flex items-center gap-1">
                    <div className={`w-4 h-4 rounded ${val.color}`}></div>
                    <span className="text-xs">{val.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Tindakan */}
        {activeTab === 'treatment' && (
          <div className="space-y-6">
            {/* Available Treatments */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Activity size={20} className="text-primary" /> Daftar Tindakan
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                {treatments.map(treatment => (
                  <button
                    key={treatment.id}
                    onClick={() => addTreatment(treatment)}
                    disabled={selectedTreatments.some(t => t.id === treatment.id)}
                    className={`p-3 border rounded-lg text-left transition flex justify-between items-center ${selectedTreatments.some(t => t.id === treatment.id) ? 'bg-green-50 border-green-300' : 'hover:bg-gray-50'}`}
                  >
                    <div>
                      <p className="font-medium text-gray-900">{treatment.name}</p>
                      <p className="text-xs text-gray-500">{treatment.duration_minutes} menit</p>
                    </div>
                    <p className="font-bold text-primary">Rp{treatment.price?.toLocaleString()}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Treatments */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Tindakan yang Dipilih</h2>
              {selectedTreatments.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Belum ada tindakan yang dipilih</p>
              ) : (
                <div className="space-y-2">
                  {selectedTreatments.map((treatment, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{treatment.name}</p>
                        <p className="text-xs text-gray-500">{treatment.duration_minutes} menit</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="font-bold text-primary">Rp{treatment.price?.toLocaleString()}</p>
                        <button onClick={() => removeTreatment(treatment.id)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="pt-3 border-t flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-primary">Rp{selectedTreatments.reduce((sum, t) => sum + (t.price || 0), 0).toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab: Resep Obat */}
        {activeTab === 'prescription' && (
          <div className="space-y-6">
            {/* Prescription List */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Pill size={20} className="text-primary" /> Resep Obat
                </h2>
                <button onClick={() => setShowMedicineModal(true)} className="bg-primary text-white text-sm px-3 py-1.5 rounded-lg flex items-center gap-1">
                  <Plus size={14} /> Tambah Obat
                </button>
              </div>
              
              {prescriptions.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Belum ada resep obat</p>
              ) : (
                <div className="space-y-3">
                  {prescriptions.map((med) => (
                    <div key={med.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-gray-900">{med.name}</p>
                          <p className="text-sm text-gray-600">Dosis: {med.dosage}</p>
                          <p className="text-sm text-gray-600">Frekuensi: {med.frequency}</p>
                          <p className="text-sm text-gray-600">Durasi: {med.duration}</p>
                          {med.notes && <p className="text-xs text-gray-400 mt-1">Catatan: {med.notes}</p>}
                        </div>
                        <button onClick={() => removePrescription(med.id)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab: Ringkasan */}
        {activeTab === 'summary' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Ringkasan Pemeriksaan</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Identitas Pasien</h3>
                <div className="grid grid-cols-2 gap-2 text-sm bg-gray-50 p-3 rounded-lg">
                  <p><span className="text-gray-500">Nama:</span> {patient?.full_name}</p>
                  <p><span className="text-gray-500">RM:</span> {patient?.rm_number}</p>
                  <p><span className="text-gray-500">Tanggal:</span> {new Date().toLocaleDateString('id-ID')}</p>
                  <p><span className="text-gray-500">Dokter:</span> -</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Keluhan & Diagnosis</h3>
                <div className="bg-gray-50 p-3 rounded-lg text-sm">
                  <p><span className="font-medium">Keluhan Utama:</span> {examinationData.chief_complaint || '-'}</p>
                  <p className="mt-2"><span className="font-medium">Diagnosis:</span> {examinationData.diagnosis || '-'}</p>
                  <p className="mt-2"><span className="font-medium">Rencana Perawatan:</span> {examinationData.treatment_plan || '-'}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Tindakan yang Direncanakan</h3>
                <div className="bg-gray-50 p-3 rounded-lg">
                  {selectedTreatments.length === 0 ? (
                    <p className="text-sm text-gray-500">-</p>
                  ) : (
                    selectedTreatments.map((t, i) => <p key={i} className="text-sm">• {t.name}</p>)
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Resep Obat</h3>
                <div className="bg-gray-50 p-3 rounded-lg">
                  {prescriptions.length === 0 ? (
                    <p className="text-sm text-gray-500">-</p>
                  ) : (
                    prescriptions.map((m, i) => <p key={i} className="text-sm">• {m.name} - {m.dosage}, {m.frequency}</p>)
                  )}
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button onClick={printExamination} className="px-4 py-2 border rounded-lg flex items-center gap-2">
                  <Printer size={16} /> Print
                </button>
                <button onClick={saveExamination} className="px-4 py-2 bg-primary text-white rounded-lg flex items-center gap-2">
                  <Save size={16} /> Simpan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Tambah Obat */}
      {showMedicineModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-bold">Tambah Obat</h3>
              <button onClick={() => setShowMedicineModal(false)}><X size={20} /></button>
            </div>
            <div className="p-4 space-y-3">
              <div><label className="text-sm font-medium">Nama Obat *</label><input type="text" value={currentMedicine.name} onChange={e => setCurrentMedicine({...currentMedicine, name: e.target.value})} className="w-full mt-1 p-2 border rounded-lg" placeholder="Amoxicillin" /></div>
              <div><label className="text-sm font-medium">Dosis *</label><input type="text" value={currentMedicine.dosage} onChange={e => setCurrentMedicine({...currentMedicine, dosage: e.target.value})} className="w-full mt-1 p-2 border rounded-lg" placeholder="500 mg" /></div>
              <div><label className="text-sm font-medium">Frekuensi</label><input type="text" value={currentMedicine.frequency} onChange={e => setCurrentMedicine({...currentMedicine, frequency: e.target.value})} className="w-full mt-1 p-2 border rounded-lg" placeholder="3x sehari" /></div>
              <div><label className="text-sm font-medium">Durasi</label><input type="text" value={currentMedicine.duration} onChange={e => setCurrentMedicine({...currentMedicine, duration: e.target.value})} className="w-full mt-1 p-2 border rounded-lg" placeholder="5 hari" /></div>
              <div><label className="text-sm font-medium">Catatan</label><textarea value={currentMedicine.notes} onChange={e => setCurrentMedicine({...currentMedicine, notes: e.target.value})} rows="2" className="w-full mt-1 p-2 border rounded-lg" placeholder="Diminum setelah makan..." /></div>
            </div>
            <div className="p-4 border-t flex justify-end gap-2">
              <button onClick={() => setShowMedicineModal(false)} className="px-3 py-1.5 border rounded-lg">Batal</button>
              <button onClick={addPrescription} className="px-3 py-1.5 bg-primary text-white rounded-lg">Tambah</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Examination;