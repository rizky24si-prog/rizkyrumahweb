import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, Eye, EyeOff, CheckCircle } from 'lucide-react';
import dentalAPI from '../../services/dentalAPI';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Password tidak cocok!');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter!');
      return;
    }
    if (!formData.username) {
      setError('Username harus diisi!');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Cek apakah username sudah ada
      const existingUser = await dentalAPI.users.getByUsername(formData.username);
      if (existingUser) {
        setError('Username sudah digunakan!');
        setIsLoading(false);
        return;
      }

      // Buat user baru
      const newUser = await dentalAPI.users.create({
        username: formData.username,
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password_hash: formData.password,
        role: 'admin',
        is_active: true,
        created_at: new Date().toISOString()
      });

      // Log activity
      try { await dentalAPI.activityLogs.log(1, 'CREATE', 'users', newUser[0]?.id || newUser.id, null, { username: formData.username }); } catch(e) { /* ignore logging errors */ }

      setSuccess('Akun berhasil dibuat! Silakan login.');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err) {
      console.error('Registration error:', err);
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Daftar Akun</h2>
        <p className="text-gray-500 mt-2 text-sm">Bergabunglah dengan Dental Plus hari ini</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100 flex items-center">
          <AlertCircle size={14} className="mr-2" /> {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 text-green-600 text-xs rounded-xl border border-green-100 flex items-center">
          <CheckCircle size={14} className="mr-2" /> {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 items-center">
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2 ml-1">Nama Lengkap</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="input-field w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Masukkan nama lengkap"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2 ml-1">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="input-field w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Masukkan username"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2 ml-1">Alamat Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input-field w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="nama@email.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2 ml-1">Nomor Telepon</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="input-field w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="0812..."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2 ml-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Minimal 6 karakter"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2 ml-1">Konfirmasi</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-field w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Ulangi password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Mendaftarkan...' : 'Buat Akun'}
        </button>

        <p className="text-center text-xs text-gray-500 pt-2">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-blue-600 font-bold hover:underline">Masuk</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;