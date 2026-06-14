import React from 'react';
import { AlertTriangle, CheckCircle, Package } from 'lucide-react';

const LowStockAlert = ({ items = [], onViewInventory }) => {
  const criticalItems = items.filter(item => item.stock <= 5);
  const lowItems = items.filter(item => item.stock > 5 && item.stock <= item.min_stock);
  const expiredItems = items.filter(item => item.expiry_date && new Date(item.expiry_date) < new Date());

  const hasAlerts = items.length > 0 || expiredItems.length > 0;

  if (!hasAlerts) {
    return (
      <div className="card bg-green-50 border-green-200">
        <div className="p-4 flex items-center gap-3">
          <CheckCircle size={24} className="text-green-500" />
          <div>
            <p className="font-semibold text-green-700">Semua Stok Aman</p>
            <p className="text-sm text-green-600">Tidak ada barang yang perlu diorder</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-lg font-bold text-txt-primary flex items-center gap-2">
          <AlertTriangle size={18} className="text-orange-500" />
          Peringatan Stok
        </h2>
        <button onClick={onViewInventory} className="text-xs text-primary hover:underline">
          Kelola Stok
        </button>
      </div>
      <div className="divide-y divide-gray-100">
        {criticalItems.map((item) => (
          <div key={item.id} className="p-3 bg-red-50">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Package size={16} className="text-red-500" />
                <div>
                  <p className="font-semibold text-red-700">{item.name}</p>
                  <p className="text-xs text-red-500">Stok: {item.stock} {item.unit} (Kritis!)</p>
                </div>
              </div>
              <button className="bg-red-600 text-white text-xs px-3 py-1 rounded hover:bg-red-700">
                Order
              </button>
            </div>
          </div>
        ))}
        {lowItems.map((item) => (
          <div key={item.id} className="p-3 bg-yellow-50">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Package size={16} className="text-yellow-500" />
                <div>
                  <p className="font-semibold text-yellow-700">{item.name}</p>
                  <p className="text-xs text-yellow-500">Stok: {item.stock} {item.unit} (Min: {item.min_stock})</p>
                </div>
              </div>
              <button className="text-yellow-700 text-xs font-semibold hover:underline">
                Pesan
              </button>
            </div>
          </div>
        ))}
        {expiredItems.map((item) => (
          <div key={item.id} className="p-3 bg-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-700">{item.name}</p>
                <p className="text-xs text-gray-500">Kadaluarsa: {item.expiry_date}</p>
              </div>
              <button className="text-gray-600 text-xs font-semibold">
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LowStockAlert;
