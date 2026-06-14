import React from 'react';
import { Activity, TrendingUp } from 'lucide-react';

const TopTreatments = ({ treatments = [] }) => {
  const maxCount = Math.max(...treatments.map(t => t.count), 1);

  return (
    <div className="card">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-bold text-txt-primary flex items-center gap-2">
          <Activity size={18} className="text-third" />
          Perawatan Terlaris
        </h2>
        <p className="text-sm text-gray-500 mt-1">Bulan ini</p>
      </div>
      <div className="p-4 space-y-4">
        {treatments.map((treatment, index) => (
          <div key={treatment.id}>
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-400 w-6">{index + 1}.</span>
                <span className="font-medium text-gray-700">{treatment.name}</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{treatment.count} x</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 ml-8">
              <div 
                className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all"
                style={{ width: `${(treatment.count / maxCount) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopTreatments;
