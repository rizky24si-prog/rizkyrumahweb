import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-700">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <Link to="/">
            <h1 className="text-4xl font-bold text-white mb-2">Dental Plus</h1>
            <p className="text-blue-100">Aplikasi Rekam Medis Klinik Gigi Terintegrasi SATUSEHAT</p>
          </Link>
        </div>
        
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <Outlet />
          </div>
        </div>
        
        <div className="text-center mt-8 text-white text-sm">
          © 2024 Dental Plus. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;