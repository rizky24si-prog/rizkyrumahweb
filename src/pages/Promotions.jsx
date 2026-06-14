import React, { useState, useEffect } from 'react';
import { 
  Tag, Plus, Edit, Trash2, Calendar, Percent, Users, 
  Copy, Check, Send, TrendingUp, X, Image, Clock,
  Megaphone, MessageCircle, Filter, Search, Download,
  Eye, EyeOff, AlertCircle, Gift, Coffee, Cake, PartyPopper, Loader2
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import dentalAPI from '../services/dentalAPI';

const Promotions = () => {
  // ========== STATE ==========
  const [promotions, setPromotions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showBlastModal, setShowBlastModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [copiedCode, setCopiedCode] = useState(null);
  const [sendingBlast, setSendingBlast] = useState(false);
  const [blastResult, setBlastResult] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    start_date: '',
    end_date: '',
    discount_percent: '',
    discount_amount: '',
    discount_type: 'percent',
    min_transaction: '',
    coupon_code: '',
    quota: '',
    target_treatments: [],
    target_patients: 'all', // all, new, loyal, birthday
    terms_conditions: '',
    is_active: true
  });

  // Blast state
  const [blastData, setBlastData] = useState({
    promotion_id: '',
    message: '',
    schedule: 'now',
    schedule_date: '',
    target: 'all'
  });

  // Templates
  const templates = [
    { id: 1, name: 'Lebaran', icon: Cake, message: '🎉 Selamat Hari Raya Idul Fitri! Dapatkan diskon 20% untuk semua perawatan. Gunakan kode: LEBARAN20', color: 'bg-green-500' },
    { id: 2, name: 'Tahun Baru', icon: PartyPopper, message: '🎊 Selamat Tahun Baru! Nikmati diskon 15% untuk scaling & whitening. Kode: NEWYEAR15', color: 'bg-blue-500' },
    { id: 3, name: 'HUT Klinik', icon: Gift, message: '🎂 HUT Klinik ke-5! Diskon 25% untuk semua perawatan. Kode: HUTDENTAL5', color: 'bg-pink-500' },
    { id: 4, name: 'Back to School', icon: Coffee, message: '📚 Kembali Bersekolah! Diskon khusus behel & scaling. Kode: BACKTOSCHOOL', color: 'bg-orange-500' },
    { id: 5, name: 'Hari Kesehatan Gigi', icon: Tag, message: '🦷 Hari Kesehatan Gigi Nasional! Konsultasi gratis + diskon 30% perawatan. Kode: SEHATGIGI', color: 'bg-primary' }
  ];

  // ========== FETCH DATA ==========
  const fetchData = async () => {
    setLoading(true);
    try {
      const [promosData, patientsData, treatmentsData] = await Promise.all([
        dentalAPI.promotions.getAll(),
        dentalAPI.patients.getAll(),
        dentalAPI.treatments.getAll()
      ]);
      setPromotions(promosData || []);
      setPatients(patientsData || []);
      setTreatments(treatmentsData || []);
    } catch (error) {
      console.error('Error fetching promotions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ========== CRUD OPERATIONS ==========
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const promoData = {
        ...formData,
        discount_percent: formData.discount_type === 'percent' ? parseInt(formData.discount_percent) : null,
        discount_amount: formData.discount_type === 'fixed' ? parseInt(formData.discount_amount) : null,
        used_count: 0
      };
      
      if (editingPromo) {
        await dentalAPI.promotions.update(editingPromo.id, promoData);
        await dentalAPI.activityLogs.log(1, 'UPDATE', 'promotions', editingPromo.id, editingPromo, promoData);
      } else {
        if (!promoData.coupon_code) {
          promoData.coupon_code = generateCouponCode();
        }
        await dentalAPI.promotions.create(promoData);
        await dentalAPI.activityLogs.log(1, 'CREATE', 'promotions', null, null, promoData);
      }
      await fetchData();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving promotion:', error);
      alert('Gagal menyimpan promosi: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus promosi ini?')) {
      try {
        await dentalAPI.promotions.update(id, { is_active: false });
        await dentalAPI.activityLogs.log(1, 'DELETE', 'promotions', id, null, { is_active: false });
        await fetchData();
      } catch (error) {
        console.error('Error deleting promotion:', error);
      }
    }
  };

  const handleEdit = (promo) => {
    setEditingPromo(promo);
    setFormData({
      name: promo.name || '',
      start_date: promo.start_date || '',
      end_date: promo.end_date || '',
      discount_percent: promo.discount_percent || '',
      discount_amount: promo.discount_amount || '',
      discount_type: promo.discount_percent ? 'percent' : 'fixed',
      min_transaction: promo.min_transaction || '',
      coupon_code: promo.coupon_code || '',
      quota: promo.quota || '',
      target_treatments: promo.target_treatments || [],
      target_patients: promo.target_patients || 'all',
      terms_conditions: promo.terms_conditions || '',
      is_active: promo.is_active !== false
    });
    setShowModal(true);
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      await dentalAPI.promotions.update(id, { is_active: !currentStatus });
      await fetchData();
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const generateCouponCode = () => {
    const code = `PROMO${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setFormData({ ...formData, coupon_code: code });
    return code;
  };

  const resetForm = () => {
    setEditingPromo(null);
    setFormData({
      name: '',
      start_date: '',
      end_date: '',
      discount_percent: '',
      discount_amount: '',
      discount_type: 'percent',
      min_transaction: '',
      coupon_code: '',
      quota: '',
      target_treatments: [],
      target_patients: 'all',
      terms_conditions: '',
      is_active: true
    });
  };

  // ========== BLAST WA FUNCTION ==========
  const getTargetPatients = () => {
    let targetList = [...patients];
    
    if (blastData.target === 'all') {
      targetList = patients.filter(p => p.is_active !== false);
    } else if (blastData.target === 'active') {
      targetList = patients.filter(p => p.is_active !== false);
    } else if (blastData.target === 'new') {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      targetList = patients.filter(p => new Date(p.created_at) > lastMonth);
    } else if (blastData.target === 'birthday') {
      const currentMonth = new Date().getMonth();
      targetList = patients.filter(p => {
        if (!p.birth_date) return false;
        return new Date(p.birth_date).getMonth() === currentMonth;
      });
    }
    
    return targetList.filter(p => p.phone || p.whatsapp);
  };

  const handleBlast = async () => {
    if (!blastData.promotion_id) {
      alert('Pilih promosi terlebih dahulu');
      return;
    }
    
    const promo = promotions.find(p => p.id === parseInt(blastData.promotion_id));
    if (!promo) return;
    
    const targetPatients = getTargetPatients();
    if (targetPatients.length === 0) {
      alert('Tidak ada pasien yang menjadi target');
      return;
    }
    
    setSendingBlast(true);
    setBlastResult(null);
    
    let successCount = 0;
    let failCount = 0;
    
    for (const patient of targetPatients) {
      try {
        const message = blastData.message || generateBlastMessage(promo, patient);
        await dentalAPI.communicationLogs.logOutgoing(
          patient.id,
          'wa',
          message,
          1
        );
        successCount++;
      } catch (error) {
        console.error(`Failed to send to ${patient.full_name}:`, error);
        failCount++;
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setBlastResult({ success: successCount, fail: failCount, total: targetPatients.length });
    setSendingBlast(false);
    
    // Update promo usage count
    if (successCount > 0) {
      await dentalAPI.promotions.update(promo.id, { 
        used_count: (promo.used_count || 0) + successCount 
      });
      await fetchData();
    }
  };

  const generateBlastMessage = (promo, patient) => {
    let message = `*${promo.name}*\n\n`;
    message += `Halo ${patient.full_name},\n\n`;
    message += `🎉 Dapatkan promo spesial dari Klinik Gigi Dental Plus!\n\n`;
    message += `📢 ${promo.name}\n`;
    
    if (promo.discount_percent) {
      message += `💰 Diskon ${promo.discount_percent}% untuk semua perawatan\n`;
    } else if (promo.discount_amount) {
      message += `💰 Potongan Rp${promo.discount_amount.toLocaleString()}\n`;
    }
    
    if (promo.min_transaction > 0) {
      message += `🛒 Minimal transaksi Rp${promo.min_transaction.toLocaleString()}\n`;
    }
    
    message += `📅 Periode: ${new Date(promo.start_date).toLocaleDateString('id-ID')} - ${new Date(promo.end_date).toLocaleDateString('id-ID')}\n\n`;
    
    if (promo.coupon_code) {
      message += `🎫 Kode Kupon: *${promo.coupon_code}*\n\n`;
    }
    
    message += `Segera booking jadwal Anda!\n\n`;
    message += `📞 Hubungi: 0812-3456-7890\n`;
    message += `📍 Klinik Gigi Dental Plus\n\n`;
    message += `_*Syarat dan ketentuan berlaku*_`;
    
    return message;
  };

  const applyTemplate = (template) => {
    const promo = promotions.find(p => p.id === parseInt(blastData.promotion_id));
    if (promo) {
      const message = template.message.replace(/LEBARAN20/g, promo.coupon_code || 'PROMO');
      setBlastData({ ...blastData, message });
    }
    setShowTemplateModal(false);
  };

  // ========== STATISTICS ==========
  const activePromotions = promotions.filter(p => p.is_active && new Date(p.end_date) >= new Date());
  const expiredPromotions = promotions.filter(p => p.is_active && new Date(p.end_date) < new Date());
  const totalUsed = promotions.reduce((sum, p) => sum + (p.used_count || 0), 0);
  const totalQuota = promotions.reduce((sum, p) => sum + (p.quota || 0), 0);
  const mostUsedPromo = promotions.sort((a,b) => (b.used_count || 0) - (a.used_count || 0))[0];

  // ========== FILTERS ==========
  const filteredPromotions = promotions.filter(promo => {
    const matchSearch = promo.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        promo.coupon_code?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' ? true :
                        statusFilter === 'active' ? (promo.is_active && new Date(promo.end_date) >= new Date()) :
                        statusFilter === 'expired' ? (new Date(promo.end_date) < new Date()) :
                        promo.is_active === (statusFilter === 'active');
    return matchSearch && matchStatus;
  });

  // ========== EXPORT ==========
  const exportToCSV = () => {
    const headers = ['Nama', 'Kode Kupon', 'Diskon', 'Min Transaksi', 'Periode', 'Terpakai', 'Status'];
    const rows = promotions.map(p => [
      p.name,
      p.coupon_code,
      p.discount_percent ? `${p.discount_percent}%` : `Rp${p.discount_amount?.toLocaleString()}`,
      p.min_transaction ? `Rp${p.min_transaction?.toLocaleString()}` : '-',
      `${p.start_date} s/d ${p.end_date}`,
      p.used_count || 0,
      p.is_active && new Date(p.end_date) >= new Date() ? 'Aktif' : 'Nonaktif'
    ]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `promotions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <PageHeader 
        title="Promosi Hari Tertentu" 
        subtitle="Kelola promo, diskon, dan blast notifikasi ke pasien"
        onRefresh={fetchData}
        onDownload={exportToCSV}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 text-center border-l-4 border-primary">
          <p className="text-2xl font-bold text-primary">{activePromotions.length}</p>
          <p className="text-sm text-gray-500">Promosi Aktif</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center border-l-4 border-orange-500">
          <p className="text-2xl font-bold text-orange-500">{expiredPromotions.length}</p>
          <p className="text-sm text-gray-500">Kadaluarsa</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center border-l-4 border-green-500">
          <p className="text-2xl font-bold text-green-500">{totalUsed}</p>
          <p className="text-sm text-gray-500">Total Terpakai</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center border-l-4 border-blue-500">
          <p className="text-2xl font-bold text-blue-500">{totalQuota}</p>
          <p className="text-sm text-gray-500">Total Kuota</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center border-l-4 border-purple-500">
          <p className="text-sm font-semibold text-purple-500 truncate">{mostUsedPromo?.name || '-'}</p>
          <p className="text-sm text-gray-500">Terlaris</p>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Cari promosi (nama atau kode)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary text-sm"
          />
        </div>
        <div className="flex gap-3">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 border rounded-lg text-sm">
            <option value="all">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="expired">Kadaluarsa</option>
            <option value="inactive">Nonaktif</option>
          </select>
          <button
            onClick={() => { resetForm(); setShowModal(true); }}
            className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
          >
            <Plus size={16} /> Tambah Promosi
          </button>
        </div>
      </div>

      {/* Promotions Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Nama</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Kode</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Diskon</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Periode</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Terpakai</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr><td colSpan="7" className="px-4 py-8 text-center text-gray-500">Memuat data...</td></tr>
              ) : filteredPromotions.length === 0 ? (
                <tr><td colSpan="7" className="px-4 py-8 text-center text-gray-500"><Tag size={40} className="mx-auto text-gray-300 mb-2" />Belum ada promosi</td></tr>
              ) : (
                filteredPromotions.map((promo) => {
                  const isActive = promo.is_active && new Date(promo.end_date) >= new Date();
                  const remainingDays = Math.ceil((new Date(promo.end_date) - new Date()) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <tr key={promo.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900">{promo.name}</p>
                          <p className="text-xs text-gray-400">
                            {promo.target_patients === 'new' ? 'Pasien Baru' : 
                             promo.target_patients === 'birthday' ? 'Ulang Tahun' : 
                             promo.target_patients === 'loyal' ? 'Member Loyal' : 'Semua Pasien'}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {promo.coupon_code ? (
                          <div className="flex items-center gap-2">
                            <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{promo.coupon_code}</code>
                            <button onClick={() => handleCopyCode(promo.coupon_code)} className="p-1 hover:bg-gray-200 rounded">
                              {copiedCode === promo.coupon_code ? <Check size={12} className="text-green-500" /> : <Copy size={12} className="text-gray-400" />}
                            </button>
                          </div>
                        ) : <span className="text-gray-400">-</span>}
                      </td>
                      <td className="px-4 py-3">
                        {promo.discount_percent ? (
                          <span className="text-green-600 font-semibold">{promo.discount_percent}% OFF</span>
                        ) : promo.discount_amount ? (
                          <span className="text-green-600 font-semibold">Rp{promo.discount_amount.toLocaleString()}</span>
                        ) : '-'}
                        {promo.min_transaction > 0 && <p className="text-xs text-gray-400">min Rp{promo.min_transaction.toLocaleString()}</p>}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm">{new Date(promo.start_date).toLocaleDateString('id-ID')}</p>
                        <p className="text-xs text-gray-400">sd {new Date(promo.end_date).toLocaleDateString('id-ID')}</p>
                        {isActive && remainingDays > 0 && <p className="text-xs text-orange-500">Sisa {remainingDays} hari</p>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div className="bg-primary rounded-full h-2" style={{ width: `${((promo.used_count || 0) / (promo.quota || 1)) * 100}%` }}></div>
                          </div>
                          <span className="text-sm">{promo.used_count || 0}/{promo.quota || '∞'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {isActive ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-green-100 text-green-700"><Check size={10} /> Aktif</span>
                        ) : new Date(promo.end_date) < new Date() ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-500"><Clock size={10} /> Kadaluarsa</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-red-100 text-red-700"><X size={10} /> Nonaktif</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => { setSelectedPromo(promo); setBlastData({ ...blastData, promotion_id: promo.id, message: '' }); setShowBlastModal(true); }} className="p-1.5 text-primary hover:bg-primary/10 rounded" title="Blast WA"><Megaphone size={14} /></button>
                          <button onClick={() => handleEdit(promo)} className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded" title="Edit"><Edit size={14} /></button>
                          <button onClick={() => handleToggleActive(promo.id, promo.is_active)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title={promo.is_active ? "Nonaktifkan" : "Aktifkan"}>{promo.is_active ? <EyeOff size={14} /> : <Eye size={14} />}</button>
                          <button onClick={() => handleDelete(promo.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Hapus"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
           </table>
        </div>
      </div>

      {/* ========== ADD/EDIT PROMOTION MODAL ========== */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">{editingPromo ? 'Edit Promosi' : 'Tambah Promosi Baru'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Promosi *</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="w-full px-3 py-2 border rounded-lg" placeholder="Contoh: Diskon Lebaran 20%" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai *</label>
                  <input type="date" value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} required className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Selesai *</label>
                  <input type="date" value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} required className="w-full px-3 py-2 border rounded-lg" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Diskon</label>
                  <select value={formData.discount_type} onChange={e => setFormData({...formData, discount_type: e.target.value})} className="w-full px-3 py-2 border rounded-lg">
                    <option value="percent">Persentase (%)</option>
                    <option value="fixed">Potongan Nominal (Rp)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{formData.discount_type === 'percent' ? 'Diskon (%)' : 'Diskon (Rp)'}</label>
                  {formData.discount_type === 'percent' ? (
                    <input type="number" value={formData.discount_percent} onChange={e => setFormData({...formData, discount_percent: e.target.value})} className="w-full px-3 py-2 border rounded-lg" placeholder="20" />
                  ) : (
                    <input type="number" value={formData.discount_amount} onChange={e => setFormData({...formData, discount_amount: e.target.value})} className="w-full px-3 py-2 border rounded-lg" placeholder="50000" />
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Minimal Transaksi</label>
                  <input type="number" value={formData.min_transaction} onChange={e => setFormData({...formData, min_transaction: e.target.value})} className="w-full px-3 py-2 border rounded-lg" placeholder="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kode Kupon</label>
                  <div className="flex gap-2">
                    <input type="text" value={formData.coupon_code} onChange={e => setFormData({...formData, coupon_code: e.target.value})} className="flex-1 px-3 py-2 border rounded-lg" placeholder="Auto generate" />
                    <button type="button" onClick={generateCouponCode} className="px-3 py-2 bg-gray-100 rounded-lg text-sm">Generate</button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kuota</label>
                  <input type="number" value={formData.quota} onChange={e => setFormData({...formData, quota: e.target.value})} className="w-full px-3 py-2 border rounded-lg" placeholder="Kosongkan untuk unlimited" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Pasien</label>
                  <select value={formData.target_patients} onChange={e => setFormData({...formData, target_patients: e.target.value})} className="w-full px-3 py-2 border rounded-lg">
                    <option value="all">Semua Pasien</option>
                    <option value="new">Pasien Baru</option>
                    <option value="loyal">Member Loyal (Poin &gt; 500)</option>
                    <option value="birthday">Ulang Tahun Bulan Ini</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Tindakan</label>
                  <div className="grid grid-cols-2 gap-2 border rounded-lg p-3 max-h-32 overflow-y-auto">
                    {treatments.filter(t => t.is_active).map(t => (
                      <label key={t.id} className="flex items-center gap-2 text-sm">
                        <input type="checkbox" value={t.id} checked={formData.target_treatments.includes(t.id)} onChange={(e) => {
                          if (e.target.checked) setFormData({...formData, target_treatments: [...formData.target_treatments, t.id]});
                          else setFormData({...formData, target_treatments: formData.target_treatments.filter(id => id !== t.id)});
                        }} />
                        {t.name}
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Kosongkan untuk semua tindakan</p>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Syarat & Ketentuan</label>
                  <textarea rows="3" value={formData.terms_conditions} onChange={e => setFormData({...formData, terms_conditions: e.target.value})} className="w-full px-3 py-2 border rounded-lg" placeholder="Syarat dan ketentuan berlaku..." />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Batal</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========== BLAST WA MODAL ========== */}
      {showBlastModal && selectedPromo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Blast WA - {selectedPromo.name}</h2>
              <button onClick={() => { setShowBlastModal(false); setBlastResult(null); }}><X size={20} /></button>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Target Info */}
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-sm font-medium text-blue-800">Target Pengiriman</p>
                <p className="text-sm text-blue-600">Akan dikirim ke {getTargetPatients().length} pasien</p>
              </div>
              
              {/* Templates */}
              <div>
                <label className="block text-sm font-medium mb-2">Template Pesan Cepat</label>
                <div className="grid grid-cols-2 gap-2">
                  {templates.map(template => (
                    <button key={template.id} type="button" onClick={() => applyTemplate(template)} className="flex items-center gap-2 p-2 border rounded-lg hover:bg-gray-50">
                      <div className={`w-8 h-8 rounded-full ${template.color} flex items-center justify-center text-white`}>{React.createElement(template.icon, { size: 14 })}</div>
                      <span className="text-sm">{template.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Message */}
              <div>
                <label className="block text-sm font-medium mb-1">Pesan WhatsApp</label>
                <textarea rows="12" value={blastData.message || generateBlastMessage(selectedPromo, { full_name: 'Nama Pasien' })} onChange={e => setBlastData({...blastData, message: e.target.value})} className="w-full px-3 py-2 border rounded-lg font-mono text-sm" />
              </div>
              
              {/* Schedule */}
              <div>
                <label className="block text-sm font-medium mb-1">Jadwal Pengiriman</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-2"><input type="radio" name="schedule" value="now" checked={blastData.schedule === 'now'} onChange={() => setBlastData({...blastData, schedule: 'now'})} /> Kirim Sekarang</label>
                  <label className="flex items-center gap-2"><input type="radio" name="schedule" value="scheduled" checked={blastData.schedule === 'scheduled'} onChange={() => setBlastData({...blastData, schedule: 'scheduled'})} /> Jadwalkan</label>
                </div>
                {blastData.schedule === 'scheduled' && <input type="datetime-local" value={blastData.schedule_date} onChange={e => setBlastData({...blastData, schedule_date: e.target.value})} className="mt-2 px-3 py-2 border rounded-lg" />}
              </div>
              
              {/* Result */}
              {blastResult && (
                <div className={`p-3 rounded-lg ${blastResult.fail === 0 ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                  <p className="font-medium">Hasil Pengiriman</p>
                  <p className="text-sm">✓ Berhasil: {blastResult.success} | ✗ Gagal: {blastResult.fail}</p>
                  <p className="text-sm">Total: {blastResult.total} pasien</p>
                </div>
              )}
              
              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button onClick={() => { setShowBlastModal(false); setBlastResult(null); }} className="px-4 py-2 border rounded-lg">Batal</button>
                <button onClick={handleBlast} disabled={sendingBlast} className="px-4 py-2 bg-primary text-white rounded-lg flex items-center gap-2 disabled:opacity-50">
                  {sendingBlast ? <><Loader2 size={16} className="animate-spin" /> Mengirim...</> : <><Send size={16} /> Kirim Blast</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Promotions;
