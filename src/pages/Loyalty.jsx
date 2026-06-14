import React, { useState, useEffect } from 'react';
import { 
  Award, Gift, Users, Star, TrendingUp, Crown, 
  Medal, Sparkles, Plus, Edit, Trash2, Search, X
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import dentalAPI from '../services/dentalAPI';

const Loyalty = () => {
  const [patients, setPatients] = useState([]);
  const [loyaltyPoints, setLoyaltyPoints] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [editingReward, setEditingReward] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [rewardForm, setRewardForm] = useState({
    name: '',
    points_required: '',
    stock: '',
    is_active: true
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [patientsData, pointsData, rewardsData, redemptionsData] = await Promise.all([
        dentalAPI.patients.getAll(),
        dentalAPI.loyaltyPoints.getAll(),
        dentalAPI.rewards.getAll(),
        dentalAPI.rewardRedemptions.getAll()
      ]);
      setPatients(patientsData || []);
      setLoyaltyPoints(pointsData || []);
      setRewards(rewardsData || []);
      setRedemptions(redemptionsData || []);
    } catch (error) {
      console.error('Error fetching loyalty data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate total points per patient
  const getPatientPoints = (patientId) => {
    const points = (loyaltyPoints || []).filter(p => p.patient_id === patientId);
    return points.reduce((sum, p) => sum + p.points, 0);
  };

  // Get patient details
  const getPatient = (id) => patients.find(p => p.id === id);

  // Leaderboard data
  const leaderboard = (patients || [])
    .map(patient => ({
      ...patient,
      total_points: getPatientPoints(patient.id)
    }))
    .filter(p => p.total_points > 0)
    .sort((a, b) => b.total_points - a.total_points)
    .slice(0, 10);

  // Get tier based on points
  const getTier = (points) => {
    if (points >= 1500) return { name: 'Platinum', color: 'bg-gradient-to-r from-gray-400 to-gray-300', icon: Crown };
    if (points >= 500) return { name: 'Gold', color: 'bg-gradient-to-r from-yellow-500 to-yellow-400', icon: Medal };
    if (points >= 100) return { name: 'Silver', color: 'bg-gradient-to-r from-gray-300 to-gray-200', icon: Star };
    return { name: 'Bronze', color: 'bg-gradient-to-r from-amber-600 to-amber-500', icon: Award };
  };

  const handleRewardSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingReward) {
        await dentalAPI.rewards.update(editingReward.id, rewardForm);
      } else {
        await dentalAPI.rewards.create(rewardForm);
      }
      await fetchData();
      setShowRewardModal(false);
      resetRewardForm();
    } catch (error) {
      console.error('Error saving reward:', error);
    }
  };

  const handleDeleteReward = async (id) => {
    if (window.confirm('Yakin ingin menghapus reward ini?')) {
      try {
        await dentalAPI.rewards.update(id, { is_active: false });
        await fetchData();
      } catch (error) {
        console.error('Error deleting reward:', error);
      }
    }
  };

  const resetRewardForm = () => {
    setEditingReward(null);
    setRewardForm({
      name: '',
      points_required: '',
      stock: '',
      is_active: true
    });
  };

  const filteredRewards = (rewards || []).filter(r =>
    r.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRewardRedemptionCount = (rewardId) => {
    return (redemptions || []).filter(r => r.reward_id === rewardId).length;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <PageHeader 
        title="Program Loyalitas & Reward" 
        subtitle="Kelola poin dan reward untuk pasien"
        onRefresh={fetchData}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-4 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm opacity-90">Total Poin Diberikan</p>
              <p className="text-2xl font-bold">{loyaltyPoints.reduce((sum, p) => sum + p.points, 0).toLocaleString()}</p>
            </div>
            <Award size={28} className="opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-4 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm opacity-90">Reward Ditukar</p>
              <p className="text-2xl font-bold">{redemptions.length}</p>
            </div>
            <Gift size={28} className="opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-xl p-4 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm opacity-90">Member Aktif</p>
              <p className="text-2xl font-bold">{Object.keys(loyaltyPoints.reduce((acc, p) => ({...acc, [p.patient_id]: true}), {})).length}</p>
            </div>
            <Users size={28} className="opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm opacity-90">Reward Tersedia</p>
              <p className="text-2xl font-bold">{rewards.filter(r => r.is_active && r.stock > 0).length}</p>
            </div>
            <Sparkles size={28} className="opacity-80" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`px-4 py-2 font-medium transition ${activeTab === 'leaderboard' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
        >
          <Crown size={16} className="inline mr-2" />
          Leaderboard
        </button>
        <button
          onClick={() => setActiveTab('rewards')}
          className={`px-4 py-2 font-medium transition ${activeTab === 'rewards' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
        >
          <Gift size={16} className="inline mr-2" />
          Kelola Reward
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 font-medium transition ${activeTab === 'history' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
        >
          <TrendingUp size={16} className="inline mr-2" />
          Riwayat Penukaran
        </button>
      </div>

      {activeTab === 'leaderboard' && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Top Member</h2>
            <p className="text-sm text-gray-500">Pasien dengan poin tertinggi</p>
          </div>
          <div className="divide-y divide-gray-100">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Memuat data...</div>
            ) : leaderboard.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Award size={40} className="mx-auto text-gray-300 mb-2" />
                Belum ada data poin loyalitas
              </div>
            ) : (
              leaderboard.map((patient, index) => {
                const tier = getTier(patient.total_points);
                const TierIcon = tier.icon;
                return (
                  <div key={patient.id} className="p-4 hover:bg-gray-50 transition">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full ${tier.color} flex items-center justify-center text-white font-bold`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{patient.full_name}</p>
                          <p className="text-xs text-gray-500">{patient.rm_number}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <TierIcon size={14} className="text-yellow-500" />
                          <span className="text-xs font-medium">{tier.name}</span>
                        </div>
                        <p className="text-xl font-bold text-primary">{patient.total_points.toLocaleString()}</p>
                        <p className="text-xs text-gray-400">poin</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {activeTab === 'rewards' && (
        <>
          <div className="flex justify-between items-center mb-4">
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Cari reward..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-1.5 border rounded-lg text-sm"
              />
            </div>
            <button
              onClick={() => {
                resetRewardForm();
                setShowRewardModal(true);
              }}
              className="bg-primary text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1"
            >
              <Plus size={14} /> Tambah Reward
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/2 mb-3"></div>
                  <div className="h-6 bg-gray-100 rounded w-1/3"></div>
                </div>
              ))
            ) : filteredRewards.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-white rounded-xl">
                <Gift size={48} className="mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500">Belum ada reward</p>
              </div>
            ) : (
              filteredRewards.map((reward) => (
                <div key={reward.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900">{reward.name}</h3>
                    <div className="flex gap-1">
                      <button onClick={() => {
                        setEditingReward(reward);
                        setRewardForm({
                          name: reward.name,
                          points_required: reward.points_required,
                          stock: reward.stock,
                          is_active: reward.is_active
                        });
                        setShowRewardModal(true);
                      }} className="p-1 text-yellow-600 hover:bg-yellow-50 rounded">
                        <Edit size={14} />
                      </button>
                      <button onClick={() => handleDeleteReward(reward.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl font-bold text-primary">{reward.points_required}</span>
                    <span className="text-sm text-gray-500">poin</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Stok: {reward.stock}</span>
                    <span className="text-gray-500">Ditukar: {getRewardRedemptionCount(reward.id)}x</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {activeTab === 'history' && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold">Riwayat Penukaran Reward</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr><th className="px-4 py-2 text-left text-xs">Tanggal</th><th className="px-4 py-2 text-left text-xs">Pasien</th><th className="px-4 py-2 text-left text-xs">Reward</th><th className="px-4 py-2 text-right text-xs">Poin</th></tr>
              </thead>
              <tbody className="divide-y">
                {redemptions.slice(0, 20).map(red => {
                  const patient = getPatient(red.patient_id);
                  const reward = rewards.find(r => r.id === red.reward_id);
                  return (
                    <tr key={red.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm">{new Date(red.redeemed_at).toLocaleDateString('id-ID')}</td>
                      <td className="px-4 py-2 text-sm">{patient?.full_name || '-'}</td>
                      <td className="px-4 py-2 text-sm">{reward?.name || '-'}</td>
                      <td className="px-4 py-2 text-sm text-right font-semibold text-primary">{red.points_used}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reward Modal */}
      {showRewardModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="font-bold">{editingReward ? 'Edit Reward' : 'Tambah Reward'}</h2>
              <button onClick={() => setShowRewardModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleRewardSubmit} className="p-4 space-y-3">
              <div><label className="text-sm">Nama Reward</label><input type="text" value={rewardForm.name} onChange={e => setRewardForm({...rewardForm, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required /></div>
              <div><label className="text-sm">Poin Dibutuhkan</label><input type="number" value={rewardForm.points_required} onChange={e => setRewardForm({...rewardForm, points_required: parseInt(e.target.value)})} className="w-full px-3 py-2 border rounded-lg" required /></div>
              <div><label className="text-sm">Stok</label><input type="number" value={rewardForm.stock} onChange={e => setRewardForm({...rewardForm, stock: parseInt(e.target.value)})} className="w-full px-3 py-2 border rounded-lg" /></div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setShowRewardModal(false)} className="px-3 py-1.5 border rounded-lg">Batal</button>
                <button type="submit" className="px-3 py-1.5 bg-primary text-white rounded-lg">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Loyalty;
