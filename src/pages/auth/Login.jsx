import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import dentalAPI from '../../services/dentalAPI';

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
      // Gunakan dentalAPI untuk cari user
      const user = await dentalAPI.users.getByUsername(dataForm.username);

      if (!user) {
        setError("Username atau password salah!");
        setLoading(false);
        return;
      }

      // Verifikasi password (demo uses password_hash)
      if (user.password_hash !== dataForm.password) {
        setError("Username atau password salah!");
        setLoading(false);
        return;
      }

      // Simpan data user ke localStorage
      localStorage.setItem("token", `fake-jwt-token-${user.id}`);
      localStorage.setItem("user", JSON.stringify({
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        email: user.email,
        role: user.role
      }));
      
      navigate("/dashboard");
      
    } catch (err) {
      console.error("Login error:", err);
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Dental Plus</h2>
        <p className="text-gray-500 mt-2 text-sm">
          Silakan masuk untuk mengakses rekam medis
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100 animate-pulse">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 items-center">
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2 ml-1">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={dataForm.username}
            onChange={handleChange}
            className="input-field"
            placeholder="Masukkan username"
            disabled={loading}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2 ml-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={dataForm.password}
              onChange={handleChange}
              className="input-field"
              placeholder="Masukkan password"
              disabled={loading}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary
          items-center justify-center font-semibold w-full"
        >
          {loading ? 'Memproses...' : 'Masuk ke Dashboard'}
        </button>

        <div className="flex flex-col gap-3 text-center pt-2">
          <Link to="/forgot" className="text-xs text-blue-600 font-semibold hover:underline">
            Lupa password?
          </Link>
          <p className="text-xs text-gray-500">
            Belum punya akun?{' '}
            <Link to="/register" className="text-blue-600 font-bold hover:underline">
              Daftar
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;