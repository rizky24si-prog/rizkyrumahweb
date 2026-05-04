import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-blue-600">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mt-4">Halaman Tidak Ditemukan</h2>
        <p className="text-gray-600 mt-2">Maaf, halaman yang Anda cari tidak tersedia.</p>
        <Link
          to="/"
          className="inline-flex items-center mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition"
        >
          <Home size={18} className="mr-2" />
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
};

export default NotFound;