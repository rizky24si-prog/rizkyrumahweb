import React from 'react';
import { Tag, Calendar, Percent, Users } from 'lucide-react';

const ActivePromotions = ({ promotions = [], onViewDetail, onCopyCode }) => {
  if (promotions.length === 0) {
    return (
      <div className="card">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-txt-primary flex items-center gap-2">
            <Tag size={18} className="text-orange-500" />
            Promosi Aktif
          </h2>
        </div>
        <div className="p-8 text-center text-gray-500">
          <Tag size={40} className="mx-auto text-gray-300 mb-2" />
          <p>Tidak ada promosi aktif</p>
          <button className="mt-2 text-primary text-sm hover:underline">Buat Promosi Baru</button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-lg font-bold text-txt-primary flex items-center gap-2">
          <Tag size={18} className="text-orange-500" />
          Promosi Aktif
        </h2>
        <button className="text-xs text-primary hover:underline">Lihat Semua</button>
      </div>
      <div className="divide-y divide-gray-100">
        {promotions.map((promo) => (
          <div key={promo.id} className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-gray-900">{promo.name}</h3>
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                    {promo.discount_percent}% OFF
                  </span>
                </div>
                <p className="text-xs text-gray-500 flex items-center gap-2">
                  <Calendar size={10} />
                  {promo.start_date} - {promo.end_date}
                  {promo.quota && <span className="flex items-center gap-1"><Users size={10} /> Sisa {promo.quota}</span>}
                </p>
                {promo.coupon_code && (
                  <div className="mt-2 flex items-center gap-2">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                      {promo.coupon_code}
                    </code>
                    <button 
                      onClick={() => onCopyCode && onCopyCode(promo.coupon_code)}
                      className="text-xs text-primary hover:underline"
                    >
                      Salin
                    </button>
                  </div>
                )}
              </div>
              <button 
                onClick={() => onViewDetail && onViewDetail(promo.id)}
                className="text-gray-400 hover:text-primary"
              >
                <Percent size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivePromotions;
