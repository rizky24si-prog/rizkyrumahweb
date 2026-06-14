import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Download } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import dentalAPI from '../services/dentalAPI';

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ name: '', sku: '', stock: 0, unit: 'pcs', min_stock: 0 });

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await dentalAPI.inventory.getAll();
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const filtered = (items || []).filter(i => i.name?.toLowerCase().includes(searchTerm.toLowerCase()) || i.sku?.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleInput = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await dentalAPI.inventory.update(editingItem.id, formData);
      } else {
        await dentalAPI.inventory.create(formData);
      }
      await fetchItems();
      setShowForm(false);
      setEditingItem(null);
      setFormData({ name: '', sku: '', stock: 0, unit: 'pcs', min_stock: 0 });
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({ name: item.name || '', sku: item.sku || '', stock: item.stock || 0, unit: item.unit || 'pcs', min_stock: item.min_stock || 0 });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus item ini?')) {
      try {
        await dentalAPI.inventory.delete(id);
        await fetchItems();
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  const exportCSV = () => {
    const headers = ['SKU', 'Nama', 'Stok', 'Unit', 'Min Stock'];
    const rows = (items || []).map(i => [i.sku, i.name, i.stock, i.unit, i.min_stock]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <PageHeader title="Manajemen Inventory" subtitle="Kelola stok dan bahan habis pakai" onRefresh={fetchItems} onDownload={exportCSV} />

      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Cari item atau SKU..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
        </div>
        <button onClick={() => { setShowForm(true); setEditingItem(null); setFormData({ name: '', sku: '', stock: 0, unit: 'pcs', min_stock: 0 }); }} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition">
          <Plus size={18} />
          Item Baru
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Nama</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Stok</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Unit</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Min Stock</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">Memuat data...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">Tidak ada data inventory</td>
                </tr>
              ) : (
                filtered.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-mono text-primary">{item.sku}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">{item.name}</td>
                    <td className={`px-6 py-4 font-medium ${item.stock <= item.min_stock ? 'text-red-600' : 'text-gray-800'}`}>{item.stock}</td>
                    <td className="px-6 py-4">{item.unit}</td>
                    <td className="px-6 py-4">{item.min_stock}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(item)} className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded-lg transition" title="Edit"><Edit size={16} /></button>
                        <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition" title="Hapus"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">{editingItem ? 'Edit Item' : 'Tambah Item'}</h2>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded-lg">Tutup</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInput} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                  <input type="text" name="sku" value={formData.sku} onChange={handleInput} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stok</label>
                  <input type="number" name="stock" value={formData.stock} onChange={handleInput} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                  <input type="text" name="unit" value={formData.unit} onChange={handleInput} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Stock</label>
                  <input type="number" name="min_stock" value={formData.min_stock} onChange={handleInput} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Batal</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">{editingItem ? 'Update' : 'Simpan'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
