import React from 'react';
import { History, UserPlus, Edit, Trash2, CheckCircle, Clock } from 'lucide-react';

const actionIcons = {
  CREATE: { icon: UserPlus, color: 'text-green-500', bg: 'bg-green-100' },
  UPDATE: { icon: Edit, color: 'text-blue-500', bg: 'bg-blue-100' },
  DELETE: { icon: Trash2, color: 'text-red-500', bg: 'bg-red-100' },
  LOGIN: { icon: CheckCircle, color: 'text-primary', bg: 'bg-primary/10' },
  default: { icon: History, color: 'text-gray-500', bg: 'bg-gray-100' },
};

const RecentActivityLog = ({ logs = [], onViewAll }) => {
  if (logs.length === 0) {
    return (
      <div className="card">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-txt-primary flex items-center gap-2">
            <History size={18} />
            Aktivitas Terkini
          </h2>
        </div>
        <div className="p-8 text-center text-gray-500">
          <History size={40} className="mx-auto text-gray-300 mb-2" />
          <p>Belum ada aktivitas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-lg font-bold text-txt-primary flex items-center gap-2">
          <History size={18} />
          Aktivitas Terkini
        </h2>
        <button onClick={onViewAll} className="text-xs text-primary hover:underline">
          Lihat Semua
        </button>
      </div>
      <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
        {logs.map((log) => {
          const actionConfig = actionIcons[log.action] || actionIcons.default;
          const Icon = actionConfig.icon;
          const timeAgo = new Date(log.created_at).toLocaleTimeString('id-ID', { 
            hour: '2-digit', 
            minute: '2-digit' 
          });

          return (
            <div key={log.id} className="p-3 hover:bg-gray-50 transition">
              <div className="flex items-start gap-3">
                <div className={`p-1.5 rounded-full ${actionConfig.bg}`}>
                  <Icon size={12} className={actionConfig.color} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">{log.user_name}</span>
                    {' '}{log.action === 'CREATE' ? 'menambahkan' : 
                           log.action === 'UPDATE' ? 'mengubah' :
                           log.action === 'DELETE' ? 'menghapus' : 'melakukan'}{' '}
                    {log.table_name?.replace('_', ' ')}
                  </p>
                  <p className="text-xs text-gray-400 flex items-center gap-2 mt-1">
                    <Clock size={10} />
                    {timeAgo}
                    {log.ip_address && <span>• IP: {log.ip_address}</span>}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivityLog;
