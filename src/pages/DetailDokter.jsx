import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { ArrowLeft, Star, Calendar, Clock, MapPin, Phone, Mail, User, Award, Briefcase, MessageCircle } from 'lucide-react';

const DetailDokter = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const doctor = {
    id: 1,
    name: 'drg. Rizky Abdullah, Sp.KG',
    specialization: 'Spesialis Konservasi Gigi',
    experience: '12 tahun',
    rating: 4.9,
    reviewCount: 128,
    price: 250000,
    location: 'Jakarta Selatan',
    phone: '+62 812 3456 7890',
    email: 'dr.rizky@dentalplus.com',
    bio: 'Dokter gigi spesialis konservasi gigi dengan pengalaman lebih dari 12 tahun. Lulusan Universitas Indonesia dan telah menangani ribuan pasien dengan berbagai kasus gigi.',
    education: [
      'Spesialis Konservasi Gigi - Universitas Indonesia (2015)',
      'Dokter Gigi - Universitas Indonesia (2010)',
    ],
    achievements: [
      'Best Dental Specialist Award 2022',
      'Publikasi Internasional tentang Perawatan Saluran Akar',
    ],
    schedule: [
      { day: 'Senin', time: '09:00 - 17:00' },
      { day: 'Selasa', time: '09:00 - 17:00' },
      { day: 'Rabu', time: '09:00 - 17:00' },
      { day: 'Kamis', time: '09:00 - 17:00' },
      { day: 'Jumat', time: '09:00 - 16:30' },
      { day: 'Sabtu', time: '09:00 - 13:00' },
    ],
    availableTimes: ['09:00', '10:30', '13:00', '14:30', '16:00'],
  };

  const handleBookAppointment = () => {
    if (!selectedDate || !selectedTime) {
      alert('Silakan pilih tanggal dan jam janji temu');
      return;
    }
    alert(`Janji temu berhasil dibuat dengan ${doctor.name} pada ${selectedDate} pukul ${selectedTime}`);
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${doctor.phone}`, '_blank');
  };

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition"
      >
        <ArrowLeft size={20} className="mr-2" />
        Kembali
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Doctor Profile Card */}
          <div className="card p-6">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                <User size={48} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{doctor.name}</h1>
                    <p className="text-blue-600 font-medium mt-1">{doctor.specialization}</p>
                    <div className="flex items-center mt-2">
                      <div className="flex items-center">
                        <Star size={16} className="text-yellow-400 fill-current" />
                        <span className="text-sm font-medium ml-1">{doctor.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500 ml-2">({doctor.reviewCount} ulasan)</span>
                      <span className="mx-2 text-gray-300">|</span>
                      <span className="text-sm text-gray-600">{doctor.experience} pengalaman</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      Rp {doctor.price.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">/konsultasi</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-4">
                  <div className="flex items-center text-gray-600">
                    <MapPin size={16} className="mr-1" />
                    <span className="text-sm">{doctor.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone size={16} className="mr-1" />
                    <span className="text-sm">{doctor.phone}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Mail size={16} className="mr-1" />
                    <span className="text-sm">{doctor.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Tentang Dokter</h2>
            <p className="text-gray-600 leading-relaxed">{doctor.bio}</p>
          </div>

          {/* Education */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Award size={20} className="mr-2 text-blue-600" />
              Pendidikan
            </h2>
            <ul className="space-y-2">
              {doctor.education.map((edu, index) => (
                <li key={index} className="text-gray-600 flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  {edu}
                </li>
              ))}
            </ul>
          </div>

          {/* Achievements */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Briefcase size={20} className="mr-2 text-blue-600" />
              Prestasi & Sertifikasi
            </h2>
            <ul className="space-y-2">
              {doctor.achievements.map((achievement, index) => (
                <li key={index} className="text-gray-600 flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  {achievement}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sidebar - Booking Section */}
        <div className="space-y-6">
          <div className="card p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Buat Janji Temu</h2>
            
            <div className="space-y-4">
              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pilih Tanggal
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="input-field"
                />
              </div>

              {/* Time Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pilih Jam
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {doctor.availableTimes.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition ${
                        selectedTime === time
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Schedule Info */}
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center mb-2">
                  <Clock size={16} className="text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-blue-800">Jadwal Praktik</span>
                </div>
                <div className="space-y-1">
                  {doctor.schedule.map((sch, index) => (
                    <div key={index} className="flex justify-between text-xs text-blue-700">
                      <span>{sch.day}</span>
                      <span>{sch.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleBookAppointment}
                className="w-full btn-primary flex items-center justify-center"
              >
                <Calendar size={18} className="mr-2" />
                Buat Janji Temu
              </button>

              <button
                onClick={handleWhatsApp}
                className="w-full bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-all flex items-center justify-center"
              >
                <MessageCircle size={18} className="mr-2" />
                Konsultasi via WhatsApp
              </button>
            </div>
          </div>

          {/* Integration Info */}
          <div className="card p-4 text-center">
            <p className="text-xs text-gray-500">
              ✅ Data terintegrasi dengan <span className="font-semibold text-blue-600">SATUSEHAT</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailDokter;