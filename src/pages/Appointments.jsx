import React, { useState, useEffect } from 'react';
import { 
  Calendar, Plus, Edit, Trash2, Eye, CheckCircle, XCircle, 
  Clock, User, Stethoscope, Search, Filter, ChevronLeft, ChevronRight,
  AlertCircle, Phone, MessageCircle, Download, RefreshCw, Bell,
  Check, X, Users, DollarSign, Activity, BarChart3, Send, CalendarDays,
  List, Grid3X3, Settings, BellRing, Ban, CheckCheck, Loader2,
  Sun, Moon, Wifi, WifiOff
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import dentalAPI from '../services/dentalAPI';

const Appointments = () => {
  // ========== STATE ==========
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [doctorUsers, setDoctorUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('day');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDoctor, setSelectedDoctor] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [reminderMessage, setReminderMessage] = useState('');
  const [sendingReminder, setSendingReminder] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  
  // Stats
  const [stats, setStats] = useState({
    total: 0, completed: 0, pending: 0, cancelled: 0, noShow: 0, revenue: 0,
    noShowRate: 0, conversionRate: 0, peakHours: []
  });
  
  // Form state
  const [formData, setFormData] = useState({
    patient_id: '',
    doctor_id: '',
    appointment_date: new Date().toISOString().split('T')[0],
    start_time: '09:00',
    status: 'pending',
    notes: '',
    treatment_ids: []
  });

  // Global settings
  const [globalSettings, setGlobalSettings] = useState({
    clinic_start: '09:00',
    clinic_end: '17:00',
    break_start: '12:00',
    break_end: '13:00',
    buffer_minutes: 10,
    reminder_hours: [48, 24, 1]
  });

  // ========== FETCH DATA ==========
  const fetchData = async () => {
    setLoading(true);
    try {
      const [appointmentsData, patientsData, doctorsData, treatmentsData] = await Promise.all([
        dentalAPI.appointments.getAll(),
        dentalAPI.patients.getAll(),
        dentalAPI.doctors.getAll(),
        dentalAPI.treatments.getAll()
      ]);
      
      const doctorUsersData = await Promise.all(
        (doctorsData || []).map(async (doc) => {
          const user = await dentalAPI.users.getById(doc.user_id);
          return { ...doc, user };
        })
      );
      
      const enriched = await Promise.all((appointmentsData || []).map(async (apt) => {
        const patient = patientsData?.find(p => p.id === apt.patient_id);
        const doctor = doctorsData?.find(d => d.id === apt.doctor_id);
        const doctorUser = doctorUsersData.find(d => d.id === apt.doctor_id)?.user;
        const aptTreatments = await dentalAPI.appointmentTreatments.getByAppointmentId(apt.id);
        const treatmentNames = await Promise.all(aptTreatments.map(async (at) => {
          const treatment = treatmentsData?.find(t => t.id === at.treatment_id);
          return treatment?.name;
        }));
        const invoice = await dentalAPI.invoices.getByAppointmentId(apt.id);
        
        return {
          ...apt,
          patient_name: patient?.full_name || 'Unknown',
          patient_phone: patient?.phone,
          patient_rm: patient?.rm_number,
          doctor_name: doctorUser?.full_name?.replace('drg. ', '') || 'Unknown',
          treatment_names: treatmentNames.filter(Boolean),
          total_amount: invoice?.total_amount || 0,
          payment_status: invoice?.status || 'unpaid'
        };
      }));
      
      setAppointments(enriched);
      setPatients(patientsData || []);
      setDoctors(doctorsData || []);
      setDoctorUsers(doctorUsersData);
      setTreatments(treatmentsData || []);
      
      calculateStats(enriched);
      generateCalendarDays(currentMonth);
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const todayApps = data.filter(a => a.appointment_date === selectedDate);
    const total = data.length;
    const noShows = data.filter(a => a.status === 'no_show').length;
    const pendingToConfirmed = data.filter(a => a.status === 'confirmed' || a.status === 'completed').length;
    const totalConfirmed = data.filter(a => a.status !== 'pending' && !a.status.includes('cancelled')).length;
    
    const hourCount = {};
    data.forEach(apt => {
      const hour = apt.start_time?.substring(0,2);
      if (hour) hourCount[hour] = (hourCount[hour] || 0) + 1;
    });
    
    setStats({
      total: todayApps.length,
      completed: todayApps.filter(a => a.status === 'completed').length,
      pending: todayApps.filter(a => a.status === 'pending').length,
      cancelled: todayApps.filter(a => a.status.includes('cancelled')).length,
      noShow: todayApps.filter(a => a.status === 'no_show').length,
      revenue: todayApps.filter(a => a.status === 'completed').reduce((sum, a) => sum + (a.total_amount || 0), 0),
      noShowRate: total > 0 ? ((noShows / total) * 100).toFixed(1) : 0,
      conversionRate: totalConfirmed > 0 ? ((pendingToConfirmed / totalConfirmed) * 100).toFixed(1) : 0,
      peakHours: Object.entries(hourCount).sort((a,b) => b[1] - a[1]).slice(0, 3)
    });
  };

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  // ========== CALENDAR FUNCTIONS ==========
  const generateCalendarDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const daysArray = [];
    
    for (let i = 0; i < startDay; i++) {
      daysArray.push(null);
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const dayApps = appointments.filter(a => a.appointment_date === dateStr);
      daysArray.push({
        date: i,
        dateStr,
        isToday: dateStr === new Date().toISOString().split('T')[0],
        hasAppointment: dayApps.length > 0,
        appointmentCount: dayApps.length,
        completedCount: dayApps.filter(a => a.status === 'completed').length
      });
    }
    
    setCalendarDays(daysArray);
  };

  const changeMonth = (delta) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + delta);
    setCurrentMonth(newDate);
    generateCalendarDays(newDate);
  };

  // ========== SLOT MANAGEMENT ==========
  const fetchAvailableSlots = async (doctorId, date) => {
    try {
      const result = await dentalAPI.appointments.getAvailableSlots(doctorId, date);
      if (result && result.schedule) {
        const slots = generateTimeSlots(result.schedule, result.existingAppointments);
        setAvailableSlots(slots);
        setShowSlotModal(true);
      } else {
        alert('Dokter tidak praktik pada hari ini');
      }
    } catch (error) {
      console.error('Error fetching slots:', error);
    }
  };

  const generateTimeSlots = (schedule, existingApps) => {
    const slots = [];
    let current = schedule.start_time;
    const end = schedule.end_time;
    const breakStart = schedule.break_start;
    const breakEnd = schedule.break_end;
    const buffer = globalSettings.buffer_minutes;
    
    while (current < end) {
      if (current >= breakStart && current < breakEnd) {
        current = breakEnd;
        continue;
      }
      
      const isBooked = existingApps.some(apt => apt.start_time === current);
      slots.push({
        time: current,
        available: !isBooked,
        bookedBy: isBooked ? existingApps.find(apt => apt.start_time === current)?.patient_name : null
      });
      
      const [hours, minutes] = current.split(':');
      const next = new Date();
      next.setHours(parseInt(hours), parseInt(minutes) + 30 + buffer);
      current = `${String(next.getHours()).padStart(2, '0')}:${String(next.getMinutes()).padStart(2, '0')}`;
    }
    return slots;
  };

  // ========== APPOINTMENT CRUD ==========
  const calculateEndTime = (startTime, treatmentIds) => {
    let totalDuration = 0;
    for (const tid of treatmentIds) {
      const treatment = treatments.find(t => t.id === parseInt(tid));
      if (treatment) totalDuration += treatment.duration_minutes || 30;
    }
    const [hours, minutes] = startTime.split(':');
    const endDate = new Date();
    endDate.setHours(parseInt(hours), parseInt(minutes) + totalDuration);
    return `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}:00`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endTime = calculateEndTime(formData.start_time, formData.treatment_ids);
      
      const appointmentData = {
        patient_id: parseInt(formData.patient_id),
        doctor_id: parseInt(formData.doctor_id),
        appointment_date: formData.appointment_date,
        start_time: formData.start_time + ':00',
        end_time: endTime,
        status: formData.status,
        notes: formData.notes,
        created_by: 1
      };
      
      let newAppointment;
      if (editingAppointment) {
        await dentalAPI.appointments.update(editingAppointment.id, appointmentData);
        newAppointment = editingAppointment;
      } else {
        const created = await dentalAPI.appointments.create(appointmentData);
        newAppointment = created[0];
        
        for (const tid of formData.treatment_ids) {
          const treatment = treatments.find(t => t.id === parseInt(tid));
          await dentalAPI.appointmentTreatments.create({
            appointment_id: newAppointment.id,
            treatment_id: parseInt(tid),
            price_at_time: treatment?.price || 0
          });
        }
        
        const totalPrice = formData.treatment_ids.reduce((sum, tid) => {
          const treatment = treatments.find(t => t.id === parseInt(tid));
          return sum + (treatment?.price || 0);
        }, 0);
        
        await dentalAPI.invoices.create({
          appointment_id: newAppointment.id,
          invoice_number: `INV-${new Date().toISOString().split('T')[0]}-${newAppointment.id}`,
          total_amount: totalPrice,
          discount_amount: 0,
          paid_amount: 0,
          status: 'unpaid'
        });
        
        await dentalAPI.activityLogs.log(1, 'CREATE', 'appointments', newAppointment.id, null, appointmentData);
        
        // Send reminder automatically
        await sendReminderAuto(newAppointment.id);
      }
      
      await fetchData();
      setShowModal(false);
      resetForm();
      alert(editingAppointment ? 'Janji temu berhasil diupdate!' : 'Janji temu berhasil dibuat!');
    } catch (error) {
      console.error('Error saving appointment:', error);
      alert('Gagal menyimpan janji temu: ' + error.message);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await dentalAPI.appointments.updateStatus(id, newStatus);
      await dentalAPI.activityLogs.log(1, 'UPDATE', 'appointments', id, null, { status: newStatus });
      
      if (newStatus === 'completed') {
        const appointment = appointments.find(a => a.id === id);
        const invoice = await dentalAPI.invoices.getByAppointmentId(id);
        if (invoice && invoice.total_amount) {
          const points = Math.floor(invoice.total_amount / 1000);
          await dentalAPI.loyaltyPoints.addPoints(appointment.patient_id, points, 'Perawatan', id);
        }
      }
      
      await fetchData();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const cancelAppointment = async (id, reason) => {
    const reasonText = prompt('Alasan pembatalan:', reason || 'Dibatalkan oleh admin');
    if (reasonText !== null) {
      try {
        await dentalAPI.appointments.cancel(id, reasonText);
        await fetchData();
        alert('Janji temu berhasil dibatalkan');
      } catch (error) {
        console.error('Error cancelling appointment:', error);
      }
    }
  };

  const deleteAppointment = async (id) => {
    if (window.confirm('Yakin ingin menghapus janji temu ini secara permanen?')) {
      try {
        await dentalAPI.appointmentTreatments.deleteByAppointmentId(id);
        const invoice = await dentalAPI.invoices.getByAppointmentId(id);
        if (invoice) await dentalAPI.invoices.delete(invoice.id);
        await dentalAPI.appointments.delete(id);
        await fetchData();
        alert('Janji temu berhasil dihapus');
      } catch (error) {
        console.error('Error deleting appointment:', error);
      }
    }
  };

  // ========== REMINDER FUNCTIONS ==========
  const sendReminderAuto = async (appointmentId) => {
    const appointment = appointments.find(a => a.id === appointmentId);
    if (!appointment || !appointment.patient_phone) return;
    
    const message = `*Pengingat Jadwal Perawatan Gigi*\n\nHalo ${appointment.patient_name},\n\nAnda memiliki jadwal perawatan pada:\n📅 Tanggal: ${appointment.appointment_date}\n⏰ Jam: ${appointment.start_time?.substring(0,5)}\n👨‍⚕️ Dokter: drg. ${appointment.doctor_name}\n🦷 Tindakan: ${appointment.treatment_names?.join(', ')}\n\nHarap datang tepat waktu. Konfirmasi kehadiran Anda dengan membalas pesan ini.\n\nTerima kasih.\n\n*Klinik Gigi Dental Plus*`;
    
    await dentalAPI.communicationLogs.logOutgoing(appointment.patient_id, 'wa', message, 1);
  };

  const sendManualReminder = async () => {
    if (!selectedAppointment) return;
    setSendingReminder(true);
    try {
      await sendReminderAuto(selectedAppointment.id);
      alert('Pengingat berhasil dikirim!');
      setShowReminderModal(false);
    } catch (error) {
      console.error('Error sending reminder:', error);
      alert('Gagal mengirim pengingat');
    } finally {
      setSendingReminder(false);
    }
  };

  const rescheduleAppointment = async (id) => {
    const newDate = prompt('Masukkan tanggal baru (YYYY-MM-DD):');
    const newTime = prompt('Masukkan jam baru (HH:MM):');
    if (newDate && newTime) {
      try {
        const endTime = calculateEndTime(newTime, []);
        await dentalAPI.appointments.update(id, {
          appointment_date: newDate,
          start_time: newTime + ':00',
          end_time: endTime
        });
        await fetchData();
        alert('Jadwal berhasil diubah');
      } catch (error) {
        console.error('Error rescheduling:', error);
      }
    }
  };

  const resetForm = () => {
    setEditingAppointment(null);
    setFormData({
      patient_id: '',
      doctor_id: '',
      appointment_date: new Date().toISOString().split('T')[0],
      start_time: '09:00',
      status: 'pending',
      notes: '',
      treatment_ids: []
    });
  };

  // ========== UI HELPERS ==========
  const getStatusBadge = (status) => {
    const config = {
      completed: { text: 'Selesai', color: 'bg-green-100 text-green-700', icon: CheckCircle },
      in_treatment: { text: 'Berlangsung', color: 'bg-yellow-100 text-yellow-700', icon: Activity },
      arrived: { text: 'Menunggu', color: 'bg-blue-100 text-blue-700', icon: User },
      confirmed: { text: 'Terkonfirmasi', color: 'bg-purple-100 text-purple-700', icon: Check },
      pending: { text: 'Pending', color: 'bg-orange-100 text-orange-700', icon: Clock },
      no_show: { text: 'Tidak Datang', color: 'bg-red-100 text-red-700', icon: XCircle },
      cancelled_by_patient: { text: 'Dibatalkan Pasien', color: 'bg-gray-100 text-gray-700', icon: Ban },
      cancelled_by_clinic: { text: 'Dibatalkan Klinik', color: 'bg-gray-100 text-gray-700', icon: Ban }
    };
    const c = config[status] || config.pending;
    const Icon = c.icon;
    return <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${c.color}`}><Icon size={12} />{c.text}</span>;
  };

  const getPaymentBadge = (status) => {
    const config = {
      paid: { text: 'Lunas', color: 'bg-green-100 text-green-700' },
      partial: { text: 'Cicilan', color: 'bg-yellow-100 text-yellow-700' },
      unpaid: { text: 'Belum Bayar', color: 'bg-red-100 text-red-700' }
    };
    const c = config[status] || config.unpaid;
    return <span className={`px-2 py-0.5 text-xs rounded-full ${c.color}`}>{c.text}</span>;
  };

  const exportToCSV = () => {
    const headers = ['Tanggal', 'Jam', 'Pasien', 'RM', 'Dokter', 'Tindakan', 'Status', 'Total'];
    const rows = appointments.filter(a => a.appointment_date === selectedDate).map(a => [
      a.appointment_date, a.start_time?.substring(0,5), a.patient_name, a.patient_rm,
      a.doctor_name, a.treatment_names?.join(', '), a.status, a.total_amount
    ]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `appointments_${selectedDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate.toISOString().split('T')[0]);
  };

  // Filtered appointments for current view
  const filteredAppointments = appointments.filter(apt => {
    const matchDate = apt.appointment_date === selectedDate;
    const matchStatus = statusFilter === 'all' || apt.status === statusFilter;
    const matchDoctor = selectedDoctor === 'all' || apt.doctor_id === parseInt(selectedDoctor);
    const matchSearch = apt.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        apt.doctor_name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchDate && matchStatus && matchDoctor && matchSearch;
  });

  const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <PageHeader 
        title="Manajemen Janji Temu" 
        subtitle="Kelola jadwal perawatan pasien dengan mudah"
        onRefresh={fetchData}
        onDownload={exportToCSV}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
        <div className="bg-white rounded-xl p-3 text-center shadow-sm"><p className="text-2xl font-bold text-primary">{stats.total}</p><p className="text-xs text-gray-500">Total</p></div>
        <div className="bg-white rounded-xl p-3 text-center shadow-sm"><p className="text-2xl font-bold text-green-600">{stats.completed}</p><p className="text-xs text-gray-500">Selesa</p></div>
        <div className="bg-white rounded-xl p-3 text-center shadow-sm"><p className="text-2xl font-bold text-orange-600">{stats.pending}</p><p className="text-xs text-gray-500">Pending</p></div>
        <div className="bg-white rounded-xl p-3 text-center shadow-sm"><p className="text-2xl font-bold text-red-600">{stats.cancelled}</p><p className="text-xs text-gray-500">Batal</p></div>
        <div className="bg-white rounded-xl p-3 text-center shadow-sm"><p className="text-2xl font-bold text-purple-600">{stats.noShow}</p><p className="text-xs text-gray-500">No-Show</p></div>
        <div className="bg-white rounded-xl p-3 text-center shadow-sm"><p className="text-xl font-bold text-primary">Rp{(stats.revenue/1000).toFixed(0)}K</p><p className="text-xs text-gray-500">Revenue</p></div>
        <div className="bg-white rounded-xl p-3 text-center shadow-sm"><p className="text-lg font-bold text-blue-600">{stats.noShowRate}%</p><p className="text-xs text-gray-500">No-Show Rate</p></div>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <button onClick={() => changeDate(-1)} className="p-2 bg-white border rounded-lg hover:bg-gray-50"><ChevronLeft size={18} /></button>
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border"><Calendar size={16} className="text-primary" /><input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="border-none focus:outline-none text-sm" /></div>
          <button onClick={() => changeDate(1)} className="p-2 bg-white border rounded-lg hover:bg-gray-50"><ChevronRight size={18} /></button>
          <button onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])} className="px-3 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200">Hari Ini</button>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} /><input type="text" placeholder="Cari..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9 pr-3 py-2 border rounded-lg text-sm w-40" /></div>
          <select value={selectedDoctor} onChange={e => setSelectedDoctor(e.target.value)} className="px-3 py-2 border rounded-lg text-sm"><option value="all">Semua Dokter</option>{doctorUsers.map(d => <option key={d.id} value={d.id}>drg. {d.user?.full_name}</option>)}</select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 border rounded-lg text-sm"><option value="all">Semua Status</option><option value="pending">Pending</option><option value="confirmed">Terkonfirmasi</option><option value="arrived">Menunggu</option><option value="in_treatment">Berlangsung</option><option value="completed">Selesai</option></select>
          <div className="flex bg-white border rounded-lg overflow-hidden"><button onClick={() => setViewMode('day')} className={`p-2 ${viewMode === 'day' ? 'bg-primary text-white' : 'text-gray-500'}`}><Sun size={16} /></button><button onClick={() => setViewMode('week')} className={`p-2 ${viewMode === 'week' ? 'bg-primary text-white' : 'text-gray-500'}`}><CalendarDays size={16} /></button><button onClick={() => setViewMode('month')} className={`p-2 ${viewMode === 'month' ? 'bg-primary text-white' : 'text-gray-500'}`}><Grid3X3 size={16} /></button></div>
          <button onClick={() => { resetForm(); setShowModal(true); }} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"><Plus size={16} />Buat Janji</button>
        </div>
      </div>

      {/* Day View */}
      {viewMode === 'day' && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr><th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Jam</th><th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Pasien</th><th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Dokter</th><th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Tindakan</th><th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Status</th><th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Pembayaran</th><th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">Aksi</th></tr>
              </thead>
              <tbody className="divide-y">
                {loading ? (
                  <tr><td colSpan="7" className="px-4 py-8 text-center"><Loader2 className="animate-spin mx-auto" /> Memuat...</td></tr>
                ) : filteredAppointments.length === 0 ? (
                  <tr><td colSpan="7" className="px-4 py-8 text-center text-gray-500"><Calendar size={32} className="mx-auto mb-2 text-gray-300" />Tidak ada janji temu</td></tr>
                ) : (
                  filteredAppointments.map(apt => (
                    <tr key={apt.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-sm">{apt.start_time?.substring(0,5)}</td>
                      <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">{apt.patient_name?.charAt(0)}</div><span className="font-medium">{apt.patient_name}</span><span className="text-xs text-gray-400">{apt.patient_rm}</span></div></td>
                      <td className="px-4 py-3 text-sm">{apt.doctor_name}</td>
                      <td className="px-4 py-3 text-sm">{apt.treatment_names?.join(', ') || '-'}</td>
                      <td className="px-4 py-3">{getStatusBadge(apt.status)}</td>
                      <td className="px-4 py-3">{getPaymentBadge(apt.payment_status)}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {apt.status === 'pending' && <button onClick={() => updateStatus(apt.id, 'confirmed')} className="p-1.5 text-green-600 hover:bg-green-50 rounded" title="Konfirmasi"><Check size={14} /></button>}
                          {apt.status === 'confirmed' && <button onClick={() => updateStatus(apt.id, 'arrived')} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Pasien Datang"><User size={14} /></button>}
                          {apt.status === 'arrived' && <button onClick={() => updateStatus(apt.id, 'in_treatment')} className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded" title="Mulai"><Stethoscope size={14} /></button>}
                          {apt.status === 'in_treatment' && <button onClick={() => updateStatus(apt.id, 'completed')} className="p-1.5 text-green-600 hover:bg-green-50 rounded" title="Selesai"><CheckCircle size={14} /></button>}
                          <button onClick={() => { setSelectedAppointment(apt); setReminderMessage(''); setShowReminderModal(true); }} className="p-1.5 text-primary hover:bg-primary/10 rounded" title="Kirim Pengingat"><Bell size={14} /></button>
                          <button onClick={() => rescheduleAppointment(apt.id)} className="p-1.5 text-purple-600 hover:bg-purple-50 rounded" title="Reschedule"><Calendar size={14} /></button>
                          <button onClick={() => cancelAppointment(apt.id)} className="p-1.5 text-orange-600 hover:bg-orange-50 rounded" title="Batalkan"><XCircle size={14} /></button>
                          <button onClick={() => deleteAppointment(apt.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Hapus"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Week View */}
      {viewMode === 'week' && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden overflow-x-auto">
          <table className="min-w-[800px] w-full">
            <thead className="bg-gray-50">
              <tr>{[...Array(7)].map((_, i) => { const d = new Date(selectedDate); d.setDate(d.getDate() - d.getDay() + i); return <th key={i} className="px-2 py-2 text-center text-sm font-semibold border-r">{d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' })}</th>; })}</tr>
            </thead>
            <tbody>
              {timeSlots.map(hour => (
                <tr key={hour} className="border-b">
                  {[...Array(7)].map((_, i) => {
                    const d = new Date(selectedDate);
                    d.setDate(d.getDate() - d.getDay() + i);
                    const dateStr = d.toISOString().split('T')[0];
                    const apt = appointments.find(a => a.appointment_date === dateStr && a.start_time?.startsWith(hour));
                    return <td key={i} className="px-1 py-1 text-center border-r h-16">{apt ? <div className="bg-primary/10 rounded p-1 mx-1"><p className="font-medium text-xs truncate">{apt.patient_name}</p><p className="text-[10px] text-gray-500 truncate">{apt.doctor_name}</p></div> : <span className="text-gray-300 text-xs">-</span>}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Month View */}
      {viewMode === 'month' && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <button onClick={() => changeMonth(-1)} className="p-1"><ChevronLeft size={20} /></button>
            <h2 className="font-bold">{currentMonth.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</h2>
            <button onClick={() => changeMonth(1)} className="p-1"><ChevronRight size={20} /></button>
          </div>
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map(day => <div key={day} className="bg-gray-50 p-2 text-center text-xs font-semibold">{day}</div>)}
            {calendarDays.map((day, idx) => (
              <div key={idx} className={`bg-white p-2 min-h-[80px] ${day?.isToday ? 'bg-primary/5' : ''}`}>
                {day ? (
                  <>
                    <span className={`text-xs ${day.isToday ? 'bg-primary text-white w-5 h-5 rounded-full inline-flex items-center justify-center' : 'text-gray-500'}`}>{day.date}</span>
                    {day.hasAppointment && <div className="mt-1"><span className="text-[10px] bg-primary/10 text-primary px-1 rounded">{day.appointmentCount} janji</span></div>}
                    {day.completedCount > 0 && <div className="text-[10px] text-green-600">✓{day.completedCount} selesai</div>}
                  </>
                ) : <span className="text-gray-300 text-xs">-</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create/Edit Appointment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between"><h2 className="font-bold text-lg">{editingAppointment ? 'Edit Janji Temu' : 'Buat Janji Temu Baru'}</h2><button onClick={() => setShowModal(false)}><X size={20} /></button></div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Pasien *</label><select value={formData.patient_id} onChange={e => setFormData({...formData, patient_id: e.target.value})} required className="w-full p-2 border rounded-lg"><option value="">Pilih Pasien</option>{patients.map(p => <option key={p.id} value={p.id}>{p.full_name} ({p.rm_number})</option>)}</select></div>
                <div><label className="block text-sm font-medium mb-1">Dokter *</label><select value={formData.doctor_id} onChange={e => setFormData({...formData, doctor_id: e.target.value})} required className="w-full p-2 border rounded-lg"><option value="">Pilih Dokter</option>{doctorUsers.map(d => <option key={d.id} value={d.id}>drg. {d.user?.full_name} - {d.specialization || 'Dokter Umum'}</option>)}</select></div>
                <div><label className="block text-sm font-medium mb-1">Tanggal *</label><input type="date" value={formData.appointment_date} onChange={e => setFormData({...formData, appointment_date: e.target.value})} required className="w-full p-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-1">Jam Mulai *</label><input type="time" value={formData.start_time} onChange={e => setFormData({...formData, start_time: e.target.value})} required className="w-full p-2 border rounded-lg" /></div>
                <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Tindakan</label><select multiple value={formData.treatment_ids} onChange={e => setFormData({...formData, treatment_ids: Array.from(e.target.selectedOptions, o => o.value)})} className="w-full p-2 border rounded-lg h-24"><option value="">Pilih Tindakan</option>{treatments.filter(t => t.is_active).map(t => <option key={t.id} value={t.id}>{t.name} - Rp{t.price?.toLocaleString()} ({t.duration_minutes} menit)</option>)}</select><p className="text-xs text-gray-400 mt-1">Hold Ctrl/Cmd untuk pilih lebih dari satu</p></div>
                <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Catatan</label><textarea rows="2" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full p-2 border rounded-lg" placeholder="Catatan khusus untuk dokter..." /></div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t"><button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Batal</button><button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">Simpan</button></div>
            </form>
          </div>
        </div>
      )}

      {/* Send Reminder Modal */}
      {showReminderModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6"><h3 className="font-bold text-lg mb-2">Kirim Pengingat</h3><p className="text-sm text-gray-600 mb-4">Kirim pesan pengingat ke {selectedAppointment.patient_name} via WhatsApp</p><div className="bg-gray-100 p-3 rounded-lg mb-4"><p className="text-sm whitespace-pre-wrap">*Pengingat Jadwal Perawatan Gigi*</p><p className="text-sm mt-1">Halo {selectedAppointment.patient_name}, Anda memiliki jadwal perawatan pada {selectedAppointment.appointment_date} jam {selectedAppointment.start_time?.substring(0,5)}.</p></div><div className="flex justify-end gap-3"><button onClick={() => setShowReminderModal(false)} className="px-4 py-2 border rounded-lg">Batal</button><button onClick={sendManualReminder} disabled={sendingReminder} className="px-4 py-2 bg-primary text-white rounded-lg flex items-center gap-2">{sendingReminder ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />} Kirim</button></div></div>
        </div>
      )}

      {/* Available Slots Modal */}
      {showSlotModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6"><h3 className="font-bold text-lg mb-2">Slot Waktu Tersedia</h3><div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">{availableSlots.map(slot => <button key={slot.time} disabled={!slot.available} className={`p-2 rounded-lg text-center ${slot.available ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>{slot.time}{!slot.available && <span className="block text-[10px]">(dipesan)</span>}</button>)}</div><button onClick={() => setShowSlotModal(false)} className="mt-4 w-full py-2 border rounded-lg">Tutup</button></div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
