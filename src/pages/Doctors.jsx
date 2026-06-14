import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, User, Calendar, MapPin } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import dentalAPI from '../services/dentalAPI';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    phone: '',
    email: '',
    address: '',
    schedule_notes: ''
  });

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const data = await dentalAPI.doctors.getAll();
      setDoctors(data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const filtered = (doctors || []).filter(d =>
    d.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInput = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDoctor) {
        await dentalAPI.doctors.update(editingDoctor.id, formData);
      } else {
        await dentalAPI.doctors.create(formData);
      }
      await fetchDoctors();
      setShowForm(false);
      setEditingDoctor(null);
      setFormData({ name: '', specialization: '', phone: '', email: '', address: '', schedule_notes: '' });
    } catch (error) {
      console.error('Error saving doctor:', error);
    }
  };

  const handleEdit = (doc) => {
    setEditingDoctor(doc);
    setFormData({
      name: doc.name || '',
      specialization: doc.specialization || '',
      phone: doc.phone || '',
      email: doc.email || '',
      address: doc.address || '',
      schedule_notes: doc.schedule_notes || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus dokter ini?')) {
      try {
        await dentalAPI.doctors.delete(id);
        await fetchDoctors();
      } catch (error) {
        console.error('Error deleting doctor:', error);
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <PageHeader title="Manajemen Dokter" subtitle="Kelola data dokter dan jadwal" onRefresh={fetchDoctors} />

      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Cari dokter atau spesialisasi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingDoctor(null); setFormData({ name: '', specialization: '', phone: '', email: '', address: '', schedule_notes: '' }); }}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition"
        >
          <Plus size={18} />
          Dokter Baru
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Nama</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Spesialis</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">No HP</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">Memuat data...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <User size={40} className="mx-auto text-gray-300 mb-2" />
                    Tidak ada data dokter
                  </td>
                </tr>
              ) : (
                filtered.map(doc => (
                  <tr key={doc.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-800">{doc.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{doc.specialization}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{doc.phone || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{doc.email || '-'}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(doc)} className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded-lg transition" title="Edit"><Edit size={16} /></button>
                        <button onClick={() => handleDelete(doc.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition" title="Hapus"><Trash2 size={16} /></button>
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
          <div className="bg-white rounded-2xl max-w-xl w-full">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">{editingDoctor ? 'Edit Dokter' : 'Tambah Dokter'}</h2>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded-lg">Tutup</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInput} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Spesialis</label>
                  <input type="text" name="specialization" value={formData.specialization} onChange={handleInput} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">No HP</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInput} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInput} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                  <input type="text" name="address" value={formData.address} onChange={handleInput} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catatan Jadwal</label>
                  <textarea name="schedule_notes" value={formData.schedule_notes} onChange={handleInput} rows="2" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Batal</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">{editingDoctor ? 'Update' : 'Simpan'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doctors;
