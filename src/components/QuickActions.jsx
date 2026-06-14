import React from 'react';
import { 
  UserPlus, CalendarPlus, Stethoscope, Wallet, Package, Gift, 
  MessageCircle, TrendingUp, FileText, Settings, Users, DollarSign
} from 'lucide-react';

const QuickActions = ({ onAction }) => {
  const actions = [
    { id: 'new_patient', label: 'Pasien Baru', icon: UserPlus, color: 'bg-primary', description: 'Tambah data pasien baru' },
    { id: 'new_appointment', label: 'Buat Janji', icon: CalendarPlus, color: 'bg-secondary', description: 'Jadwalkan perawatan' },
    { id: 'start_exam', label: 'Pemeriksaan', icon: Stethoscope, color: 'bg-third', description: 'Catat tindakan medis' },
    { id: 'payment', label: 'Pembayaran', icon: Wallet, color: 'bg-fourth', description: 'Rekam transaksi' },
    { id: 'inventory', label: 'Cek Stok', icon: Package, color: 'bg-purple-500', description: 'Kelola inventaris' },
    { id: 'loyalty', label: 'Tukar Poin', icon: Gift, color: 'bg-pink-500', description: 'Program loyalitas' },
    { id: 'promo', label: 'Promo Aktif', icon: TrendingUp, color: 'bg-orange-500', description: 'Kelola promosi' },
    { id: 'broadcast', label: 'Broadcast', icon: MessageCircle, color: 'bg-green-500', description: 'Kirim notifikasi massal' },
    { id: 'report', label: 'Laporan', icon: FileText, color: 'bg-indigo-500', description: 'Lihat laporan keuangan' },
    { id: 'survey', label: 'Survey', icon: Users, color: 'bg-teal-500', description: 'Lihat feedback pasien' },
  ];

  return (
    <div className="card">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-bold text-txt-primary">Pintasan Cepat</h2>
        <p className="text-sm text-gray-500 mt-1">Akses fitur utama klinik</p>
      </div>
      <div className="p-4 grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => onAction && onAction(action.id)}
              className="group flex flex-col items-center p-3 rounded-xl bg-gray-50 hover:shadow-md transition-all"
            >
              <div className={`p-2 rounded-lg ${action.color} text-white mb-2 group-hover:scale-110 transition`}>
                <Icon size={20} />
              </div>
              <span className="text-xs font-semibold text-gray-700">{action.label}</span>
              <span className="text-[10px] text-gray-400 text-center mt-0.5 hidden group-hover:block">
                {action.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
