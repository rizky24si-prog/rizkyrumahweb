import React from 'react';
import { Gift, Calendar, Cake, Send } from 'lucide-react';

const UpcomingBirthdays = ({ patients = [], onSendGift, onSendMessage }) => {
  if (patients.length === 0) {
    return (
      <div className="card">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-txt-primary flex items-center gap-2">
            <Cake size={18} className="text-pink-500" />
            Ulang Tahun Bulan Ini
          </h2>
        </div>
        <div className="p-8 text-center text-gray-500">
          <Gift size={40} className="mx-auto text-gray-300 mb-2" />
          <p>Tidak ada pasien yang berulang tahun bulan ini</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-txt-primary flex items-center gap-2">
            <Cake size={18} className="text-pink-500" />
            Ulang Tahun Bulan Ini
          </h2>
          <p className="text-sm text-gray-500 mt-1">Kirim ucapan & reward</p>
        </div>
        <button 
          onClick={() => onSendMessage && onSendMessage('all')}
          className="text-xs bg-pink-500 text-white px-3 py-1 rounded-full hover:bg-pink-600"
        >
          Kirim Semua
        </button>
      </div>
      <div className="divide-y divide-gray-100">
        {patients.map((patient) => {
          const birthDate = new Date(patient.birth_date);
          const day = birthDate.getDate();
          const month = birthDate.toLocaleString('id-ID', { month: 'long' });
          
          return (
            <div key={patient.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                    <Cake size={20} className="text-pink-500" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{patient.full_name}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar size={10} /> {day} {month}
                    </p>
                    <p className="text-xs text-gray-400">{patient.phone}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => onSendGift && onSendGift(patient.id)}
                    className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full hover:bg-yellow-200"
                  >
                    <Gift size={12} className="inline mr-1" />
                    Kirim Reward
                  </button>
                  <button 
                    onClick={() => onSendMessage && onSendMessage(patient.id)}
                    className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-full hover:bg-primary/20"
                  >
                    <Send size={12} className="inline mr-1" />
                    Ucapan
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UpcomingBirthdays;
