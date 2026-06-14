import React from 'react';
import { Users, Star, TrendingUp } from 'lucide-react';

const DoctorPerformance = ({ doctors = [] }) => {
  return (
    <div className="card">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-bold text-txt-primary flex items-center gap-2">
          <Users size={18} className="text-secondary" />
          Performa Dokter
        </h2>
        <p className="text-sm text-gray-500 mt-1">Rating & jumlah pasien</p>
      </div>
      <div className="divide-y divide-gray-100">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-bold text-gray-900">drg. {doctor.name}</p>
                <p className="text-xs text-gray-500">{doctor.specialization}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold">{doctor.rating}</span>
                  <span className="text-xs text-gray-400">/5</span>
                </div>
                <p className="text-xs text-gray-500">{doctor.patient_count} pasien</p>
              </div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div 
                className="bg-gradient-to-r from-secondary to-third h-1.5 rounded-full"
                style={{ width: `${(doctor.rating / 5) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorPerformance;
