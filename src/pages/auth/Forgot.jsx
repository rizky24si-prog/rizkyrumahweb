import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';

const Forgot = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
    }, 1500);
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
          className="btn-primary inline-flex items-center justify-center gap-2"
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

      <form onSubmit={handleSubmit} className="space-y-6 items-center">
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2 ml-1">Alamat Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            placeholder="nama@email.com"
            required
          />
        </div>

        <button type="submit" disabled={isLoading} className="btn-primary items-center justify-center font-semibold w-full">
          {isLoading ? 'Mengirim...' : 'Kirim Link Reset'}
        </button>

        <div className="text-center">
          <Link to="/" className="text-xs text-gray-500 hover:text-blue-600 font-bold transition-colors">
            Masuk di sini
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Forgot;