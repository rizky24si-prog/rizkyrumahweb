import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return setError('Password tidak cocok!');
    if (formData.password.length < 6) return setError('Password minimal 6 karakter!');

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/login');
    }, 1500);
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

      <form onSubmit={handleSubmit} className="space-y-5 items-center">
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2 ml-1">Nama Lengkap</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="input-field"
            placeholder="Masukkan nama lengkap"
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
            className="input-field"
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
            className="input-field"
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
                className="input-field"
                placeholder="Password"
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
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2 ml-1">Konfirmasi</label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input-field"
              placeholder="Ulangi"
              required
            />
          </div>
        </div>

        <button type="submit" disabled={isLoading} className="btn-primary mt-2 items-center justify-center font-semibold w-full"
>
          {isLoading ? 'Mendaftarkan...' : 'Buat Akun'}
        </button>

        <p className="text-center text-xs text-gray-500 pt-2">
          Sudah punya akun?{' '}
          <Link to="/" className="text-blue-600 font-bold hover:underline">Masuk</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;