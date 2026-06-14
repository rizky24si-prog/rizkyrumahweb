import React, { useState, useEffect } from 'react';
import { 
  BarChart3, PieChart, TrendingUp, Download, Calendar, 
  DollarSign, Users, Activity, FileText, Printer, 
  ChevronDown, Filter, X, Clock, Award, Package, Loader2
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import dentalAPI from '../services/dentalAPI';

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState('revenue');
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  
  const [revenueData, setRevenueData] = useState([]);
  const [treatmentStats, setTreatmentStats] = useState([]);
  const [doctorStats, setDoctorStats] = useState([]);
  const [patientStats, setPatientStats] = useState({ total: 0, new: 0, active: 0 });
  const [appointmentStats, setAppointmentStats] = useState({ total: 0, completed: 0, cancelled: 0, noShow: 0 });
  const [inventoryStats, setInventoryStats] = useState({ totalItems: 0, lowStock: 0, expiredSoon: 0, totalValue: 0 });
  const [loyaltyStats, setLoyaltyStats] = useState({ totalPoints: 0, members: 0, topTier: '' });

  const fetchReports = async () => {
    setLoading(true);
    try {
      const [allAppointments, allInvoices, allPatients, allTreatments, allDoctors, allInventory, allLoyaltyPoints] = await Promise.all([
        dentalAPI.appointments.getByDateRange(dateRange.start, dateRange.end),
        dentalAPI.invoices.getAll(),
        dentalAPI.patients.getAll(),
        dentalAPI.treatments.getAll(),
        dentalAPI.doctors.getAll(),
        dentalAPI.inventory.getAll(),
        dentalAPI.loyaltyPoints.getAll()
      ]);
      
      // Revenue Data
      const paidInvoices = allInvoices.filter(inv => inv.status === 'paid');
      const revenueByDate = {};
      paidInvoices.forEach(inv => {
        const apt = allAppointments.find(a => a.id === inv.appointment_id);
        if (apt) {
          revenueByDate[apt.appointment_date] = (revenueByDate[apt.appointment_date] || 0) + inv.total_amount;
        }
      });
      setRevenueData(Object.entries(revenueByDate).map(([date, amount]) => ({ date, amount })));
      
      // Treatment Stats
      const treatmentCount = {};
      for (const apt of allAppointments) {
        const aptTreatments = await dentalAPI.appointmentTreatments.getByAppointmentId(apt.id);
        for (const at of aptTreatments) {
          const treatment = allTreatments.find(t => t.id === at.treatment_id);
          if (treatment) treatmentCount[treatment.name] = (treatmentCount[treatment.name] || 0) + 1;
        }
      }
      setTreatmentStats(Object.entries(treatmentCount).map(([name, count]) => ({ name, count })).sort((a,b) => b.count - a.count));
      
      // Doctor Stats
      const doctorStatsMap = {};
      for (const doctor of allDoctors) {
        const doctorUser = await dentalAPI.users.getById(doctor.user_id);
        const doctorApps = allAppointments.filter(a => a.doctor_id === doctor.id);
        let revenue = 0;
        for (const apt of doctorApps) {
          const invoice = await dentalAPI.invoices.getByAppointmentId(apt.id);
          if (invoice && invoice.status === 'paid') revenue += invoice.total_amount;
        }
        doctorStatsMap[doctor.id] = {
          name: doctorUser?.full_name?.replace('drg. ', '') || 'Unknown',
          patients: doctorApps.length,
          revenue,
          completed: doctorApps.filter(a => a.status === 'completed').length
        };
      }
      setDoctorStats(Object.values(doctorStatsMap));
      
      // Patient Stats
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      const newPatients = allPatients.filter(p => new Date(p.created_at) > lastMonth);
      setPatientStats({
        total: allPatients.length,
        new: newPatients.length,
        active: allPatients.filter(p => p.is_active !== false).length
      });
      
      // Appointment Stats
      setAppointmentStats({
        total: allAppointments.length,
        completed: allAppointments.filter(a => a.status === 'completed').length,
        cancelled: allAppointments.filter(a => a.status.includes('cancelled')).length,
        noShow: allAppointments.filter(a => a.status === 'no_show').length
      });
      
      // Inventory Stats
      const lowStock = allInventory.filter(i => i.stock <= i.min_stock);
      const expiredSoon = allInventory.filter(i => i.expiry_date && new Date(i.expiry_date) < new Date(Date.now() + 30*24*60*60*1000));
      setInventoryStats({
        totalItems: allInventory.length,
        lowStock: lowStock.length,
        expiredSoon: expiredSoon.length,
        totalValue: allInventory.reduce((sum, i) => sum + (i.stock * (i.purchase_price || 0)), 0)
      });
      
      // Loyalty Stats
      const pointsByPatient = {};
      allLoyaltyPoints.forEach(p => { pointsByPatient[p.patient_id] = (pointsByPatient[p.patient_id] || 0) + p.points; });
      const totalPoints = Object.values(pointsByPatient).reduce((a,b) => a + b, 0);
      const platinumMembers = Object.values(pointsByPatient).filter(p => p >= 1500).length;
      setLoyaltyStats({
        totalPoints,
        members: Object.keys(pointsByPatient).length,
        topTier: platinumMembers > 0 ? 'Platinum' : 'Gold'
      });
      
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [dateRange]);

  const exportReport = () => {
    const headers = ['Laporan', 'Nilai'];
    const rows = [
      ['Total Pendapatan', revenueData.reduce((s, d) => s + d.amount, 0).toLocaleString()],
      ['Total Pasien', patientStats.total],
      ['Pasien Baru', patientStats.new],
      ['Total Janji Temu', appointmentStats.total],
      ['Janji Selesai', appointmentStats.completed],
      ['Tindakan Terlaris', treatmentStats[0]?.name || '-'],
      ['Dokter Terbaik', doctorStats.sort((a,b) => b.revenue - a.revenue)[0]?.name || '-']
    ];
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report_${dateRange.start}_to_${dateRange.end}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printReport = () => { window.print(); };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin" /> Memuat laporan...</div>;

  const totalRevenue = revenueData.reduce((s, d) => s + d.amount, 0);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <PageHeader title="Laporan & Statistik" subtitle="Analisis lengkap performa klinik" onRefresh={fetchReports} onDownload={exportReport} />
      
      {/* Date Range Picker */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-3">
          <div className="flex items-center gap-2"><Calendar size={16} className="text-gray-400" /><input type="date" value={dateRange.start} onChange={e => setDateRange({...dateRange, start: e.target.value})} className="border rounded-lg px-3 py-1.5 text-sm" /></div>
          <span className="text-gray-400">sd</span>
          <div className="flex items-center gap-2"><Calendar size={16} className="text-gray-400" /><input type="date" value={dateRange.end} onChange={e => setDateRange({...dateRange, end: e.target.value})} className="border rounded-lg px-3 py-1.5 text-sm" /></div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setDateRange({ start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0], end: new Date().toISOString().split('T')[0] })} className="px-3 py-1.5 text-sm border rounded-lg">Bulan Ini</button>
          <button onClick={() => setDateRange({ start: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0], end: new Date().toISOString().split('T')[0] })} className="px-3 py-1.5 text-sm border rounded-lg">Tahun Ini</button>
        </div>
        <div className="flex gap-2"><button onClick={exportReport} className="px-3 py-1.5 bg-primary text-white rounded-lg text-sm flex items-center gap-1"><Download size={14} /> Export</button><button onClick={printReport} className="px-3 py-1.5 border rounded-lg text-sm flex items-center gap-1"><Printer size={14} /> Print</button></div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4"><p className="text-2xl font-bold text-primary">Rp{(totalRevenue/1000000).toFixed(1)}JT</p><p className="text-sm text-gray-500">Total Pendapatan</p></div>
        <div className="bg-white rounded-xl p-4"><p className="text-2xl font-bold text-green-600">{patientStats.total}</p><p className="text-sm text-gray-500">Total Pasien</p><p className="text-xs text-green-500">+{patientStats.new} baru</p></div>
        <div className="bg-white rounded-xl p-4"><p className="text-2xl font-bold text-blue-600">{appointmentStats.total}</p><p className="text-sm text-gray-500">Janji Temu</p><p className="text-xs text-green-500">{appointmentStats.completed} selesai</p></div>
        <div className="bg-white rounded-xl p-4"><p className="text-2xl font-bold text-purple-600">{(loyaltyStats.totalPoints/1000).toFixed(0)}K</p><p className="text-sm text-gray-500">Total Poin</p><p className="text-xs text-purple-500">{loyaltyStats.members} member</p></div>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6"><h3 className="font-bold mb-4">Grafik Pendapatan</h3><div className="h-64 flex items-end gap-1">{revenueData.slice(-14).map((d,i) => <div key={i} className="flex-1 flex flex-col items-center"><div className="w-full bg-primary/20 rounded-t" style={{ height: `${(d.amount / Math.max(...revenueData.map(r=>r.amount),1)) * 200}px` }}><div className="w-full bg-primary rounded-t" style={{ height: `${(d.amount / Math.max(...revenueData.map(r=>r.amount),1)) * 200}px`, opacity: 0.7 }}></div></div><span className="text-xs mt-1 rotate-45 origin-top-left">{d.date.substring(5)}</span></div>)}</div><p className="text-center text-sm text-gray-500 mt-4">Total: Rp{totalRevenue.toLocaleString()}</p></div>
        
        {/* Top Treatments */}
        <div className="bg-white rounded-xl shadow-sm p-6"><h3 className="font-bold mb-4">Perawatan Terlaris</h3><div className="space-y-3">{treatmentStats.slice(0,5).map((t,i) => <div key={i}><div className="flex justify-between text-sm"><span>{t.name}</span><span className="font-semibold">{t.count}x</span></div><div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-primary rounded-full h-2" style={{ width: `${(t.count / treatmentStats[0]?.count) * 100}%` }}></div></div></div>)}</div></div>
        
        {/* Doctor Performance */}
        <div className="bg-white rounded-xl shadow-sm p-6"><h3 className="font-bold mb-4">Performa Dokter</h3><div className="space-y-3">{doctorStats.sort((a,b)=>b.revenue - a.revenue).slice(0,5).map((d,i) => <div key={i} className="flex justify-between items-center"><div><p className="font-medium">drg. {d.name}</p><p className="text-xs text-gray-500">{d.patients} pasien</p></div><div className="text-right"><p className="font-bold text-primary">Rp{(d.revenue/1000000).toFixed(1)}JT</p><p className="text-xs text-gray-500">{d.completed} selesai</p></div></div>)}</div></div>
        
        {/* Inventory Status */}
        <div className="bg-white rounded-xl shadow-sm p-6"><h3 className="font-bold mb-4">Status Inventaris</h3><div className="space-y-3"><div className="flex justify-between"><span>Total Item</span><span className="font-bold">{inventoryStats.totalItems}</span></div><div className="flex justify-between"><span>Stok Menipis</span><span className="text-yellow-600 font-bold">{inventoryStats.lowStock}</span></div><div className="flex justify-between"><span>Akan Kadaluarsa</span><span className="text-orange-600 font-bold">{inventoryStats.expiredSoon}</span></div><div className="flex justify-between"><span>Nilai Inventaris</span><span className="font-bold text-primary">Rp{(inventoryStats.totalValue/1000000).toFixed(1)}JT</span></div></div></div>
      </div>
    </div>
  );
};

export default Reports;
