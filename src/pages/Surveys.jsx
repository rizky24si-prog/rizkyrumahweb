import React, { useState, useEffect } from 'react';
import { Star, MessageCircle, Phone, CheckCircle, AlertCircle, Search, Filter } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import dentalAPI from '../services/dentalAPI';

const Surveys = () => {
  const [surveys, setSurveys] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [surveysData, appointmentsData, patientsData, doctorsData] = await Promise.all([
        dentalAPI.surveys.getAll(),
        dentalAPI.appointments.getAll(),
        dentalAPI.patients.getAll(),
        dentalAPI.doctors.getAll()
      ]);
      
      // Enrich surveys
      const enriched = await Promise.all((surveysData || []).map(async (survey) => {
        const appointment = appointmentsData.find(a => a.id === survey.appointment_id);
        const patient = appointment ? patientsData.find(p => p.id === appointment.patient_id) : null;
        const doctor = appointment ? doctorsData.find(d => d.id === appointment.doctor_id) : null;
        const doctorUser = doctor ? await dentalAPI.users.getById(doctor.user_id) : null;
        
        return {
          ...survey,
          patient_name: patient?.full_name || 'Unknown',
          doctor_name: doctorUser?.full_name?.replace('drg. ', '') || 'Unknown',
          appointment_date: appointment?.appointment_date
        };
      }));
      
      setSurveys(enriched);
      setAppointments(appointmentsData);
      setPatients(patientsData);
      setDoctors(doctorsData);
    } catch (error) {
      console.error('Error fetching surveys:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFollowUp = async (id) => {
    try {
      await dentalAPI.surveys.markFollowUpDone(id);
      await fetchData();
    } catch (error) {
      console.error('Error marking follow-up:', error);
    }
  };

  const filteredSurveys = (surveys || []).filter(s => {
    const matchRating = filterRating === 'all' || 
      (filterRating === 'good' && s.rating_comfort >= 4) ||
      (filterRating === 'average' && s.rating_comfort === 3) ||
      (filterRating === 'bad' && s.rating_comfort <= 2);
    const matchSearch = s.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        s.doctor_name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchRating && matchSearch;
  });

  const averageRating = surveys.length > 0 
    ? (surveys.reduce((sum, s) => sum + (s.rating_comfort || 0), 0) / surveys.length).toFixed(1)
    : 0;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <PageHeader title="Survei Kepuasan" subtitle="Feedback dan ulasan pasien" onRefresh={fetchData} />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-primary">{averageRating}</p>
          <p className="text-sm text-gray-500">Rating Rata-rata</p>
          <div className="flex justify-center gap-0.5 mt-1">
            {[1,2,3,4,5].map(i => (
              <Star key={i} size={14} className={i <= averageRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-green-600">{surveys.filter(s => s.rating_comfort >= 4).length}</p>
          <p className="text-sm text-gray-500">Ulasan Positif (4-5★)</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-red-600">{surveys.filter(s => s.rating_comfort <= 2).length}</p>
          <p className="text-sm text-gray-500">Keluhan (1-2★)</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input type="text" placeholder="Cari pasien atau dokter..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-9 pr-3 py-2 border rounded-lg" />
        </div>
        <select value={filterRating} onChange={e => setFilterRating(e.target.value)} className="px-3 py-2 border rounded-lg">
          <option value="all">Semua Rating</option>
          <option value="good">Positif (4-5★)</option>
          <option value="average">Sedang (3★)</option>
          <option value="bad">Keluhan (1-2★)</option>
        </select>
      </div>

      {/* Surveys List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Memuat data...</div>
        ) : filteredSurveys.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <MessageCircle size={48} className="mx-auto text-gray-300 mb-2" />
            <p className="text-gray-500">Belum ada data survei</p>
          </div>
        ) : (
          filteredSurveys.map((survey) => (
            <div key={survey.id} className={`bg-white rounded-xl shadow-sm p-4 ${survey.rating_comfort <= 2 ? 'border-l-4 border-l-red-500' : ''}`}>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-900">{survey.patient_name}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-sm text-gray-500">drg. {survey.doctor_name}</span>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {[1,2,3,4,5].map(star => (
                      <Star key={star} size={16} className={star <= survey.rating_comfort ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                    ))}
                  </div>
                  {survey.comments && (
                    <p className="text-gray-600 text-sm mt-1">"{survey.comments}"</p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">{survey.appointment_date}</p>
                </div>
                {survey.rating_comfort <= 2 && survey.follow_up_status === 'pending' && (
                  <button onClick={() => handleFollowUp(survey.id)} className="px-3 py-1.5 bg-primary text-white text-sm rounded-lg flex items-center gap-1 hover:bg-primary/90">
                    <Phone size={14} /> Follow Up
                  </button>
                )}
                {survey.follow_up_status === 'done' && (
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Sudah Ditindaklanjuti</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Surveys;
