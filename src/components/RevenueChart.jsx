import React from 'react';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

const RevenueChart = ({ data = [], period = 'weekly', onPeriodChange }) => {
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const percentageChange = data.length >= 2 
    ? ((data[data.length-1].revenue - data[data.length-2].revenue) / data[data.length-2].revenue * 100).toFixed(1)
    : 0;
  const isPositive = percentageChange >= 0;

  const maxRevenue = Math.max(...data.map(d => d.revenue), 1);

  const periods = ['daily', 'weekly', 'monthly', 'yearly'];

  return (
    <div className="card">
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-txt-primary flex items-center gap-2">
              <DollarSign size={18} className="text-green-500" />
              Pendapatan
            </h2>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              Rp {totalRevenue.toLocaleString()}
            </p>
            <p className={`text-sm flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {percentageChange}% dari periode sebelumnya
            </p>
          </div>
          <div className="flex gap-2">
            {periods.map((p) => (
              <button
                key={p}
                onClick={() => onPeriodChange && onPeriodChange(p)}
                className={`px-3 py-1 text-xs rounded-lg font-medium transition ${
                  period === p 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="relative h-64">
          <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between h-full">
            {data.map((item, index) => {
              const height = (item.revenue / maxRevenue) * 100;
              return (
                <div key={index} className="flex flex-col items-center w-12 group">
                  <div 
                    className="w-8 bg-gradient-to-t from-primary to-secondary rounded-t-lg transition-all duration-300 hover:opacity-80 cursor-pointer"
                    style={{ height: `${height}%`, minHeight: '4px' }}
                  >
                    <div className="opacity-0 group-hover:opacity-100 transition bg-black text-white text-xs rounded px-2 py-1 absolute -mt-8 -ml-4">
                      Rp {item.revenue.toLocaleString()}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 mt-2 rotate-45 origin-top-left">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
