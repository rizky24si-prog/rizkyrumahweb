import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Stethoscope, Phone, Mail, Calendar, Clock, Star, Users } from 'lucide-react';
import doctorsData from '../data/dokter.json';

const DokterDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    const foundDoctor = doctorsData.find(d => d.id === parseInt(id));
    setDoctor(foundDoctor);
  }, [id]);

  if (!doctor) {
    return (
      <div className="font-sans p-8 text-center">
        <h2 className="text-xl font-bold text-gray-700">Dokter tidak ditemukan</h2>
        <button 
          onClick={() => navigate('/dokter')}
          className="mt-4 text-primary hover:underline"
        >
          Kembali ke daftar dokter
        </button>
      </div>
    );
  }

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star 
          key={i} 
          size={18} 
          className={i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
        />
      );
    }
    return stars;
  };

  return (
    <div className="font-sans">
      {/* Header dengan tombol back */}
      <div className="mb-6">
        <button 
          onClick={() => navigate('/dokter')}
          className="flex items-center gap-2 text-gray-600 hover:text-primary transition"
        >
          <ArrowLeft size={20} />
          <span>Kembali ke Daftar Dokter</span>
        </button>
      </div>

      {/* Detail Card */}
      <div className="card p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold text-4xl">
              {doctor.avatar}
            </div>
            <span className={`mt-3 px-3 py-1 rounded-full text-xs font-semibold ${
              doctor.status === 'active' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {doctor.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
            </span>
          </div>

          {/* Info Section */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{doctor.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <Stethoscope size={16} className="text-primary" />
              <span className="text-gray-600">{doctor.specialization}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Calendar size={18} className="text-primary" />
                <div>
                  <p className="text-xs text-gray-400">Pengalaman</p>
                  <p className="font-semibold text-gray-700">{doctor.experience} tahun</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Users size={18} className="text-primary" />
                <div>
                  <p className="text-xs text-gray-400">Total Pasien</p>
                  <p className="font-semibold text-gray-700">{doctor.patients} pasien</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Phone size={18} className="text-primary" />
                <div>
                  <p className="text-xs text-gray-400">No. Telepon</p>
                  <p className="font-semibold text-gray-700">{doctor.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Mail size={18} className="text-primary" />
                <div>
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="font-semibold text-gray-700 truncate">{doctor.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Clock size={18} className="text-primary" />
                <div>
                  <p className="text-xs text-gray-400">Jadwal Praktik</p>
                  <p className="font-semibold text-gray-700">{doctor.schedule}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-xs text-gray-400">Rating</p>
                  <div className="flex items-center gap-1">
                    {renderStars(doctor.rating)}
                    <span className="font-semibold text-gray-700 ml-1">{doctor.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DokterDetail;