import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, User, Shield, Bell, Clock, DollarSign, 
  Database, Globe, Lock, Smartphone, Mail, Save,
  Users, Calendar, Tag, Package, Activity, AlertCircle
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import dentalAPI from '../services/dentalAPI';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  
  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    clinic_name: 'Klinik Gigi Dental Plus',
    clinic_address: 'Jl. Contoh No. 123, Jakarta',
    clinic_phone: '0812-3456-7890',
    clinic_email: 'info@dentalplus.com',
    clinic_logo: null,
    operating_hours: {
      monday: { open: '09:00', close: '17:00', enabled: true },
      tuesday: { open: '09:00', close: '17:00', enabled: true },
      wednesday: { open: '09:00', close: '17:00', enabled: true },
      thursday: { open: '09:00', close: '17:00', enabled: true },
      friday: { open: '09:00', close: '17:00', enabled: true },
      saturday: { open: '09:00', close: '14:00', enabled: true },
      sunday: { open: '09:00', close: '13:00', enabled: false }
    },
    break_time: { start: '12:00', end: '13:00' },
    buffer_minutes: 10,
    max_advance_booking_days: 30,
    min_cancel_hours: 2
  });
  
  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    reminder_hours: [48, 24, 1],
    send_whatsapp: true,
    send_sms: false,
    send_email: true,
    auto_confirm: false,
    reminder_template: 'Halo {name}, Anda memiliki jadwal perawatan pada {date} jam {time}.'
  });
  
  // Payment Settings
  const [paymentSettings, setPaymentSettings] = useState({
    payment_methods: ['cash', 'transfer', 'qris'],
    loyalty_points_rate: 1000, // 1 point per Rp1000
    discount_max_percent: 30,
    installment_enabled: true,
    installment_max_months: 6
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const usersData = await dentalAPI.users.getAll();
      setUsers(usersData || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // Load settings from localStorage or API
    const savedSettings = localStorage.getItem('clinic_settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setGeneralSettings(parsed.general || generalSettings);
      setNotificationSettings(parsed.notifications || notificationSettings);
      setPaymentSettings(parsed.payment || paymentSettings);
    }
  }, []);

  const saveSettings = () => {
    const allSettings = {
      general: generalSettings,
      notifications: notificationSettings,
      payment: paymentSettings
    };
    localStorage.setItem('clinic_settings', JSON.stringify(allSettings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleAddUser = async () => {
    const username = prompt('Username:');
    const fullName = prompt('Nama Lengkap:');
    const role = prompt('Role (admin/dokter/resepsionis/kasir):');
    if (username && fullName) {
      try {
        await dentalAPI.users.create({
          username,
          full_name: fullName,
          role,
          password_hash: 'default123',
          is_active: true
        });
        await fetchUsers();
        alert('User berhasil ditambahkan');
      } catch (error) {
        console.error('Error adding user:', error);
      }
    }
  };

  const handleToggleUserStatus = async (id, currentStatus) => {
    try {
      await dentalAPI.users.update(id, { is_active: !currentStatus });
      await fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayNames = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <PageHeader title="Pengaturan Sistem" subtitle="Konfigurasi aplikasi klinik gigi" onRefresh={fetchUsers} />
      
      {saved && <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50"><Save size={16} /> Pengaturan tersimpan</div>}
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-4 space-y-1">
            {[
              { id: 'general', label: 'Umum', icon: SettingsIcon },
              { id: 'users', label: 'User Management', icon: Users },
              { id: 'schedule', label: 'Jam Operasional', icon: Clock },
              { id: 'notifications', label: 'Notifikasi', icon: Bell },
              { id: 'payment', label: 'Pembayaran & Loyalitas', icon: DollarSign },
              { id: 'backup', label: 'Backup & Restore', icon: Database }
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${activeTab === tab.id ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100'}`}><tab.icon size={18} /><span className="text-sm">{tab.label}</span></button>
            ))}
          </div>
        </div>
        
        {/* Content */}
        <div className="lg:col-span-3">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="bg-white rounded-xl shadow-sm p-6"><h2 className="text-lg font-bold mb-4">Informasi Klinik</h2><div className="space-y-4"><div><label className="block text-sm font-medium mb-1">Nama Klinik</label><input type="text" value={generalSettings.clinic_name} onChange={e => setGeneralSettings({...generalSettings, clinic_name: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div><div><label className="block text-sm font-medium mb-1">Alamat</label><textarea value={generalSettings.clinic_address} onChange={e => setGeneralSettings({...generalSettings, clinic_address: e.target.value})} rows="2" className="w-full px-3 py-2 border rounded-lg" /></div><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-1">Telepon</label><input type="text" value={generalSettings.clinic_phone} onChange={e => setGeneralSettings({...generalSettings, clinic_phone: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div><div><label className="block text-sm font-medium mb-1">Email</label><input type="email" value={generalSettings.clinic_email} onChange={e => setGeneralSettings({...generalSettings, clinic_email: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div></div><div className="flex justify-end"><button onClick={saveSettings} className="px-4 py-2 bg-primary text-white rounded-lg flex items-center gap-2"><Save size={16} /> Simpan</button></div></div></div>
          )}
          
          {/* User Management */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden"><div className="p-4 border-b flex justify-between items-center"><h2 className="font-bold">Manajemen User</h2><button onClick={handleAddUser} className="bg-primary text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1"><User size={14} /> Tambah User</button></div><div className="divide-y">{users.map(user => (<div key={user.id} className="p-4 flex justify-between items-center"><div><p className="font-medium">{user.full_name}</p><p className="text-sm text-gray-500">@{user.username} • {user.role}</p></div><div className="flex gap-2"><button onClick={() => handleToggleUserStatus(user.id, user.is_active)} className={`px-2 py-1 text-xs rounded ${user.is_active ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>{user.is_active ? 'Nonaktifkan' : 'Aktifkan'}</button></div></div>))}</div></div>
          )}
          
          {/* Schedule Settings */}
          {activeTab === 'schedule' && (
            <div className="bg-white rounded-xl shadow-sm p-6"><h2 className="font-bold mb-4">Jam Operasional</h2><div className="space-y-3">{days.map((day, i) => (<div key={day} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"><div className="flex items-center gap-3"><input type="checkbox" checked={generalSettings.operating_hours[day].enabled} onChange={e => setGeneralSettings({...generalSettings, operating_hours: {...generalSettings.operating_hours, [day]: {...generalSettings.operating_hours[day], enabled: e.target.checked}}})} className="w-4 h-4" /><span className="w-20">{dayNames[i]}</span></div>{generalSettings.operating_hours[day].enabled ? (<div className="flex gap-2"><input type="time" value={generalSettings.operating_hours[day].open} onChange={e => setGeneralSettings({...generalSettings, operating_hours: {...generalSettings.operating_hours, [day]: {...generalSettings.operating_hours[day], open: e.target.value}}})} className="border rounded px-2 py-1 text-sm" /><span>-</span><input type="time" value={generalSettings.operating_hours[day].close} onChange={e => setGeneralSettings({...generalSettings, operating_hours: {...generalSettings.operating_hours, [day]: {...generalSettings.operating_hours[day], close: e.target.value}}})} className="border rounded px-2 py-1 text-sm" /></div>) : <span className="text-gray-400 text-sm">Libur</span>}</div>))}</div><div className="mt-4"><label className="block text-sm font-medium mb-1">Istirahat Siang</label><div className="flex gap-2"><input type="time" value={generalSettings.break_time.start} onChange={e => setGeneralSettings({...generalSettings, break_time: {...generalSettings.break_time, start: e.target.value}})} className="border rounded px-3 py-1.5" /><span>-</span><input type="time" value={generalSettings.break_time.end} onChange={e => setGeneralSettings({...generalSettings, break_time: {...generalSettings.break_time, end: e.target.value}})} className="border rounded px-3 py-1.5" /></div></div><div className="flex justify-end mt-4"><button onClick={saveSettings} className="px-4 py-2 bg-primary text-white rounded-lg"><Save size={16} className="inline mr-1" /> Simpan</button></div></div>
          )}
          
          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-xl shadow-sm p-6"><h2 className="font-bold mb-4">Pengaturan Notifikasi</h2><div className="space-y-4"><div><label className="block text-sm font-medium mb-1">Waktu Pengingat (jam sebelum jadwal)</label><div className="flex gap-2">{notificationSettings.reminder_hours.map((h, i) => <input key={i} type="number" value={h} onChange={e => { const newHours = [...notificationSettings.reminder_hours]; newHours[i] = parseInt(e.target.value); setNotificationSettings({...notificationSettings, reminder_hours: newHours}); }} className="w-20 px-3 py-2 border rounded-lg text-center" />)}</div></div><div className="space-y-2"><label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"><span>Kirim via WhatsApp</span><input type="checkbox" checked={notificationSettings.send_whatsapp} onChange={e => setNotificationSettings({...notificationSettings, send_whatsapp: e.target.checked})} /></label><label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"><span>Kirim via SMS</span><input type="checkbox" checked={notificationSettings.send_sms} onChange={e => setNotificationSettings({...notificationSettings, send_sms: e.target.checked})} /></label><label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"><span>Kirim via Email</span><input type="checkbox" checked={notificationSettings.send_email} onChange={e => setNotificationSettings({...notificationSettings, send_email: e.target.checked})} /></label></div><div className="flex justify-end"><button onClick={saveSettings} className="px-4 py-2 bg-primary text-white rounded-lg">Simpan</button></div></div></div>
          )}
          
          {/* Payment Settings */}
          {activeTab === 'payment' && (
            <div className="bg-white rounded-xl shadow-sm p-6"><h2 className="font-bold mb-4">Pembayaran & Loyalitas</h2><div className="space-y-4"><div><label className="block text-sm font-medium mb-1">Konversi Poin (per Rp)</label><input type="number" value={paymentSettings.loyalty_points_rate} onChange={e => setPaymentSettings({...paymentSettings, loyalty_points_rate: parseInt(e.target.value)})} className="w-full px-3 py-2 border rounded-lg" /><p className="text-xs text-gray-400">1 poin per {paymentSettings.loyalty_points_rate.toLocaleString()} transaksi</p></div><div><label className="block text-sm font-medium mb-1">Maksimal Diskon (%)</label><input type="number" value={paymentSettings.discount_max_percent} onChange={e => setPaymentSettings({...paymentSettings, discount_max_percent: parseInt(e.target.value)})} className="w-full px-3 py-2 border rounded-lg" /></div><label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"><span>Aktifkan Cicilan</span><input type="checkbox" checked={paymentSettings.installment_enabled} onChange={e => setPaymentSettings({...paymentSettings, installment_enabled: e.target.checked})} /></label><div className="flex justify-end"><button onClick={saveSettings} className="px-4 py-2 bg-primary text-white rounded-lg">Simpan</button></div></div></div>
          )}
          
          {/* Backup */}
          {activeTab === 'backup' && (
            <div className="bg-white rounded-xl shadow-sm p-6"><h2 className="font-bold mb-4">Backup & Restore</h2><div className="space-y-4"><div className="p-4 bg-yellow-50 rounded-lg"><AlertCircle className="inline mr-2 text-yellow-600" size={16} /> Backup data secara berkala untuk mencegah kehilangan data</div><div className="flex gap-3"><button className="flex-1 py-2 border rounded-lg flex items-center justify-center gap-2"><Database size={16} /> Backup Sekarang</button><button className="flex-1 py-2 border rounded-lg flex items-center justify-center gap-2"><Database size={16} /> Restore dari Backup</button></div></div></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
