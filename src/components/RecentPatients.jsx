import React from 'react';
import { User, Calendar, Users, Phone } from 'lucide-react';

const RecentPatients = ({ patients = [], onViewPatient }) => {
  if (patients.length === 0) {
    return (
      <div className="card">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-txt-primary">Pasien Baru</h2>
        </div>
        <div className="p-8 text-center text-gray-500">
          <Users size={40} className="mx-auto text-gray-300 mb-2" />
          <p>Belum ada pasien baru minggu ini</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-txt-primary">Pasien Baru</h2>
          <p className="text-sm text-gray-500 mt-1">Minggu ini</p>
        </div>
        <button className="text-xs text-primary hover:underline">Lihat Semua</button>
      </div>
      <div className="divide-y divide-gray-100">
        {patients.map((patient) => (
          <div
            key={patient.id}
            className="p-4 hover:bg-gray-50 transition cursor-pointer"
            onClick={() => onViewPatient && onViewPatient(patient.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User size={18} className="text-primary" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">{patient.full_name}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-2">
                    <span className="flex items-center gap-1"><Calendar size={10} /> {patient.birth_date || '-'}</span>
                    <span className="flex items-center gap-1"><Phone size={10} /> {patient.phone || '-'}</span>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-primary font-medium">{patient.rm_number}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentPatients;
