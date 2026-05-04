import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dataForm, setDataForm] = useState({
    username: "",
    password: "",
  });

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setDataForm({
      ...dataForm,
      [name]: value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!dataForm.username || !dataForm.password) {
      setError("Username dan password harus diisi!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post("https://dummyjson.com/auth/login", {
        username: dataForm.username,
        password: dataForm.password,
      });

      if (response.status === 200) {
        // Simpan token ke localStorage
        localStorage.setItem("token", response.data.accessToken);
        localStorage.setItem("user", JSON.stringify(response.data));
        
        // Redirect ke dashboard
        navigate("/");
      }
    } catch (err) {
      if (err.response) {
        // Error dari server (status 4xx atau 5xx)
        setError(err.response.data.message || "Username atau password salah!");
      } else if (err.request) {
        // Error jaringan
        setError("Tidak dapat terhubung ke server. Periksa koneksi internet Anda.");
      } else {
        // Error lainnya
        setError("Terjadi kesalahan. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Masuk ke Akun Anda</h2>
        <p className="text-gray-600 mt-2">
          Silakan masuk untuk melanjutkan ke dashboard
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700 text-sm">
          <AlertCircle size={16} className="mr-2 flex-shrink-0" />
          {error}
        </div>
      )}

      {loading && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center text-blue-700 text-sm">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent mr-2"></div>
          Memproses...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <div className="relative">
            <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="username"
              value={dataForm.username}
              onChange={handleChange}
              className="input-field pl-10"
              placeholder="Masukkan username"
              autoComplete="username"
              disabled={loading}
              required
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Demo: gunakan username "emilys"
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={dataForm.password}
              onChange={handleChange}
              className="input-field pl-10 pr-10"
              placeholder="Masukkan password Anda"
              autoComplete="current-password"
              disabled={loading}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              disabled={loading}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Demo: gunakan password "emilyspass"
          </p>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input 
              type="checkbox" 
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
              disabled={loading}
            />
            <span className="ml-2 text-sm text-gray-600">Ingat saya</span>
          </label>
          <Link to="/forgot" className="text-sm text-blue-600 hover:text-blue-700">
            Lupa password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
              Memproses...
            </>
          ) : (
            'Masuk'
          )}
        </button>

        <div className="text-center text-sm text-gray-600">
          Belum punya akun?{' '}
          <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
            Daftar sekarang
          </Link>
        </div>
      </form>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <p className="text-xs text-blue-800">
            Sistem terintegrasi dengan <span className="font-semibold">SATUSEHAT</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;