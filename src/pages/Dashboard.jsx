import React from 'react';
import PageHeader from '../components/PageHeader';
import { Calendar, Users, DollarSign, Activity, Clock, CheckCircle } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { title: 'Pasien Hari Ini', value: '24', change: '+12%', icon: Users, color: 'from-blue-500 to-blue-600' },
    { title: 'Janji Temu Selesai', value: '18', change: '+8%', icon: CheckCircle, color: 'from-green-500 to-green-600' },
    { title: 'Pendapatan Hari Ini', value: 'Rp 4.500.000', change: '+23%', icon: DollarSign, color: 'from-yellow-500 to-yellow-600' },
    { title: 'Rating Kepuasan', value: '4.8/5', change: '+5%', icon: Activity, color: 'from-purple-500 to-purple-600' },
  ];

  const todayAppointments = [
    { time: '09:00', patient: 'Budi Santoso', doctor: 'drg. Rizky', status: 'completed', type: 'Konsultasi' },
    { time: '10:30', patient: 'Siti Aminah', doctor: 'drg. Rizky', status: 'ongoing', type: 'Tambal Gigi' },
    { time: '13:00', patient: 'Ahmad Fauzi', doctor: 'drg. Sarah', status: 'waiting', type: 'Scaling' },
    { time: '14:30', patient: 'Dewi Lestari', doctor: 'drg. Rizky', status: 'scheduled', type: 'Cabut Gigi' },
  ];

  const getStatusBadge = (status) => {
    const badges = {
      completed: 'bg-green-100 text-green-800',
      ongoing: 'bg-blue-100 text-blue-800',
      waiting: 'bg-yellow-100 text-yellow-800',
      scheduled: 'bg-gray-100 text-gray-800',
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const texts = {
      completed: 'Selesai',
      ongoing: 'Berlangsung',
      waiting: 'Menunggu',
      scheduled: 'Terjadwal',
    };
    return texts[status] || status;
  };

  return (
    <div>
      <PageHeader 
        title="Dashboard" 
        subtitle="Selamat datang kembali, drg. Rizky! Berikut ringkasan aktivitas klinik hari ini."
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} bg-opacity-10`}>
                <stat.icon className="text-white" size={24} />
              </div>
              <span className="text-sm text-green-600 font-medium">{stat.change}</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-sm text-gray-500 mt-1">{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Appointments */}
        <div className="lg:col-span-2 card">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Janji Temu Hari Ini</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {todayAppointments.map((appointment, index) => (
              <div key={index} className="p-4 hover:bg-gray-50 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-16">
                      <span className="text-sm font-medium text-gray-500">{appointment.time}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{appointment.patient}</p>
                      <p className="text-sm text-gray-500">{appointment.doctor} • {appointment.type}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(appointment.status)}`}>
                    {getStatusText(appointment.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Aksi Cepat</h2>
          </div>
          <div className="p-4 space-y-3">
            <button className="w-full btn-primary flex items-center justify-center">
              <Users size={18} className="mr-2" />
              Pasien Baru
            </button>
            <button className="w-full bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-all flex items-center justify-center">
              <Calendar size={18} className="mr-2" />
              Buat Janji Temu
            </button>
            <button className="w-full bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-all flex items-center justify-center">
              <Activity size={18} className="mr-2" />
              Mulai Pemeriksaan
            </button>
          </div>

          {/* Integration Badge */}
          <div className="p-4 border-t border-gray-100 mt-2">
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <p className="text-xs text-blue-800">
                ✅ Terintegrasi dengan <span className="font-semibold">SATUSEHAT</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;