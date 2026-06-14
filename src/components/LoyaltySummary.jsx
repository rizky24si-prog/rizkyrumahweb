import React from 'react';
import { Award, Gift, TrendingUp, Users } from 'lucide-react';

const LoyaltySummary = ({ 
  topPatients = [], 
  totalPointsIssued = 0,
  totalRewardsRedeemed = 0,
  activeMembers = 0,
  onViewLeaderboard,
  onManageRewards
}) => {
  return (
    <div className="card">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-bold text-txt-primary flex items-center gap-2">
          <Award size={18} className="text-yellow-500" />
          Program Loyalitas
        </h2>
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 p-4 border-b border-gray-100">
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">{totalPointsIssued.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Total Poin</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-secondary">{totalRewardsRedeemed}</p>
          <p className="text-xs text-gray-500">Reward Ditukar</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-third">{activeMembers}</p>
          <p className="text-xs text-gray-500">Member Aktif</p>
        </div>
      </div>

      {/* Top Patients */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <p className="text-sm font-semibold text-gray-700">Top Member</p>
          <button onClick={onViewLeaderboard} className="text-xs text-primary hover:underline">
            Lihat Semua
          </button>
        </div>
        <div className="space-y-3">
          {topPatients.map((patient, index) => (
            <div key={patient.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  index === 0 ? 'bg-yellow-500 text-white' :
                  index === 1 ? 'bg-gray-400 text-white' :
                  index === 2 ? 'bg-orange-500 text-white' :
                  'bg-gray-200 text-gray-500'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{patient.full_name}</p>
                  <p className="text-xs text-gray-400">{patient.phone}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary">{patient.points}</p>
                <p className="text-xs text-gray-400">poin</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={onManageRewards}
          className="w-full py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-semibold text-sm hover:opacity-90 transition flex items-center justify-center gap-2"
        >
          <Gift size={16} />
          Kelola Reward & Poin
        </button>
      </div>
    </div>
  );
};

export default LoyaltySummary;
