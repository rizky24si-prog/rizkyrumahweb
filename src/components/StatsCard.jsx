import React from 'react';

const StatsCard = ({ title, value, change, icon: Icon, color, prefix = '', suffix = '' }) => {
  const isPositive = change && change.startsWith('+');
  const changeColor = isPositive ? 'text-green-600' : 'text-red-600';

  return (
    <div className="stat-card">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${color}`}>
          <Icon className="text-white" size={24} />
        </div>
        {change && <span className={`text-sm font-bold ${changeColor}`}>{change}</span>}
      </div>
      <h3 className="text-2xl font-bold text-gray-900">{prefix}{value}{suffix}</h3>
      <p className="text-sm text-gray-500 mt-1 font-medium">{title}</p>
    </div>
  );
};

export default StatsCard;
