import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, User, Phone, Mail, MapPin, Calendar, AlertCircle, 
  Stethoscope, Clock, DollarSign, MessageCircle, Award, FileText,
  Image, Download, Edit, CheckCircle, XCircle, Send, PhoneCall,
  Activity, Heart, AlertTriangle, Pill, Scissors, Smile, Star
} from 'lucide-react';
import dentalAPI from '../services/dentalAPI';

// Rest of your PatientDetail component code...
// Ganti semua <Tooth /> menjadi <Smile />

const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [loyaltyPoints, setLoyaltyPoints] = useState([]);
  const [communicationLogs, setCommunicationLogs] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [showCommModal, setShowCommModal] = useState(false);
  const [commData, setCommData] = useState({ channel: 'wa', message: '' });

  useEffect(() => {
    fetchPatientData();
  }, [id]);

  const fetchPatientData = async () => {
    setLoading(true);
    try {
      const [patientData, allAppointments, allInvoices, allSurveys, allPoints, allLogs, allDocs] = await Promise.all([
        dentalAPI.patients.getById(id),
        dentalAPI.appointments.getAll(),
        dentalAPI.invoices.getAll(),
        dentalAPI.surveys.getAll(),
        dentalAPI.loyaltyPoints.getAll(),
        dentalAPI.communicationLogs.getAll(),
        dentalAPI.patient_documents.getByPatientId(id)
      ]);

      setPatient(patientData);
      
      // Filter appointments for this patient
      const patientAppointments = (allAppointments || []).filter(a => a.patient_id === parseInt(id));
      
      // Enrich appointments with doctor and treatment names
      const enrichedAppointments = await Promise.all(patientAppointments.map(async (apt) => {
        const doctor = await dentalAPI.doctors.getById(apt.doctor_id);
        const doctorUser = doctor ? await dentalAPI.users.getById(doctor.user_id) : null;
        const aptTreatments = await dentalAPI.appointmentTreatments.getByAppointmentId(apt.id);
        const treatments = await Promise.all(aptTreatments.map(async (at) => {
          const treatment = await dentalAPI.treatments.getById(at.treatment_id);
          return treatment?.name;
        }));
        return {
          ...apt,
          doctor_name: doctorUser?.full_name?.replace('drg. ', '') || 'Unknown',
          treatment_names: treatments.filter(Boolean)
        };
      }));
      
      setAppointments(enrichedAppointments);
      
      // Filter invoices
      const patientInvoices = (allInvoices || []).filter(inv => 
        patientAppointments.some(apt => apt.id === inv.appointment_id)
      );
      setInvoices(patientInvoices);
      
      // Filter surveys
      const patientSurveys = (allSurveys || []).filter(s => 
        patientAppointments.some(apt => apt.id === s.appointment_id)
      );
      setSurveys(patientSurveys);
      
      // Filter loyalty points
      const patientPoints = (allPoints || []).filter(p => p.patient_id === parseInt(id));
      setLoyaltyPoints(patientPoints);
      
      // Filter communication logs
      const patientLogs = (allLogs || []).filter(l => l.patient_id === parseInt(id));
      setCommunicationLogs(patientLogs);
      
      setDocuments(allDocs || []);
      
    } catch (error) {
      console.error('Error fetching patient data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalPoints = loyaltyPoints.reduce((sum, p) => sum + p.points, 0);
  const totalSpent = invoices.reduce((sum, inv) => sum + (inv.total_amount || 0), 0);
  const completedAppointments = appointments.filter(a => a.status === 'completed').length;
  
  const getTier = (points) => {
    if (points >= 1500) return { name: 'Platinum', color: 'bg-gradient-to-r from-gray-400 to-gray-300', icon: Award };
    if (points >= 500) return { name: 'Gold', color: 'bg-gradient-to-r from-yellow-500 to-yellow-400', icon: Star };
    if (points >= 100) return { name: 'Silver', color: 'bg-gradient-to-r from-gray-300 to-gray-200', icon: Star };
    return { name: 'Bronze', color: 'bg-gradient-to-r from-amber-600 to-amber-500', icon: Award };
  };
  const tier = getTier(totalPoints);

  const getStatusBadge = (status) => {
    const config = {
      completed: { text: 'Selesai', color: 'bg-green-100 text-green-700' },
      confirmed: { text: 'Terkonfirmasi', color: 'bg-blue-100 text-blue-700' },
      pending: { text: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
      cancelled_by_clinic: { text: 'Dibatalkan', color: 'bg-red-100 text-red-700' }
    };
    const c = config[status] || config.pending;
    return <span className={`px-2 py-0.5 text-xs rounded-full ${c.color}`}>{c.text}</span>;
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    try {
      const currentNotes = patient.special_notes || '';
      const newNotes = currentNotes ? `${currentNotes}\n[${new Date().toLocaleDateString()}] ${noteText}` : `[${new Date().toLocaleDateString()}] ${noteText}`;
      await dentalAPI.patients.update(patient.id, { special_notes: newNotes });
      await fetchPatientData();
      setShowNoteModal(false);
      setNoteText('');
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!commData.message.trim()) return;
    try {
      await dentalAPI.communicationLogs.logOutgoing(
        patient.id, 
        commData.channel, 
        commData.message, 
        1 // admin id
      );
      await fetchPatientData();
      setShowCommModal(false);
      setCommData({ channel: 'wa', message: '' });
      alert('Pesan berhasil dikirim!');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500">Memuat data pasien...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto text-red-400 mb-3" />
          <p className="text-gray-600">Pasien tidak ditemukan</p>
          <button onClick={() => navigate('/patients')} className="mt-4 text-primary hover:underline">Kembali</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <button onClick={() => navigate('/patients')} className="flex items-center gap-2 text-gray-600 hover:text-primary mb-4">
            <ArrowLeft size={18} /> Kembali ke Daftar Pasien
          </button>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold">
                {patient.full_name?.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{patient.full_name}</h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm text-gray-500 font-mono">{patient.rm_number}</span>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${patient.is_active !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {patient.is_active !== false ? 'Aktif' : 'Nonaktif'}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${tier.color.split(' ')[1]}`}></span>
                    <span className="text-xs font-medium">{tier.name}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowCommModal(true)} className="px-3 py-2 bg-primary text-white rounded-lg flex items-center gap-2 text-sm">
                <Send size={16} /> Kirim Pesan
              </button>
              <button onClick={() => setShowNoteModal(true)} className="px-3 py-2 border border-gray-300 rounded-lg flex items-center gap-2 text-sm hover:bg-gray-50">
                <FileText size={16} /> Tambah Catatan
              </button>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="px-6 border-t border-gray-100 flex gap-6 overflow-x-auto">
          {[
            { id: 'overview', label: 'Ringkasan', icon: User },
            { id: 'medical', label: 'Riwayat Medis', icon: Heart },
            { id: 'appointments', label: 'Janji Temu', icon: Calendar },
            { id: 'payments', label: 'Pembayaran', icon: DollarSign },
            { id: 'loyalty', label: 'Loyalitas', icon: Award },
            { id: 'documents', label: 'Dokumen', icon: FileText },
            { id: 'communication', label: 'Komunikasi', icon: MessageCircle }
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
        {/* Tab: Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Info Card */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Informasi Pasien</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <User size={18} className="text-gray-400 mt-0.5" />
                  <div><p className="text-sm text-gray-500">Nama Lengkap</p><p className="font-medium">{patient.full_name}</p></div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar size={18} className="text-gray-400 mt-0.5" />
                  <div><p className="text-sm text-gray-500">Tanggal Lahir</p><p className="font-medium">{patient.birth_date ? new Date(patient.birth_date).toLocaleDateString('id-ID') : '-'}</p></div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={18} className="text-gray-400 mt-0.5" />
                  <div><p className="text-sm text-gray-500">No HP/WA</p><p className="font-medium">{patient.phone || '-'}</p></div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail size={18} className="text-gray-400 mt-0.5" />
                  <div><p className="text-sm text-gray-500">Email</p><p className="font-medium">{patient.email || '-'}</p></div>
                </div>
                <div className="flex items-start gap-3 md:col-span-2">
                  <MapPin size={18} className="text-gray-400 mt-0.5" />
                  <div><p className="text-sm text-gray-500">Alamat</p><p className="font-medium">{patient.address || '-'}</p></div>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Statistik</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-600">Total Kunjungan</span>
                  <span className="text-2xl font-bold text-primary">{appointments.length}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-600">Perawatan Selesai</span>
                  <span className="text-2xl font-bold text-green-600">{completedAppointments}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-600">Total Belanja</span>
                  <span className="text-2xl font-bold text-primary">Rp {totalSpent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Poin Loyalitas</span>
                  <span className="text-2xl font-bold text-yellow-600">{totalPoints.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Allergies & Medical Notes */}
            {(patient.allergies || patient.systemic_diseases) && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Peringatan Medis</h2>
                {patient.allergies && (
                  <div className="mb-3 p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center gap-2 text-red-700 font-medium mb-1"><AlertTriangle size={14} /> Alergi</div>
                    <p className="text-sm text-red-600">{patient.allergies}</p>
                  </div>
                )}
                {patient.systemic_diseases && (
                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-2 text-yellow-700 font-medium mb-1"><Heart size={14} /> Penyakit Sistemik</div>
                    <p className="text-sm text-yellow-600">{patient.systemic_diseases}</p>
                  </div>
                )}
              </div>
            )}

            {/* Special Notes */}
            {patient.special_notes && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3">Catatan Khusus</h2>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-700 whitespace-pre-wrap">{patient.special_notes}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab: Medical History */}
        {activeTab === 'medical' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Riwayat Medis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Alergi</p>
                <div className="p-3 bg-gray-50 rounded-lg">{patient.allergies || '-'}</div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Penyakit Sistemik</p>
                <div className="p-3 bg-gray-50 rounded-lg">{patient.systemic_diseases || '-'}</div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Riwayat Operasi</p>
                <div className="p-3 bg-gray-50 rounded-lg">{patient.surgery_history || '-'}</div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Obat Rutin</p>
                <div className="p-3 bg-gray-50 rounded-lg">{patient.routine_medicines || '-'}</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Appointments */}
        {activeTab === 'appointments' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="font-bold">Riwayat Janji Temu</h2>
              <button className="text-primary text-sm">Buat Janji Baru</button>
            </div>
            <div className="divide-y">
              {appointments.length === 0 ? (
                <div className="p-8 text-center text-gray-500">Belum ada janji temu</div>
              ) : (
                appointments.map(apt => (
                  <div key={apt.id} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{new Date(apt.appointment_date).toLocaleDateString('id-ID')}</span>
                          <span className="text-sm text-gray-500">{apt.start_time?.substring(0,5)}</span>
                          {getStatusBadge(apt.status)}
                        </div>
                        <p className="text-sm text-gray-600">drg. {apt.doctor_name}</p>
                        <p className="text-sm text-gray-500">{apt.treatment_names?.join(', ') || '-'}</p>
                        {apt.notes && <p className="text-xs text-gray-400 mt-1">Catatan: {apt.notes}</p>}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab: Payments */}
        {activeTab === 'payments' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100"><h2 className="font-bold">Riwayat Pembayaran</h2></div>
            <div className="divide-y">
              {invoices.length === 0 ? (
                <div className="p-8 text-center text-gray-500">Belum ada transaksi</div>
              ) : (
                invoices.map(inv => {
                  const appointment = appointments.find(a => a.id === inv.appointment_id);
                  return (
                    <div key={inv.id} className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-mono text-sm">{inv.invoice_number}</p>
                          <p className="text-xs text-gray-500">{appointment?.appointment_date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">Rp {inv.total_amount?.toLocaleString()}</p>
                          <span className={`text-xs ${inv.status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                            {inv.status === 'paid' ? 'Lunas' : inv.status === 'partial' ? 'Cicilan' : 'Belum Bayar'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Tab: Loyalty */}
        {activeTab === 'loyalty' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-bold mb-4">Poin & Tier</h2>
              <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
                <div className={`w-20 h-20 rounded-full ${tier.color} mx-auto flex items-center justify-center mb-3`}>
                  <tier.icon size={32} className="text-white" />
                </div>
                <p className="text-3xl font-bold text-primary">{totalPoints.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Total Poin</p>
                <p className="text-lg font-semibold mt-2">{tier.name}</p>
              </div>
              <div className="mt-4 space-y-2">
                <h3 className="font-medium">Riwayat Poin</h3>
                {loyaltyPoints.slice(-5).reverse().map((point, idx) => (
                  <div key={idx} className="flex justify-between text-sm py-1 border-b border-gray-100">
                    <span>{point.source}</span>
                    <span className={point.points > 0 ? 'text-green-600' : 'text-red-600'}>{point.points > 0 ? `+${point.points}` : point.points}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-bold mb-4">Reward yang Tersedia</h2>
              <div className="space-y-3">
                {[{ name: 'Sikat Gigi + Pasta', points: 100 }, { name: 'Scaling Gratis', points: 300 }, { name: 'Diskon Behel 20%', points: 500 }].map((reward, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div><p className="font-medium">{reward.name}</p><p className="text-xs text-gray-500">{reward.points} poin</p></div>
                    <button disabled={totalPoints < reward.points} className={`px-3 py-1 text-sm rounded-lg ${totalPoints >= reward.points ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>Tukar</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Documents */}
        {activeTab === 'documents' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4"><h2 className="font-bold">Dokumen Pasien</h2><button className="text-primary text-sm">+ Upload Dokumen</button></div>
            {documents.length === 0 ? <div className="text-center py-8 text-gray-500">Belum ada dokumen</div> : documents.map(doc => (<div key={doc.id} className="flex items-center gap-3 p-3 border rounded-lg mb-2"><FileText size={20} className="text-primary" /><div><p className="font-medium">{doc.document_type}</p><p className="text-xs text-gray-500">{new Date(doc.uploaded_at).toLocaleDateString()}</p></div><Download size={16} className="ml-auto text-gray-400 cursor-pointer" /></div>))}
          </div>
        )}

        {/* Tab: Communication */}
        {activeTab === 'communication' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100"><h2 className="font-bold">Log Komunikasi</h2></div>
            <div className="divide-y">
              {communicationLogs.length === 0 ? <div className="p-8 text-center text-gray-500">Belum ada riwayat komunikasi</div> : communicationLogs.map(log => (<div key={log.id} className="p-4"><div className="flex items-start gap-3"><div className={`p-1.5 rounded-full ${log.direction === 'out' ? 'bg-primary/10' : 'bg-gray-100'}`}>{log.direction === 'out' ? <Send size={12} className="text-primary" /> : <MessageCircle size={12} className="text-gray-500" />}</div><div><p className="text-sm font-medium">{log.channel?.toUpperCase()} {log.direction === 'out' ? '(Keluar)' : '(Masuk)'}</p><p className="text-sm text-gray-600">{log.message}</p><p className="text-xs text-gray-400 mt-1">{new Date(log.created_at).toLocaleString()}</p></div></div></div>))}
            </div>
          </div>
        )}
      </div>

      {/* Add Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5"><h3 className="font-bold mb-3">Tambah Catatan</h3><textarea value={noteText} onChange={e => setNoteText(e.target.value)} rows={4} className="w-full px-3 py-2 border rounded-lg mb-3" placeholder="Tulis catatan untuk pasien..."></textarea><div className="flex justify-end gap-2"><button onClick={() => setShowNoteModal(false)} className="px-3 py-1.5 border rounded-lg">Batal</button><button onClick={handleAddNote} className="px-3 py-1.5 bg-primary text-white rounded-lg">Simpan</button></div></div>
        </div>
      )}

      {/* Send Message Modal */}
      {showCommModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5"><h3 className="font-bold mb-3">Kirim Pesan ke {patient.full_name}</h3><select value={commData.channel} onChange={e => setCommData({...commData, channel: e.target.value})} className="w-full px-3 py-2 border rounded-lg mb-3"><option value="wa">WhatsApp</option><option value="sms">SMS</option><option value="email">Email</option></select><textarea value={commData.message} onChange={e => setCommData({...commData, message: e.target.value})} rows={4} className="w-full px-3 py-2 border rounded-lg mb-3" placeholder="Tulis pesan..."></textarea><div className="flex justify-end gap-2"><button onClick={() => setShowCommModal(false)} className="px-3 py-1.5 border rounded-lg">Batal</button><button onClick={handleSendMessage} className="px-3 py-1.5 bg-primary text-white rounded-lg">Kirim</button></div></div>
        </div>
      )}
    </div>
  );
};

export default PatientDetail;
