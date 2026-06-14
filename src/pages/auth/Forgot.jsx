import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import dentalAPI from '../../services/dentalAPI';

const Forgot = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Cari user berdasarkan email (gunakan dentalAPI.getByEmail jika tersedia)
      let user = null;
      if (dentalAPI.users.getByEmail) {
        user = await dentalAPI.users.getByEmail(email);
      } else {
        const allUsers = await dentalAPI.users.getAll();
        user = (allUsers || []).find(u => u.email === email);
      }

      if (!user) {
        setError('Email tidak ditemukan dalam sistem!');
        setIsLoading(false);
        return;
      }

      // Simpan ke communication_logs jika tersedia
      try {
        if (dentalAPI.communicationLogs && dentalAPI.communicationLogs.logOutgoing) {
          await dentalAPI.communicationLogs.logOutgoing(
            user.id,
            'email',
            `Link reset password untuk ${user.full_name}: https://dentalplus.com/reset-password?email=${encodeURIComponent(email)}`,
            1
          );
        }
      } catch (e) {
        // ignore logging errors
      }

      setIsSubmitted(true);
    } catch (err) {
      console.error('Forgot password error:', err);
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-full mb-6 border-4 border-white shadow-sm">
          <CheckCircle size={32} className="text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Cek Email Anda</h2>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          Instruksi reset password telah dikirim ke <br />
          <span className="font-bold text-gray-800">{email}</span>
        </p>
        <Link
          to="/login"
          className="btn-primary inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-semibold transition"
        >
          <ArrowLeft size={16} /> Kembali ke Login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Lupa Password</h2>
        <p className="text-gray-500 mt-2 text-sm">Masukkan email untuk memulihkan akses</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100 flex items-center">
          <AlertCircle size={14} className="mr-2" /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 items-center">
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2 ml-1">Alamat Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="nama@email.com"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Mengirim...' : 'Kirim Link Reset'}
        </button>

        <div className="text-center">
          <Link to="/login" className="text-xs text-gray-500 hover:text-blue-600 font-bold transition-colors">
            Kembali ke Halaman Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Forgot;