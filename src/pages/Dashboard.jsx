// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  Users, DollarSign, Activity, Calendar as CalendarIcon, 
  CheckCircle, Clock, TrendingUp, Star, Package, Gift, History,
  UserPlus, CalendarPlus, Stethoscope, Wallet, MessageCircle
} from 'lucide-react';

// Import komponen
import StatsCard from '../components/StatsCard';
import TodayAppointments from '../components/TodayAppointments';
import QuickActions from '../components/QuickActions';
import RecentPatients from '../components/RecentPatients';
import LowStockAlert from '../components/LowStockAlert';
import PendingReviews from '../components/PendingReviews';
import UpcomingBirthdays from '../components/UpcomingBirthdays';
import RevenueChart from '../components/RevenueChart';
import TopTreatments from '../components/TopTreatments';
import DoctorPerformance from '../components/DoctorPerformance';
import ActivePromotions from '../components/ActivePromotions';
import LoyaltySummary from '../components/LoyaltySummary';
import RecentActivityLog from '../components/RecentActivityLog';
import PageHeader from '../components/PageHeader';

// Import API
import dentalAPI from '../services/dentalAPI';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    stats: {},
    todayAppointments: [],
    recentPatients: [],
    lowStockItems: [],
    pendingReviews: [],
    upcomingBirthdays: [],
    revenueData: [],
    topTreatments: [],
    doctorPerformance: [],
    activePromotions: [],
    loyaltyData: {},
    recentLogs: []
  });

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Get all data parallel
      const [
        allUsers,
        allPatients,
        allDoctors,
        allAppointments,
        allTreatments,
        allInventory,
        allSurveys,
        allInvoices,
        allPromotions,
        allLoyaltyPoints,
        allActivityLogs
      ] = await Promise.all([
        dentalAPI.users.getAll(),
        dentalAPI.patients.getAll(),
        dentalAPI.doctors.getAll(),
        dentalAPI.appointments.getAll(),
        dentalAPI.treatments.getAll(),
        dentalAPI.inventory.getAll(),
        dentalAPI.surveys.getAll(),
        dentalAPI.invoices.getAll(),
        dentalAPI.promotions.getActive(),
        dentalAPI.loyaltyPoints.getAll(),
        dentalAPI.activityLogs.getAll()
      ]);

      console.log('✅ Data loaded:', { allUsers, allPatients, allAppointments });

      // Get today's appointments
      const todayAppointments = (allAppointments || []).filter(apt => apt.appointment_date === today);
      
      // Get completed today
      const completedToday = todayAppointments.filter(a => a.status === 'completed').length;
      
      // Calculate revenue today
      let revenueToday = 0;
      for (const apt of todayAppointments) {
        const invoice = await dentalAPI.invoices.getByAppointmentId(apt.id);
        if (invoice && invoice.status === 'paid') {
          revenueToday += invoice.total_amount || 0;
        }
      }

      // Average rating
      const avgRating = allSurveys.length > 0
        ? (allSurveys.reduce((sum, s) => sum + (s.rating_comfort || 0), 0) / allSurveys.length).toFixed(1)
        : 4.8;

      // Stats
      const stats = {
        patientsToday: todayAppointments.length,
        appointmentsCompleted: completedToday,
        revenueToday: revenueToday,
        averageRating: parseFloat(avgRating),
        patientsTodayChange: '+12%',
        appointmentsChange: '+8%',
        revenueChange: '+23%',
        ratingChange: '+5%'
      };

      // Get recent patients (last 5)
      const recentPatients = [...(allPatients || [])]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);

      // Get low stock items
      const lowStockItems = (allInventory || []).filter(item => item.stock <= (item.min_stock || 0));

      // Get pending reviews (rating <= 3)
      const pendingReviewsData = await Promise.all(
        (allSurveys || [])
          .filter(s => s.rating_comfort <= 3 && s.follow_up_status === 'pending')
          .slice(0, 5)
          .map(async (survey) => {
            const appointment = allAppointments.find(a => a.id === survey.appointment_id);
            const patient = appointment ? allPatients.find(p => p.id === appointment.patient_id) : null;
            const doctor = appointment ? allDoctors.find(d => d.id === appointment.doctor_id) : null;
            const doctorUser = doctor ? allUsers.find(u => u.id === doctor.user_id) : null;
            
            return {
              id: survey.id,
              patient_name: patient?.full_name || 'Unknown',
              doctor_name: doctorUser?.full_name?.replace('drg. ', '') || 'Unknown',
              rating_comfort: survey.rating_comfort,
              comments: survey.comments || '-',
              follow_up_status: survey.follow_up_status
            };
          })
      );

      // Upcoming birthdays (this month)
      const currentMonth = new Date().getMonth();
      const upcomingBirthdays = (allPatients || [])
        .filter(p => {
          if (!p.birth_date) return false;
          const birthMonth = new Date(p.birth_date).getMonth();
          return birthMonth === currentMonth;
        })
        .slice(0, 5);

      // Revenue chart data (last 7 days)
      const revenueData = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const aptsOnDate = (allAppointments || []).filter(a => a.appointment_date === dateStr);
        let dailyRevenue = 0;
        for (const apt of aptsOnDate) {
          const invoice = await dentalAPI.invoices.getByAppointmentId(apt.id);
          if (invoice && invoice.status === 'paid') {
            dailyRevenue += invoice.total_amount || 0;
          }
        }
        revenueData.push({
          label: date.toLocaleDateString('id-ID', { weekday: 'short' }),
          revenue: dailyRevenue
        });
      }

      // Top treatments
      const treatmentCount = {};
      for (const apt of allAppointments || []) {
        const aptTreatments = await dentalAPI.appointmentTreatments.getByAppointmentId(apt.id);
        for (const at of aptTreatments) {
          const treatment = allTreatments.find(t => t.id === at.treatment_id);
          if (treatment) {
            treatmentCount[treatment.name] = (treatmentCount[treatment.name] || 0) + 1;
          }
        }
      }
      const topTreatments = Object.entries(treatmentCount)
        .map(([name, count]) => ({ name, count, id: name }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Doctor performance
      const doctorPerformanceData = await Promise.all(
        (allDoctors || []).slice(0, 5).map(async (doctor) => {
          const doctorUser = allUsers.find(u => u.id === doctor.user_id);
          const doctorAppointments = (allAppointments || []).filter(a => a.doctor_id === doctor.id);
          const doctorSurveys = await Promise.all(
            doctorAppointments.map(async (apt) => {
              const survey = allSurveys.find(s => s.appointment_id === apt.id);
              return survey;
            })
          );
          const validSurveys = doctorSurveys.filter(s => s && s.rating_comfort);
          const avgRating = validSurveys.length > 0
            ? (validSurveys.reduce((sum, s) => sum + s.rating_comfort, 0) / validSurveys.length).toFixed(1)
            : 4.5;
          
          return {
            id: doctor.id,
            name: doctorUser?.full_name?.replace('drg. ', '') || 'Unknown',
            specialization: doctor.specialization || 'Dokter Gigi',
            rating: parseFloat(avgRating),
            patient_count: doctorAppointments.length
          };
        })
      );

      // Loyalty data
      const pointsByPatient = {};
      for (const point of allLoyaltyPoints || []) {
        pointsByPatient[point.patient_id] = (pointsByPatient[point.patient_id] || 0) + point.points;
      }
      const topLoyaltyPatients = Object.entries(pointsByPatient)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([patientId, points]) => {
          const patient = allPatients.find(p => p.id === parseInt(patientId));
          return {
            id: parseInt(patientId),
            full_name: patient?.full_name || 'Unknown',
            phone: patient?.phone || '-',
            points: points
          };
        });

      const loyaltyData = {
        topPatients: topLoyaltyPatients,
        totalPointsIssued: allLoyaltyPoints.reduce((sum, p) => sum + p.points, 0),
        totalRewardsRedeemed: 0,
        activeMembers: Object.keys(pointsByPatient).length
      };

      // Recent activity logs
      const recentLogs = (allActivityLogs || []).slice(0, 10).map(log => {
        const user = allUsers.find(u => u.id === log.user_id);
        return {
          ...log,
          user_name: user?.full_name || 'System'
        };
      });

      setDashboardData({
        stats,
        todayAppointments,
        recentPatients,
        lowStockItems,
        pendingReviews: pendingReviewsData,
        upcomingBirthdays,
        revenueData,
        topTreatments,
        doctorPerformance: doctorPerformanceData,
        activePromotions: allPromotions || [],
        loyaltyData,
        recentLogs
      });

    } catch (err) {
      console.error('❌ Error fetching dashboard data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Action handlers
  const handleQuickAction = (actionId) => {
    console.log('Quick action:', actionId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Memuat data dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center bg-red-50 p-6 rounded-xl max-w-md">
          <div className="text-red-600 text-xl mb-2">⚠️ Error</div>
          <p className="text-gray-700">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  const { stats, todayAppointments, recentPatients, lowStockItems, pendingReviews, upcomingBirthdays, revenueData, topTreatments, doctorPerformance, activePromotions, loyaltyData, recentLogs } = dashboardData;

  return (
    <div className="font-sans p-6 bg-gray-50 min-h-screen">
      <PageHeader 
        title="Dashboard" 
        subtitle="Selamat datang kembali, Dokter! Berikut ringkasan aktivitas klinik hari ini."
        onRefresh={fetchDashboardData}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard title="Pasien Hari Ini" value={stats.patientsToday} change={stats.patientsTodayChange} icon={Users} color="from-primary to-primary" />
        <StatsCard title="Janji Temu Selesai" value={stats.appointmentsCompleted} change={stats.appointmentsChange} icon={CheckCircle} color="from-secondary to-secondary" />
        <StatsCard title="Pendapatan Hari Ini" value={stats.revenueToday.toLocaleString()} change={stats.revenueChange} icon={DollarSign} color="from-third to-third" prefix="Rp " />
        <StatsCard title="Rating Kepuasan" value={stats.averageRating} change={stats.ratingChange} icon={Star} color="from-fourth to-fourth" suffix="/5" />
      </div>

      {/* Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <TodayAppointments appointments={todayAppointments} />
        <QuickActions onAction={handleQuickAction} />
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <RevenueChart data={revenueData} />
        <TopTreatments treatments={topTreatments} />
        <DoctorPerformance doctors={doctorPerformance} />
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <RecentPatients patients={recentPatients} />
        <LowStockAlert items={lowStockItems} />
        <PendingReviews reviews={pendingReviews} />
      </div>

      {/* Row 4 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <UpcomingBirthdays patients={upcomingBirthdays} />
        <ActivePromotions promotions={activePromotions} />
        <LoyaltySummary 
          topPatients={loyaltyData.topPatients}
          totalPointsIssued={loyaltyData.totalPointsIssued}
          totalRewardsRedeemed={loyaltyData.totalRewardsRedeemed}
          activeMembers={loyaltyData.activeMembers}
        />
      </div>

      {/* Row 5 */}
      <div className="grid grid-cols-1 gap-6">
        <RecentActivityLog logs={recentLogs} />
      </div>
    </div>
  );
};

export default Dashboard;