import React from 'react';
import { Clock, User, Activity } from 'lucide-react';

const statusConfig = {
  completed: { text: 'Selesai', color: 'bg-green-500', icon: Activity },
  in_treatment: { text: 'Berlangsung', color: 'bg-yellow-500', icon: Activity },
  arrived: { text: 'Menunggu', color: 'bg-blue-500', icon: Clock },
  confirmed: { text: 'Terjadwal', color: 'bg-gray-400', icon: Clock },
  pending: { text: 'Pending', color: 'bg-orange-500', icon: Clock },
  no_show: { text: 'Tidak Datang', color: 'bg-red-500', icon: User },
  cancelled_by_patient: { text: 'Dibatalkan', color: 'bg-red-400', icon: User },
  cancelled_by_clinic: { text: 'Dibatalkan', color: 'bg-red-400', icon: User },
};

const TodayAppointments = ({ appointments = [], onStatusChange, onViewDetail }) => {
  const getStatusBadge = (status) => {
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <span className={`px-3 py-1 text-xs font-bold rounded-full text-white ${config.color} flex items-center gap-1`}>
        <Icon size={12} />
        {config.text}
      </span>
    );
  };

  if (appointments.length === 0) {
    return (
      <div className="lg:col-span-2 card">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-txt-primary">Janji Temu Hari Ini</h2>
        </div>
        <div className="p-8 text-center text-gray-500">
          <Clock size={40} className="mx-auto text-gray-300 mb-2" />
          <p>Tidak ada janji temu hari ini</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-2 card">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-lg font-bold text-txt-primary">Janji Temu Hari Ini</h2>
        <span className="text-sm text-primary font-medium">
          {appointments.length} pasien
        </span>
      </div>
      <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
        {appointments.map((appointment) => (
          <div 
            key={appointment.id} 
            className="p-4 hover:bg-gray-50 transition cursor-pointer"
            onClick={() => onViewDetail && onViewDetail(appointment)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-16">
                  <span className="text-sm font-semibold text-gray-500">
                    {appointment.start_time?.substring(0, 5)}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-gray-900 leading-tight">
                    {appointment.patient_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    drg. {appointment.doctor_name} • {appointment.treatment_names?.join(', ') || '-'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(appointment.status)}
                {appointment.status === 'pending' && onStatusChange && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStatusChange(appointment.id, 'confirmed');
                    }}
                    className="text-xs bg-primary text-white px-2 py-1 rounded hover:bg-primary/80"
                  >
                    Konfirmasi
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodayAppointments;
