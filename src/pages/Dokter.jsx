import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { Stethoscope, Eye } from 'lucide-react';
import doctorsData from '../data/dokter.json';

const Dokter = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDoctors = doctorsData.filter(doctor => 
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRowClick = (id) => {
    navigate(`/dokter/${id}`);
  };

  return (
    <div className="font-sans">
      <PageHeader title="Data Dokter" />
      
      {/* Welcome Card */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        <div className="main-card p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <span className="text-white/80 text-lg mr-2 font-medium">Total Dokter:</span>
              <span className="text-white text-2xl font-bold">{doctorsData.length} Orang</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Cari nama atau spesialisasi dokter..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-4 pr-10 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white"
          />
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Tabel Dokter */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nama Dokter</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Spesialisasi</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Pengalaman</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">No. Telepon</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredDoctors.map((doctor, index) => (
                <tr 
                  key={doctor.id} 
                  className="hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => handleRowClick(doctor.id)}
                >
                  <td className="px-6 py-4 text-sm text-gray-500">{index + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold text-xs">
                        {doctor.avatar}
                      </div>
                      <span className="font-semibold text-gray-900 hover:text-primary transition">
                        {doctor.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Stethoscope size={14} className="text-primary" />
                      <span className="text-sm text-gray-600">{doctor.specialization}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{doctor.experience} tahun</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{doctor.phone}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      doctor.status === 'active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {doctor.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(doctor.id);
                      }}
                      className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredDoctors.length === 0 && (
          <div className="p-12 text-center">
            <Stethoscope size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-1">Tidak ada dokter ditemukan</h3>
            <p className="text-gray-400 text-sm">Coba ubah kata kunci pencarian</p>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 text-sm text-gray-500">
          Menampilkan {filteredDoctors.length} dari {doctorsData.length} dokter
        </div>
      </div>
    </div>
  );
};

export default Dokter;