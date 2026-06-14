import React, { useState, useEffect } from 'react';
import { 
  History, Search, Filter, Download, Trash2, Shield, 
  User, Clock, AlertTriangle, CheckCircle, XCircle,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import dentalAPI from '../services/dentalAPI';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [filterUser, setFilterUser] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const [logsData, usersData] = await Promise.all([
        dentalAPI.activityLogs.getAll(),
        dentalAPI.users.getAll()
      ]);
      
      // Enrich logs with user names
      const enrichedLogs = (logsData || []).map(log => {
        const user = (usersData || []).find(u => u.id === log.user_id);
        return { ...log, user_name: user?.full_name || 'System', user_role: user?.role || 'system' };
      }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      
      setLogs(enrichedLogs);
      setUsers(usersData || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getActionIcon = (action) => {
    const icons = {
      CREATE: <CheckCircle size={14} className="text-green-500" />,
      UPDATE: <CheckCircle size={14} className="text-blue-500" />,
      DELETE: <XCircle size={14} className="text-red-500" />,
      LOGIN: <User size={14} className="text-primary" />,
      LOGOUT: <User size={14} className="text-gray-500" />
    };
    return icons[action] || <History size={14} className="text-gray-500" />;
  };

  const getActionBg = (action) => {
    const bgs = {
      CREATE: 'bg-green-50',
      UPDATE: 'bg-blue-50',
      DELETE: 'bg-red-50',
      LOGIN: 'bg-primary/10',
      LOGOUT: 'bg-gray-100'
    };
    return bgs[action] || 'bg-gray-100';
  };

  const filteredLogs = logs.filter(log => {
    const matchSearch = log.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        log.table_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchAction = filterAction === 'all' || log.action === filterAction;
    const matchUser = filterUser === 'all' || log.user_id === parseInt(filterUser);
    const matchDate = (!startDate || new Date(log.created_at) >= new Date(startDate)) &&
                      (!endDate || new Date(log.created_at) <= new Date(endDate));
    return matchSearch && matchAction && matchUser && matchDate;
  });

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const exportToCSV = () => {
    const headers = ['Waktu', 'User', 'Role', 'Aksi', 'Tabel', 'Record ID', 'IP Address'];
    const rows = filteredLogs.map(l => [new Date(l.created_at).toLocaleString(), l.user_name, l.user_role, l.action, l.table_name, l.record_id, l.ip_address]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity_logs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const deleteOldLogs = async () => {
    if (window.confirm('Hapus semua log yang berusia lebih dari 6 bulan?')) {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      // Note: This would require a backend function or manual SQL
      alert('Fitur ini memerlukan query manual di Supabase SQL Editor');
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <PageHeader title="Aktivitas Log" subtitle="Riwayat semua aktivitas sistem" onRefresh={fetchLogs} onDownload={exportToCSV} />

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" placeholder="Cari..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm" />
          </div>
          <select value={filterAction} onChange={e => setFilterAction(e.target.value)} className="px-3 py-2 border rounded-lg text-sm">
            <option value="all">Semua Aksi</option>
            <option value="CREATE">CREATE</option>
            <option value="UPDATE">UPDATE</option>
            <option value="DELETE">DELETE</option>
            <option value="LOGIN">LOGIN</option>
          </select>
          <select value={filterUser} onChange={e => setFilterUser(e.target.value)} className="px-3 py-2 border rounded-lg text-sm">
            <option value="all">Semua User</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.full_name}</option>)}
          </select>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="px-3 py-2 border rounded-lg text-sm" />
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="px-3 py-2 border rounded-lg text-sm" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs">Waktu</th>
                <th className="px-4 py-2 text-left text-xs">User</th>
                <th className="px-4 py-2 text-left text-xs">Aksi</th>
                <th className="px-4 py-2 text-left text-xs">Tabel</th>
                <th className="px-4 py-2 text-left text-xs">Record ID</th>
                <th className="px-4 py-2 text-left text-xs">IP</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {paginatedLogs.map(l => (
                <tr key={l.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm">{new Date(l.created_at).toLocaleString()}</td>
                  <td className="px-4 py-2 text-sm">{l.user_name}</td>
                  <td className="px-4 py-2 text-sm">{l.action}</td>
                  <td className="px-4 py-2 text-sm">{l.table_name}</td>
                  <td className="px-4 py-2 text-sm">{l.record_id}</td>
                  <td className="px-4 py-2 text-sm">{l.ip_address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 flex items-center justify-between">
          <div className="text-sm text-gray-500">Menampilkan {paginatedLogs.length} dari {filteredLogs.length} hasil</div>
          <div className="flex items-center gap-2">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p-1))} className="p-2 border rounded-lg"><ChevronLeft size={16} /></button>
            <div className="text-sm">{currentPage} / {totalPages}</div>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} className="p-2 border rounded-lg"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;
